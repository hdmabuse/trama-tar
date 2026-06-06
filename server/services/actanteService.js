const ActanteRepository = require('../repositories/actanteRepository');
const AssociacaoRepository = require('../repositories/associacaoRepository');
const RedeRepository = require('../repositories/redeRepository');
const { parseActante, parseActantes } = require('../utils/parseHelpers');
const { NotFoundError, ValidationError } = require('../utils/errors');

class ActanteService {
  static list(redeId) {
    return parseActantes(ActanteRepository.findAllByRede(redeId));
  }

  static create(data, redeId, mapeadorId) {
    const actante = ActanteRepository.create(data, redeId, mapeadorId);
    RedeRepository.touch(redeId);
    return parseActante(actante);
  }

  static update(id, redeId, data, mapeadorId) {
    const atual = ActanteRepository.findById(id, redeId);
    if (!atual) throw new NotFoundError('Actante');
    const updated = ActanteRepository.update(id, redeId, data, mapeadorId);
    RedeRepository.touch(redeId);
    return parseActante(updated);
  }

  static delete(id, redeId) {
    const atual = ActanteRepository.findById(id, redeId);
    if (!atual) throw new NotFoundError('Actante');
    ActanteRepository.softDelete(id, redeId);
    RedeRepository.touch(redeId);
  }
}

class AssociacaoService {
  static list(redeId) {
    return AssociacaoRepository.findAllByRede(redeId);
  }

  static create(data, redeId, mapeadorId) {
    if (data.origem_id === data.destino_id) {
      throw new ValidationError('Origem e destino não podem ser o mesmo actante.');
    }
    const associacao = AssociacaoRepository.create(data, redeId, mapeadorId);
    RedeRepository.touch(redeId);
    return associacao;
  }

  static update(id, redeId, data) {
    const atual = AssociacaoRepository.findById(id, redeId);
    if (!atual) throw new NotFoundError('Associação');
    const updated = AssociacaoRepository.update(id, redeId, data);
    RedeRepository.touch(redeId);
    return updated;
  }

  static delete(id, redeId) {
    const atual = AssociacaoRepository.findById(id, redeId);
    if (!atual) throw new NotFoundError('Associação');
    AssociacaoRepository.delete(id, redeId);
  }
}

module.exports = { ActanteService, AssociacaoService };
