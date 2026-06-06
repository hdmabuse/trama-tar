const RedeRepository = require('../repositories/redeRepository');
const ActanteRepository = require('../repositories/actanteRepository');
const AssociacaoRepository = require('../repositories/associacaoRepository');
const { getDB } = require('../db/database');
const { parseActantes } = require('../utils/parseHelpers');
const { NotFoundError } = require('../utils/errors');

class RedeService {
  static list(mapeadorId) {
    return RedeRepository.findAllByMapeador(mapeadorId);
  }

  static create(data, mapeador) {
    return RedeRepository.create({
      nome: data.nome,
      controversia: data.controversia,
      materia_de_preocupacao: data.materia_de_preocupacao,
      perspectiva_mapeador: data.perspectiva_mapeador,
      escopo_temporal: data.escopo_temporal,
      escopo_espacial: data.escopo_espacial,
      mapeadorNome: mapeador.nome,
      actantes_pre_campo: data.actantes_pre_campo
    }, mapeador.id);
  }

  static getCompleta(redeId, mapeadorId) {
    const rede = RedeRepository.findById(redeId, mapeadorId);
    if (!rede) throw new NotFoundError('Rede');

    const db = getDB();
    return {
      ...rede,
      actantes: parseActantes(ActanteRepository.findAllByRede(redeId)),
      associacoes: AssociacaoRepository.findAllByRede(redeId),
      caixas_pretas: db.prepare('SELECT * FROM caixas_pretas WHERE rede_id=?').all(redeId)
    };
  }

  static update(redeId, mapeadorId, data) {
    const rede = RedeRepository.findById(redeId, mapeadorId);
    if (!rede) throw new NotFoundError('Rede');
    return RedeRepository.update(redeId, mapeadorId, data);
  }

  static delete(redeId, mapeadorId) {
    const rede = RedeRepository.findById(redeId, mapeadorId);
    if (!rede) throw new NotFoundError('Rede');
    RedeRepository.delete(redeId);
  }
}

module.exports = RedeService;
