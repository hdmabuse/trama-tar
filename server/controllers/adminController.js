const AdminService = require('../services/adminService');

class AdminController {
  static listMapeadores(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 50, 100);
      res.json(AdminService.listMapeadores(page, limit));
    } catch (err) { next(err); }
  }

  static getMapeador(req, res, next) {
    try {
      res.json(AdminService.getMapeador(req.params.id));
    } catch (err) { next(err); }
  }

  static updateMapeador(req, res, next) {
    try {
      res.json(AdminService.updateMapeador(req.params.id, req.body));
    } catch (err) { next(err); }
  }

  static deleteMapeador(req, res, next) {
    try {
      AdminService.deleteMapeador(req.params.id);
      res.json({ ok: true });
    } catch (err) { next(err); }
  }

  static listAuditLog(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 50, 100);
      const redeId = req.query.rede_id || null;
      res.json(AdminService.listAuditLog(page, limit, redeId));
    } catch (err) { next(err); }
  }

  static getMetrics(req, res, next) {
    try {
      res.json(AdminService.getMetrics());
    } catch (err) { next(err); }
  }

  static getDBInfo(req, res, next) {
    try {
      res.json(AdminService.getDBInfo());
    } catch (err) { next(err); }
  }

  static getConfig(req, res, next) {
    try {
      res.json(AdminService.getConfig());
    } catch (err) { next(err); }
  }

  static upsertConfig(req, res, next) {
    try {
      const { chave, valor } = req.body;
      AdminService.upsertConfig(chave, valor);
      res.json({ ok: true });
    } catch (err) { next(err); }
  }
}

module.exports = AdminController;
