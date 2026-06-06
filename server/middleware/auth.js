const jwt = require('jsonwebtoken');
const config = require('../config');
const JWT_SECRET = config.jwtSecret;

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ erro: 'Token ausente.' });
  try {
    req.mapeador = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch(e) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

function gerarToken(m) {
  return jwt.sign({ id: m.id, nome: m.nome, email: m.email, admin: !!m.admin },
    JWT_SECRET, { expiresIn: '24h' });
}

function adminMiddleware(req, res, next) {
  if (!req.mapeador || !req.mapeador.admin) {
    return res.status(403).json({ erro: 'Acesso restrito a administradores.' });
  }
  next();
}

module.exports = { authMiddleware, adminMiddleware, gerarToken };
