const { ActanteService, AssociacaoService } = require('../services/actanteService');

class ActanteController {
  static list(req, res, next) {
    try {
      res.json(ActanteService.list(req.params.redeId));
    } catch (err) {
      next(err);
    }
  }

  static create(req, res, next) {
    try {
      const actante = ActanteService.create(req.body, req.params.redeId, req.mapeador.id);
      res.status(201).json(actante);
    } catch (err) {
      next(err);
    }
  }

  static update(req, res, next) {
    try {
      res.json(ActanteService.update(req.params.id, req.params.redeId, req.body, req.mapeador.id));
    } catch (err) {
      next(err);
    }
  }

  static delete(req, res, next) {
    try {
      ActanteService.delete(req.params.id, req.params.redeId);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
}

class AssociacaoController {
  static list(req, res, next) {
    try {
      res.json(AssociacaoService.list(req.params.redeId));
    } catch (err) {
      next(err);
    }
  }

  static create(req, res, next) {
    try {
      const associacao = AssociacaoService.create(req.body, req.params.redeId, req.mapeador.id);
      res.status(201).json(associacao);
    } catch (err) {
      next(err);
    }
  }

  static update(req, res, next) {
    try {
      res.json(AssociacaoService.update(req.params.id, req.params.redeId, req.body));
    } catch (err) {
      next(err);
    }
  }

  static delete(req, res, next) {
    try {
      AssociacaoService.delete(req.params.id, req.params.redeId);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = { ActanteController, AssociacaoController };
