const { getDB } = require('../db/database');
const { v4: uuid } = require('uuid');

class RedeRepository {
  static findAllByMapeador(mapeadorId) {
    const db = getDB();
    return db.prepare(`
      SELECT r.*,
        (SELECT COUNT(*) FROM actantes a WHERE a.rede_id=r.id AND a.no_plasma=0 AND a.status!='disperso') as total_actantes,
        (SELECT COUNT(*) FROM actantes a WHERE a.rede_id=r.id AND a.no_plasma=1) as total_plasma,
        (SELECT COUNT(*) FROM actantes a WHERE a.rede_id=r.id AND a.status='contestado') as contestados,
        (SELECT COUNT(*) FROM associacoes x WHERE x.rede_id=r.id) as total_assocs,
        (SELECT COUNT(*) FROM associacoes x WHERE x.rede_id=r.id AND x.modo_acao='mediador') as mediadores,
        (SELECT COUNT(*) FROM associacoes x WHERE x.rede_id=r.id AND x.modo_acao IS NULL) as assocs_sem_modo
      FROM redes r WHERE r.mapeador_id=? ORDER BY r.atualizado_em DESC
    `).all(mapeadorId);
  }

  static findById(redeId, mapeadorId) {
    const db = getDB();
    return db.prepare('SELECT * FROM redes WHERE id=? AND mapeador_id=?').get(redeId, mapeadorId);
  }

  static create(data, mapeadorId) {
    const db = getDB();
    const id = uuid();
    const { nome, controversia, materia_de_preocupacao, perspectiva_mapeador,
      escopo_temporal, escopo_espacial } = data;

    db.prepare(`INSERT INTO redes (id,nome,controversia,materia_de_preocupacao,
      perspectiva_mapeador,escopo_temporal,escopo_espacial,mapeador_id,atividade_atual)
      VALUES (?,?,?,?,?,?,?,?,0)`)
      .run(id, nome, controversia || null, materia_de_preocupacao || null,
        perspectiva_mapeador || null, escopo_temporal || null, escopo_espacial || null, mapeadorId);

    db.prepare(`INSERT INTO actantes (id,rede_id,nome,tipo,status,registrado_por)
      VALUES (?,?,?,'mapeador','estabilizado',?)`)
      .run(uuid(), id, `Mapeador: ${data.mapeadorNome}`, mapeadorId);

    if (Array.isArray(data.actantes_pre_campo)) {
      const ins = db.prepare(`INSERT INTO actantes (id,rede_id,nome,status,pre_campo,registrado_por,fonte)
        VALUES (?,?,?,'em_formacao',1,?,'pre_campo')`);
      data.actantes_pre_campo.filter(n => n && n.trim()).forEach(n => ins.run(uuid(), id, n.trim(), mapeadorId));
    }

    return db.prepare('SELECT * FROM redes WHERE id=?').get(id);
  }

  static update(redeId, mapeadorId, updates) {
    const db = getDB();
    const campos = ['nome', 'controversia', 'materia_de_preocupacao', 'perspectiva_mapeador',
      'escopo_temporal', 'escopo_espacial', 'atividade_atual'];
    const filteredUpdates = [], vals = [];
    campos.forEach(c => {
      if (updates[c] !== undefined) {
        filteredUpdates.push(`${c}=?`);
        vals.push(updates[c]);
      }
    });
    if (!filteredUpdates.length) return this.findById(redeId, mapeadorId);
    filteredUpdates.push("atualizado_em=datetime('now')");
    vals.push(redeId, mapeadorId);
    db.prepare(`UPDATE redes SET ${filteredUpdates.join(',')} WHERE id=? AND mapeador_id=?`).run(...vals);
    return db.prepare('SELECT * FROM redes WHERE id=?').get(redeId);
  }

  static delete(redeId) {
    const db = getDB();
    db.prepare('DELETE FROM redes WHERE id=?').run(redeId);
    return true;
  }

  static touch(redeId) {
    const db = getDB();
    db.prepare("UPDATE redes SET atualizado_em=datetime('now') WHERE id=?").run(redeId);
  }
}

module.exports = RedeRepository;