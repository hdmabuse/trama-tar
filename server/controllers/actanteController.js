const ActanteRepository = require('../repositories/actanteRepository');
const AssociacaoRepository = require('../repositories/associacaoRepository');
const RedeRepository = require('../repositories/redeRepository');
const { parseActante, parseActantes } = require('../utils/parseHelpers');
const { NotFoundError, ValidationError } = require('../utils/errors');

class ActanteController {
  static list(req, res, next) {
    try {
      const actantes = ActanteRepository.findAllByRede(req.params.redeId);
      res.json(parseActantes(actantes));
    } catch (err) {
      next(err);
    }
  }

  static create(req, res, next) {
    try {
      const actante = ActanteRepository.create(req.body, req.params.redeId, req.mapeador.id);
      RedeRepository.touch(req.params.redeId);
      res.status(201).json(parseActante(actante));
    } catch (err) {
      next(err);
    }
  }

  static update(req, res, next) {
    try {
      const atual = ActanteRepository.findById(req.params.id, req.params.redeId);
      if (!atual) throw new NotFoundError('Actante');

      const updated = ActanteRepository.update(req.params.id, req.params.redeId, req.body, req.mapeador.id);
      RedeRepository.touch(req.params.redeId);
      res.json(parseActante(updated));
    } catch (err) {
      next(err);
    }
  }

  static delete(req, res, next) {
    try {
      const atual = ActanteRepository.findById(req.params.id, req.params.redeId);
      if (!atual) throw new NotFoundError('Actante');

      ActanteRepository.softDelete(req.params.id, req.params.redeId);
      RedeRepository.touch(req.params.redeId);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
}

class AssociacaoController {
  static list(req, res, next) {
    try {
      const associacoes = AssociacaoRepository.findAllByRede(req.params.redeId);
      res.json(associacoes);
    } catch (err) {
      next(err);
    }
  }

  static create(req, res, next) {
    try {
      const { origem_id, destino_id } = req.body;
      if (origem_id === destino_id) {
        throw new ValidationError('Origem e destino não podem ser o mesmo actante.');
      }

      const associacao = AssociacaoRepository.create(req.body, req.params.redeId, req.mapeador.id);
      RedeRepository.touch(req.params.redeId);
      res.status(201).json(associacao);
    } catch (err) {
      next(err);
    }
  }

  static update(req, res, next) {
    try {
      const atual = AssociacaoRepository.findById(req.params.id, req.params.redeId);
      if (!atual) throw new NotFoundError('Associação');

      const updated = AssociacaoRepository.update(req.params.id, req.params.redeId, req.body);
      RedeRepository.touch(req.params.redeId);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  static delete(req, res, next) {
    try {
      const atual = AssociacaoRepository.findById(req.params.id, req.params.redeId);
      if (!atual) throw new NotFoundError('Associação');

      AssociacaoRepository.delete(req.params.id, req.params.redeId);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = { ActanteController, AssociacaoController };