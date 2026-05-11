const { getDB } = require('../db/database');
const { v4: uuid } = require('uuid');

class ActanteRepository {
  static findAllByRede(redeId) {
    const db = getDB();
    return db.prepare('SELECT * FROM actantes WHERE rede_id=? ORDER BY registrado_em').all(redeId);
  }

  static findById(actanteId, redeId) {
    const db = getDB();
    return db.prepare('SELECT * FROM actantes WHERE id=? AND rede_id=?').get(actanteId, redeId);
  }

  static create(data, redeId, mapeadorId) {
    const db = getDB();
    const id = uuid();
    const { nome, descricao, tags, modos_agencia, status, no_plasma, pre_campo,
      plasma_relacao_controversia, fonte, pos_x, pos_y } = data;

    db.prepare(`INSERT INTO actantes (id,rede_id,nome,descricao,tags,modos_agencia,status,
      no_plasma,pre_campo,plasma_relacao_controversia,registrado_por,fonte,pos_x,pos_y,distribuido)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,0)`)
      .run(id, redeId, nome.trim(), descricao || null,
        JSON.stringify(tags || []), JSON.stringify(modos_agencia || []),
        status || 'em_formacao', no_plasma ? 1 : 0, pre_campo ? 1 : 0,
        plasma_relacao_controversia || null, mapeadorId,
        fonte || 'observacao_campo', pos_x || 0, pos_y || 0);

    return db.prepare('SELECT * FROM actantes WHERE id=?').get(id);
  }

  static update(actanteId, redeId, updates, mapeadorId) {
    const db = getDB();
    const atual = this.findById(actanteId, redeId);
    if (!atual) return null;

    db.prepare('INSERT INTO actante_versoes (id,actante_id,campos_anteriores,modificado_por,justificativa) VALUES (?,?,?,?,?)')
      .run(uuid(), actanteId, JSON.stringify(atual), mapeadorId, updates.justificativa || null);

    const campos = ['nome', 'descricao', 'status', 'no_plasma', 'pre_campo',
      'plasma_relacao_controversia', 'fonte', 'pos_x', 'pos_y', 'distribuido'];
    const filteredUpdates = [], vals = [];
    campos.forEach(c => {
      if (updates[c] !== undefined) {
        filteredUpdates.push(`${c}=?`);
        vals.push(['no_plasma', 'pre_campo', 'distribuido'].includes(c) ? updates[c] ? 1 : 0 : updates[c]);
      }
    });
    if (updates.tags !== undefined) { filteredUpdates.push('tags=?'); vals.push(JSON.stringify(updates.tags)); }
    if (updates.modos_agencia !== undefined) { filteredUpdates.push('modos_agencia=?'); vals.push(JSON.stringify(updates.modos_agencia)); }

    if (filteredUpdates.length) {
      vals.push(actanteId, redeId);
      db.prepare(`UPDATE actantes SET ${filteredUpdates.join(',')} WHERE id=? AND rede_id=?`).run(...vals);
    }

    return db.prepare('SELECT * FROM actantes WHERE id=?').get(actanteId);
  }

  static softDelete(actanteId, redeId) {
    const db = getDB();
    const transaction = db.transaction(() => {
      db.prepare("UPDATE actantes SET status='disperso' WHERE id=? AND rede_id=?")
        .run(actanteId, redeId);
      db.prepare("UPDATE associacoes SET status='historica' WHERE (origem_id=? OR destino_id=?) AND rede_id=?")
        .run(actanteId, actanteId, redeId);
    });
    transaction();
    return true;
  }
}

module.exports = ActanteRepository;