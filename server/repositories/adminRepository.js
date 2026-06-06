const { getDB } = require('../db/database');

class AdminRepository {
  static listMapeadores(page = 1, limit = 50) {
    const db = getDB();
    const offset = (page - 1) * limit;
    const total = db.prepare('SELECT COUNT(*) as total FROM mapeadores').get();
    const rows = db.prepare(
      'SELECT id, nome, email, admin, criado_em, ultimo_acesso FROM mapeadores ORDER BY criado_em DESC LIMIT ? OFFSET ?'
    ).all(limit, offset);
    return { rows, total: total.total, page, limit };
  }

  static findMapeadorById(id) {
    const db = getDB();
    return db.prepare(
      'SELECT id, nome, email, admin, criado_em, ultimo_acesso FROM mapeadores WHERE id=?'
    ).get(id);
  }

  static updateMapeador(id, fields) {
    const db = getDB();
    const setClauses = [];
    const vals = [];
    if (fields.nome !== undefined) { setClauses.push('nome=?'); vals.push(fields.nome); }
    if (fields.admin !== undefined) { setClauses.push('admin=?'); vals.push(fields.admin ? 1 : 0); }
    if (!setClauses.length) return null;
    vals.push(id);
    db.prepare(`UPDATE mapeadores SET ${setClauses.join(',')} WHERE id=?`).run(...vals);
    return this.findMapeadorById(id);
  }

  static deleteMapeador(id) {
    const db = getDB();
    db.prepare('DELETE FROM mapeadores WHERE id=?').run(id);
  }

  static listAuditLog(page = 1, limit = 50, redeId = null) {
    const db = getDB();
    const offset = (page - 1) * limit;
    let where = '';
    const params = [];
    if (redeId) { where = 'WHERE rede_id=?'; params.push(redeId); }
    const total = db.prepare(`SELECT COUNT(*) as total FROM audit_log ${where}`).get(...params);
    const rows = db.prepare(`
      SELECT al.*, m.nome as mapeador_nome
      FROM audit_log al
      LEFT JOIN mapeadores m ON m.id=al.mapeador_id
      ${where}
      ORDER BY al.timestamp DESC LIMIT ? OFFSET ?
    `).all(...params, limit, offset);
    return { rows, total: total.total, page, limit };
  }

  static getMetrics() {
    const db = getDB();
    const totalMapeadores = db.prepare('SELECT COUNT(*) as c FROM mapeadores').get().c;
    const totalRedes = db.prepare('SELECT COUNT(*) as c FROM redes').get().c;
    const totalActantes = db.prepare('SELECT COUNT(*) as c FROM actantes').get().c;
    const totalAssociacoes = db.prepare('SELECT COUNT(*) as c FROM associacoes').get().c;
    const totalCaixasPretas = db.prepare('SELECT COUNT(*) as c FROM caixas_pretas').get().c;
    const totalAuditLog = db.prepare('SELECT COUNT(*) as c FROM audit_log').get().c;
    const mapeadoresAtivosHoje = db.prepare(
      "SELECT COUNT(*) as c FROM mapeadores WHERE ultimo_acesso >= datetime('now', '-1 day')"
    ).get().c;
    const redesPorDia = db.prepare(`
      SELECT date(criado_em) as dia, COUNT(*) as total
      FROM redes WHERE criado_em >= datetime('now', '-30 days')
      GROUP BY dia ORDER BY dia DESC
    `).all();
    return {
      totalMapeadores, totalRedes, totalActantes, totalAssociacoes,
      totalCaixasPretas, totalAuditLog, mapeadoresAtivosHoje, redesPorDia
    };
  }

  static getDBInfo() {
    const db = getDB();
    const dbPath = db.name;
    const { page_size, page_count } = db.prepare('PRAGMA page_count').get();
    const freelist = db.prepare('PRAGMA freelist_count').get();
    const sizeKB = (page_count * page_size) / 1024;
    const walMode = db.prepare('PRAGMA journal_mode').get();
    return {
      path: dbPath,
      sizeKB: Math.round(sizeKB),
      pageSize: page_size,
      pageCount: page_count,
      freelistPages: freelist,
      journalMode: walMode.journal_mode,
      version: db.prepare('SELECT sqlite_version() as v').get().v
    };
  }

  static getConfig() {
    const db = getDB();
    const rows = db.prepare('SELECT * FROM config ORDER BY chave').all();
    return rows;
  }

  static upsertConfig(chave, valor) {
    const db = getDB();
    db.prepare('INSERT OR REPLACE INTO config (chave, valor) VALUES (?,?)').run(chave, valor);
  }
}

module.exports = AdminRepository;
