const { getDB } = require('../db/database');
const { NotFoundError } = require('../utils/errors');

function checkRedeExists(paramName = 'redeId') {
  return (req, res, next) => {
    const redeId = req.params[paramName];
    const mapeadorId = req.mapeador?.id;

    if (!redeId || !mapeadorId) {
      return next(new NotFoundError('Rede'));
    }

    const db = getDB();
    const rede = db.prepare(
      'SELECT id FROM redes WHERE id = ? AND mapeador_id = ?'
    ).get(redeId, mapeadorId);

    if (!rede) {
      return next(new NotFoundError('Rede'));
    }

    req.rede = rede;
    next();
  };
}

module.exports = { checkRedeExists };