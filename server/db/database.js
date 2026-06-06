const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const DB_PATH = config.dbPath || path.join(__dirname, '../../data/trama-tar.db');
const SCHEMA_PATH = path.join(__dirname, '../../db/schema.sql');

const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

let db;

function runMigrations() {
  const hasAdminColumn = db.prepare(
    "SELECT COUNT(*) as c FROM pragma_table_info('mapeadores') WHERE name='admin'"
  ).get().c > 0;
  if (!hasAdminColumn) {
    db.exec("ALTER TABLE mapeadores ADD COLUMN admin INTEGER NOT NULL DEFAULT 0");
    console.log('✓ Migration: coluna admin adicionada a mapeadores');
  }
  const hasConfigTable = db.prepare(
    "SELECT COUNT(*) as c FROM sqlite_master WHERE type='table' AND name='config'"
  ).get().c > 0;
  if (!hasConfigTable) {
    db.exec("CREATE TABLE IF NOT EXISTS config (chave TEXT PRIMARY KEY, valor TEXT)");
    console.log('✓ Migration: tabela config criada');
  }
  const hasPlanosTable = db.prepare(
    "SELECT COUNT(*) as c FROM sqlite_master WHERE type='table' AND name='planos'"
  ).get().c > 0;
  if (!hasPlanosTable) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS planos (id TEXT PRIMARY KEY, nome TEXT NOT NULL, descricao TEXT, preco REAL NOT NULL, moeda TEXT NOT NULL DEFAULT 'BRL', intervalo TEXT NOT NULL DEFAULT 'month', recursos TEXT DEFAULT '[]', ativo INTEGER NOT NULL DEFAULT 1, mp_plan_id TEXT, criado_em TEXT NOT NULL DEFAULT (datetime('now')));
      CREATE TABLE IF NOT EXISTS assinaturas (id TEXT PRIMARY KEY, mapeador_id TEXT NOT NULL, plano_id TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'ativa', mp_sub_id TEXT, mp_preapproval_id TEXT, ciclo_atual INTEGER NOT NULL DEFAULT 1, inicio_em TEXT NOT NULL DEFAULT (datetime('now')), expira_em TEXT, cancelada_em TEXT, criado_em TEXT NOT NULL DEFAULT (datetime('now')), FOREIGN KEY (mapeador_id) REFERENCES mapeadores(id) ON DELETE CASCADE, FOREIGN KEY (plano_id) REFERENCES planos(id) ON DELETE RESTRICT);
      CREATE TABLE IF NOT EXISTS pagamentos (id TEXT PRIMARY KEY, assinatura_id TEXT NOT NULL, mapeador_id TEXT NOT NULL, plano_id TEXT NOT NULL, valor REAL NOT NULL, moeda TEXT NOT NULL DEFAULT 'BRL', status TEXT NOT NULL DEFAULT 'pendente', mp_payment_id TEXT, mp_preference_id TEXT, forma_pagamento TEXT, parcelas INTEGER DEFAULT 1, pago_em TEXT, criado_em TEXT NOT NULL DEFAULT (datetime('now')), FOREIGN KEY (assinatura_id) REFERENCES assinaturas(id) ON DELETE CASCADE, FOREIGN KEY (mapeador_id) REFERENCES mapeadores(id) ON DELETE CASCADE, FOREIGN KEY (plano_id) REFERENCES planos(id) ON DELETE RESTRICT);
      CREATE INDEX IF NOT EXISTS idx_assinaturas_mapeador ON assinaturas(mapeador_id);
      CREATE INDEX IF NOT EXISTS idx_assinaturas_status ON assinaturas(status);
      CREATE INDEX IF NOT EXISTS idx_pagamentos_assinatura ON pagamentos(assinatura_id);
      CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON pagamentos(status);
    `);
    console.log('✓ Migration: tabelas de cobrança criadas');
  }
}

function getDB() {
  if (db) return db;
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('synchronous = NORMAL');
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  db.exec(schema);
  runMigrations();
  console.log(`✓ Banco de dados: ${DB_PATH}`);
  return db;
}

process.on('exit', () => { try { if (db) db.close(); } catch(e) { /* best effort */ } });
process.on('SIGINT', () => { try { if (db) db.close(); } catch(e) { /* best effort */ } process.exit(0); });
process.on('SIGTERM', () => { try { if (db) db.close(); } catch(e) { /* best effort */ } process.exit(0); });

module.exports = { getDB };
