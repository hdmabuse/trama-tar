const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const DB_PATH = config.dbPath || path.join(__dirname, '../../data/trama-tar.db');
const SCHEMA_PATH = path.join(__dirname, '../../db/schema.sql');

const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

let db;

function getDB() {
  if (db) return db;
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('synchronous = NORMAL');
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  db.exec(schema);
  console.log(`✓ Banco de dados: ${DB_PATH}`);
  return db;
}

process.on('exit', () => { try { if (db) db.close(); } catch(e){} });
process.on('SIGINT', () => { try { if (db) db.close(); } catch(e){} process.exit(0); });
process.on('SIGTERM', () => { try { if (db) db.close(); } catch(e){} process.exit(0); });

module.exports = { getDB };
