const RedeRepository = require('../repositories/redeRepository');
const ActanteRepository = require('../repositories/actanteRepository');
const AssociacaoRepository = require('../repositories/associacaoRepository');
const { parseActantes } = require('../utils/parseHelpers');
const { NotFoundError } = require('../utils/errors');

class RedeController {
  static list(req, res, next) {
    try {
      const redes = RedeRepository.findAllByMapeador(req.mapeador.id);
      res.json(redes);
    } catch (err) {
      next(err);
    }
  }

  static create(req, res, next) {
    try {
      const { nome, controversia, materia_de_preocupacao, perspectiva_mapeador,
        escopo_temporal, escopo_espacial, actantes_pre_campo } = req.body;

      const rede = RedeRepository.create({
        nome,
        controversia,
        materia_de_preocupacao,
        perspectiva_mapeador,
        escopo_temporal,
        escopo_espacial,
        mapeadorNome: req.mapeador.nome,
        actantes_pre_campo
      }, req.mapeador.id);

      res.status(201).json(rede);
    } catch (err) {
      next(err);
    }
  }

  static get(req, res, next) {
    try {
      const db = require('../db/database').getDB();
      const rede = RedeRepository.findById(req.params.id, req.mapeador.id);
      if (!rede) throw new NotFoundError('Rede');

      res.json({
        ...rede,
        actantes: parseActantes(ActanteRepository.findAllByRede(req.params.id)),
        associacoes: AssociacaoRepository.findAllByRede(req.params.id),
        caixas_pretas: db.prepare('SELECT * FROM caixas_pretas WHERE rede_id=?').all(req.params.id)
      });
    } catch (err) {
      next(err);
    }
  }

  static update(req, res, next) {
    try {
      const rede = RedeRepository.findById(req.params.id, req.mapeador.id);
      if (!rede) throw new NotFoundError('Rede');

      const updated = RedeRepository.update(req.params.id, req.mapeador.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  static delete(req, res, next) {
    try {
      const rede = RedeRepository.findById(req.params.id, req.mapeador.id);
      if (!rede) throw new NotFoundError('Rede');

      RedeRepository.delete(req.params.id);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = RedeController;