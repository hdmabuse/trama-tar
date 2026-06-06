const { getDB } = require('../db/database');
const { v4: uuid } = require('uuid');

class CobrancaRepository {
  // ---- Planos ----
  static listPlanos(apenasAtivos = false) {
    const db = getDB();
    const where = apenasAtivos ? 'WHERE ativo=1' : '';
    return db.prepare(`SELECT * FROM planos ${where} ORDER BY preco ASC`).all();
  }

  static findPlanoById(id) {
    const db = getDB();
    return db.prepare('SELECT * FROM planos WHERE id=?').get(id);
  }

  static createPlano(data) {
    const db = getDB();
    const id = uuid();
    db.prepare(`INSERT INTO planos (id,nome,descricao,preco,moeda,intervalo,recursos,mp_plan_id)
      VALUES (?,?,?,?,?,?,?,?)`).run(id, data.nome, data.descricao || null, data.preco,
      data.moeda || 'BRL', data.intervalo || 'month',
      JSON.stringify(data.recursos || []), data.mp_plan_id || null);
    return this.findPlanoById(id);
  }

  static updatePlano(id, data) {
    const db = getDB();
    const campos = ['nome', 'descricao', 'preco', 'moeda', 'intervalo', 'ativo', 'mp_plan_id'];
    const sets = [], vals = [];
    campos.forEach(c => {
      if (data[c] !== undefined) {
        if (c === 'recursos') { sets.push('recursos=?'); vals.push(JSON.stringify(data[c])); }
        else if (c === 'ativo') { sets.push('ativo=?'); vals.push(data[c] ? 1 : 0); }
        else { sets.push(`${c}=?`); vals.push(data[c]); }
      }
    });
    if (!sets.length) return this.findPlanoById(id);
    vals.push(id);
    db.prepare(`UPDATE planos SET ${sets.join(',')} WHERE id=?`).run(...vals);
    return this.findPlanoById(id);
  }

  // ---- Assinaturas ----
  static listAssinaturas(page = 1, limit = 50) {
    const db = getDB();
    const offset = (page - 1) * limit;
    const total = db.prepare('SELECT COUNT(*) as c FROM assinaturas').get();
    const rows = db.prepare(`
      SELECT a.*, m.nome as mapeador_nome, m.email as mapeador_email, p.nome as plano_nome
      FROM assinaturas a
      JOIN mapeadores m ON m.id=a.mapeador_id
      JOIN planos p ON p.id=a.plano_id
      ORDER BY a.criado_em DESC LIMIT ? OFFSET ?
    `).all(limit, offset);
    return { rows, total: total.c, page, limit };
  }

  static findAssinaturaByMapeador(mapeadorId) {
    const db = getDB();
    return db.prepare(`
      SELECT a.*, p.nome as plano_nome, p.preco as plano_preco
      FROM assinaturas a JOIN planos p ON p.id=a.plano_id
      WHERE a.mapeador_id=? AND a.status='ativa'
      ORDER BY a.criado_em DESC LIMIT 1
    `).get(mapeadorId);
  }

  static findAssinaturaById(id) {
    const db = getDB();
    return db.prepare(`
      SELECT a.*, m.nome as mapeador_nome, m.email as mapeador_email, p.nome as plano_nome
      FROM assinaturas a
      JOIN mapeadores m ON m.id=a.mapeador_id
      JOIN planos p ON p.id=a.plano_id
      WHERE a.id=?
    `).get(id);
  }

  static createAssinatura(data) {
    const db = getDB();
    const id = uuid();
    db.prepare(`INSERT INTO assinaturas (id,mapeador_id,plano_id,status,mp_sub_id,mp_preapproval_id,inicio_em,expira_em)
      VALUES (?,?,?,?,?,?,?,?)`).run(id, data.mapeador_id, data.plano_id, data.status || 'ativa',
      data.mp_sub_id || null, data.mp_preapproval_id || null, data.inicio_em || new Date().toISOString(),
      data.expira_em || null);
    return this.findAssinaturaById(id);
  }

  static updateAssinatura(id, data) {
    const db = getDB();
    const campos = ['status', 'mp_sub_id', 'mp_preapproval_id', 'ciclo_atual', 'expira_em', 'cancelada_em'];
    const sets = [], vals = [];
    campos.forEach(c => {
      if (data[c] !== undefined) { sets.push(`${c}=?`); vals.push(data[c]); }
    });
    if (!sets.length) return this.findAssinaturaById(id);
    vals.push(id);
    db.prepare(`UPDATE assinaturas SET ${sets.join(',')} WHERE id=?`).run(...vals);
    return this.findAssinaturaById(id);
  }

  static cancelAssinatura(id) {
    const db = getDB();
    db.prepare(`UPDATE assinaturas SET status='cancelada', cancelada_em=datetime('now') WHERE id=?`).run(id);
  }

  // ---- Pagamentos ----
  static listPagamentos(page = 1, limit = 50) {
    const db = getDB();
    const offset = (page - 1) * limit;
    const total = db.prepare('SELECT COUNT(*) as c FROM pagamentos').get();
    const rows = db.prepare(`
      SELECT pg.*, m.nome as mapeador_nome, m.email as mapeador_email, p.nome as plano_nome
      FROM pagamentos pg
      JOIN mapeadores m ON m.id=pg.mapeador_id
      JOIN planos p ON p.id=pg.plano_id
      ORDER BY pg.criado_em DESC LIMIT ? OFFSET ?
    `).all(limit, offset);
    return { rows, total: total.c, page, limit };
  }

  static listPagamentosPorAssinatura(assinaturaId) {
    const db = getDB();
    return db.prepare(`
      SELECT * FROM pagamentos WHERE assinatura_id=? ORDER BY criado_em DESC
    `).all(assinaturaId);
  }

  static createPagamento(data) {
    const db = getDB();
    const id = uuid();
    db.prepare(`INSERT INTO pagamentos (id,assinatura_id,mapeador_id,plano_id,valor,moeda,status,mp_payment_id,mp_preference_id,forma_pagamento,parcelas)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(id, data.assinatura_id, data.mapeador_id, data.plano_id,
      data.valor, data.moeda || 'BRL', data.status || 'pendente',
      data.mp_payment_id || null, data.mp_preference_id || null,
      data.forma_pagamento || null, data.parcelas || 1);
    return this.findPagamentoById(id);
  }

  static findPagamentoById(id) {
    const db = getDB();
    return db.prepare(`
      SELECT pg.*, m.nome as mapeador_nome, p.nome as plano_nome
      FROM pagamentos pg
      JOIN mapeadores m ON m.id=pg.mapeador_id
      JOIN planos p ON p.id=pg.plano_id
      WHERE pg.id=?
    `).get(id);
  }

  static updatePagamento(id, data) {
    const db = getDB();
    const campos = ['status', 'mp_payment_id', 'forma_pagamento', 'parcelas', 'pago_em'];
    const sets = [], vals = [];
    campos.forEach(c => {
      if (data[c] !== undefined) { sets.push(`${c}=?`); vals.push(data[c]); }
    });
    if (!sets.length) return this.findPagamentoById(id);
    vals.push(id);
    db.prepare(`UPDATE pagamentos SET ${sets.join(',')} WHERE id=?`).run(...vals);
    return this.findPagamentoById(id);
  }

  // ---- Dashboard ----
  static getFaturamento() {
    const db = getDB();
    const receitaTotal = db.prepare(
      "SELECT COALESCE(SUM(valor),0) as total FROM pagamentos WHERE status='aprovado'"
    ).get().total;
    const receitaMes = db.prepare(
      "SELECT COALESCE(SUM(valor),0) as total FROM pagamentos WHERE status='aprovado' AND criado_em >= datetime('now', '-30 days')"
    ).get().total;
    const assinaturasAtivas = db.prepare(
      "SELECT COUNT(*) as c FROM assinaturas WHERE status='ativa'"
    ).get().c;
    const assinaturasCanceladas = db.prepare(
      "SELECT COUNT(*) as c FROM assinaturas WHERE status='cancelada'"
    ).get().c;
    const pagamentosPendentes = db.prepare(
      "SELECT COUNT(*) as c FROM pagamentos WHERE status='pendente'"
    ).get().c;
    const pagamentosPorDia = db.prepare(`
      SELECT date(criado_em) as dia, COUNT(*) as total, COALESCE(SUM(valor),0) as receita
      FROM pagamentos WHERE criado_em >= datetime('now', '-30 days')
      GROUP BY dia ORDER BY dia DESC
    `).all();
    return { receitaTotal, receitaMes, assinaturasAtivas, assinaturasCanceladas, pagamentosPendentes, pagamentosPorDia };
  }
}

module.exports = CobrancaRepository;
