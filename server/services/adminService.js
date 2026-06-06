const AdminRepository = require('../repositories/adminRepository');
const { NotFoundError, ValidationError } = require('../utils/errors');

class AdminService {
  static listMapeadores(page, limit) {
    return AdminRepository.listMapeadores(page, limit);
  }

  static getMapeador(id) {
    const m = AdminRepository.findMapeadorById(id);
    if (!m) throw new NotFoundError('Mapeador');
    return m;
  }

  static updateMapeador(id, fields) {
    const m = AdminRepository.findMapeadorById(id);
    if (!m) throw new NotFoundError('Mapeador');
    if (fields.admin !== undefined && typeof fields.admin !== 'boolean') {
      throw new ValidationError('admin deve ser booleano.');
    }
    return AdminRepository.updateMapeador(id, fields);
  }

  static deleteMapeador(id) {
    const m = AdminRepository.findMapeadorById(id);
    if (!m) throw new NotFoundError('Mapeador');
    AdminRepository.deleteMapeador(id);
  }

  static listAuditLog(page, limit, redeId) {
    return AdminRepository.listAuditLog(page, limit, redeId);
  }

  static getMetrics() {
    return AdminRepository.getMetrics();
  }

  static getDBInfo() {
    return AdminRepository.getDBInfo();
  }

  static getConfig() {
    return AdminRepository.getConfig();
  }

  static upsertConfig(chave, valor) {
    if (!chave || !chave.trim()) throw new ValidationError('Chave é obrigatória.');
    AdminRepository.upsertConfig(chave.trim(), valor);
  }
}

module.exports = AdminService;
