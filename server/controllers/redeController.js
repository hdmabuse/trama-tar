const RedeService = require('../services/redeService');

class RedeController {
  static list(req, res, next) {
    try {
      res.json(RedeService.list(req.mapeador.id));
    } catch (err) {
      next(err);
    }
  }

  static create(req, res, next) {
    try {
      const rede = RedeService.create(req.body, req.mapeador);
      res.status(201).json(rede);
    } catch (err) {
      next(err);
    }
  }

  static get(req, res, next) {
    try {
      res.json(RedeService.getCompleta(req.params.id, req.mapeador.id));
    } catch (err) {
      next(err);
    }
  }

  static update(req, res, next) {
    try {
      res.json(RedeService.update(req.params.id, req.mapeador.id, req.body));
    } catch (err) {
      next(err);
    }
  }

  static delete(req, res, next) {
    try {
      RedeService.delete(req.params.id, req.mapeador.id);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = RedeController;
