const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const { getDB } = require('../db/database');
const { gerarToken, authMiddleware } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { ConflictError, UnauthorizedError } = require('../utils/errors');

const router = express.Router();

router.post('/registro', validate(schemas.registro), async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;
    const db = getDB();
    if (db.prepare('SELECT id FROM mapeadores WHERE email = ?').get(email)) {
      throw new ConflictError('E-mail já cadastrado.');
    }
    const id = uuid();
    const hash = await bcrypt.hash(senha, 12);
    db.prepare('INSERT INTO mapeadores (id,nome,email,senha_hash) VALUES (?,?,?,?)')
      .run(id, nome, email, hash);
    res.status(201).json({ token: gerarToken({ id, nome, email }), mapeador: { id, nome, email } });
  } catch (err) {
    next(err);
  }
});

router.post('/login', validate(schemas.login), async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    const db = getDB();
    const m = db.prepare('SELECT * FROM mapeadores WHERE email = ?').get(email);
    if (!m || !(await bcrypt.compare(senha, m.senha_hash))) {
      throw new UnauthorizedError('E-mail ou senha incorretos.');
    }
    db.prepare("UPDATE mapeadores SET ultimo_acesso=datetime('now') WHERE id=?").run(m.id);
    res.json({ token: gerarToken(m), mapeador: { id: m.id, nome: m.nome, email: m.email } });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authMiddleware, (req, res, next) => {
  try {
    const m = getDB().prepare('SELECT id,nome,email,criado_em FROM mapeadores WHERE id=?').get(req.mapeador.id);
    res.json(m);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
