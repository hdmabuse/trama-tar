const { getDB } = require('../db/database');
const { v4: uuid } = require('uuid');

class AssociacaoRepository {
  static findAllByRede(redeId) {
    const db = getDB();
    return db.prepare('SELECT * FROM associacoes WHERE rede_id=? ORDER BY registrado_em').all(redeId);
  }

  static findById(associacaoId, redeId) {
    const db = getDB();
    return db.prepare('SELECT * FROM associacoes WHERE id=? AND rede_id=?').get(associacaoId, redeId);
  }

  static create(data, redeId, mapeadorId) {
    const db = getDB();
    const id = uuid();
    const { origem_id, destino_id, modo_acao, direcao, intensidade,
      descricao_traducao, status, fonte, no_plasma, criterio_confirmacao } = data;

    db.prepare(`INSERT INTO associacoes (id,rede_id,origem_id,destino_id,modo_acao,direcao,
      intensidade,descricao_traducao,status,fonte,no_plasma,criterio_confirmacao,registrado_por)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`)
      .run(id, redeId, origem_id, destino_id, modo_acao,
        direcao || 'unidirecional', intensidade || 3, descricao_traducao || null,
        status || 'ativa', fonte || 'observacao_campo', no_plasma ? 1 : 0,
        criterio_confirmacao || null, mapeadorId);

    return db.prepare('SELECT * FROM associacoes WHERE id=?').get(id);
  }

  static update(associacaoId, redeId, updates) {
    const db = getDB();
    const campos = ['modo_acao', 'direcao', 'intensidade', 'descricao_traducao', 'status', 'fonte',
      'posicao_contestacao', 'no_plasma', 'criterio_confirmacao'];
    const filteredUpdates = [], vals = [];
    campos.forEach(c => {
      if (updates[c] !== undefined) {
        filteredUpdates.push(`${c}=?`);
        vals.push(c === 'no_plasma' ? updates[c] ? 1 : 0 : updates[c]);
      }
    });
    if (!filteredUpdates.length) return this.findById(associacaoId, redeId);
    vals.push(associacaoId, redeId);
    db.prepare(`UPDATE associacoes SET ${filteredUpdates.join(',')} WHERE id=? AND rede_id=?`).run(...vals);
    return db.prepare('SELECT * FROM associacoes WHERE id=?').get(associacaoId);
  }

  static delete(associacaoId, redeId) {
    const db = getDB();
    db.prepare('DELETE FROM associacoes WHERE id=? AND rede_id=?').run(associacaoId, redeId);
    return true;
  }
}

module.exports = AssociacaoRepository;