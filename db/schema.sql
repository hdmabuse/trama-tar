PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS mapeadores (
  id          TEXT PRIMARY KEY,
  nome        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  senha_hash  TEXT NOT NULL,
  criado_em   TEXT NOT NULL DEFAULT (datetime('now')),
  ultimo_acesso TEXT
);

CREATE TABLE IF NOT EXISTS redes (
  id                     TEXT PRIMARY KEY,
  nome                   TEXT NOT NULL,
  controversia           TEXT,
  materia_de_preocupacao TEXT,
  perspectiva_mapeador   TEXT,
  escopo_temporal        TEXT,
  escopo_espacial        TEXT,
  atividade_atual        INTEGER NOT NULL DEFAULT 0,
  mapeador_id            TEXT NOT NULL,
  criado_em              TEXT NOT NULL DEFAULT (datetime('now')),
  atualizado_em          TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (mapeador_id) REFERENCES mapeadores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS actantes (
  id            TEXT PRIMARY KEY,
  rede_id       TEXT NOT NULL,
  nome          TEXT NOT NULL,
  descricao     TEXT,
  tags          TEXT DEFAULT '[]',
  modos_agencia TEXT DEFAULT '[]',
  status        TEXT NOT NULL DEFAULT 'em_formacao',
  no_plasma     INTEGER NOT NULL DEFAULT 0,
  pre_campo     INTEGER NOT NULL DEFAULT 0,
  plasma_relacao_controversia TEXT,
  pos_x         REAL DEFAULT 0,
  pos_y         REAL DEFAULT 0,
  distribuido   INTEGER NOT NULL DEFAULT 0,
  tipo          TEXT DEFAULT 'actante',
  registrado_por TEXT NOT NULL,
  registrado_em  TEXT NOT NULL DEFAULT (datetime('now')),
  fonte          TEXT DEFAULT 'observacao_campo',
  FOREIGN KEY (rede_id) REFERENCES redes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS associacoes (
  id                   TEXT PRIMARY KEY,
  rede_id              TEXT NOT NULL,
  origem_id            TEXT NOT NULL,
  destino_id           TEXT NOT NULL,
  modo_acao            TEXT,
  direcao              TEXT NOT NULL DEFAULT 'unidirecional',
  intensidade          INTEGER NOT NULL DEFAULT 3,
  descricao_traducao   TEXT,
  status               TEXT NOT NULL DEFAULT 'ativa',
  posicao_contestacao  TEXT,
  no_plasma            INTEGER NOT NULL DEFAULT 0,
  criterio_confirmacao TEXT,
  registrado_por       TEXT NOT NULL,
  registrado_em        TEXT NOT NULL DEFAULT (datetime('now')),
  fonte                TEXT DEFAULT 'observacao_campo',
  FOREIGN KEY (rede_id) REFERENCES redes(id) ON DELETE CASCADE,
  FOREIGN KEY (origem_id) REFERENCES actantes(id) ON DELETE CASCADE,
  FOREIGN KEY (destino_id) REFERENCES actantes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS actante_versoes (
  id              TEXT PRIMARY KEY,
  actante_id      TEXT NOT NULL,
  campos_anteriores TEXT NOT NULL,
  modificado_por  TEXT NOT NULL,
  timestamp_mod   TEXT NOT NULL DEFAULT (datetime('now')),
  justificativa   TEXT,
  FOREIGN KEY (actante_id) REFERENCES actantes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS caixas_pretas (
  id                      TEXT PRIMARY KEY,
  rede_id                 TEXT NOT NULL,
  nome                    TEXT NOT NULL,
  actante_virtual_id      TEXT NOT NULL,
  actantes_internos       TEXT NOT NULL DEFAULT '[]',
  associacoes_internas    TEXT NOT NULL DEFAULT '[]',
  contexto_estabilizacao  TEXT NOT NULL,
  colapsado_por           TEXT NOT NULL,
  colapsado_em            TEXT NOT NULL DEFAULT (datetime('now')),
  contestada              INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (rede_id) REFERENCES redes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_log (
  id          TEXT PRIMARY KEY,
  rede_id     TEXT,
  tipo_evento TEXT NOT NULL,
  descricao   TEXT,
  mapeador_id TEXT,
  timestamp   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_actantes_rede   ON actantes(rede_id);
CREATE INDEX IF NOT EXISTS idx_assoc_rede      ON associacoes(rede_id);
CREATE INDEX IF NOT EXISTS idx_redes_mapeador  ON redes(mapeador_id);
