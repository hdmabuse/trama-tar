const CobrancaService = require('../services/cobrancaService');

class CobrancaController {
  static listPlanos(req, res, next) {
    try {
      const apenasAtivos = req.query.ativos !== 'false';
      res.json(CobrancaService.listPlanos(apenasAtivos));
    } catch (err) { next(err); }
  }

  static getPlano(req, res, next) {
    try {
      res.json(CobrancaService.getPlano(req.params.id));
    } catch (err) { next(err); }
  }

  static createPlano(req, res, next) {
    try {
      const plano = CobrancaService.createPlano(req.body);
      res.status(201).json(plano);
    } catch (err) { next(err); }
  }

  static updatePlano(req, res, next) {
    try {
      res.json(CobrancaService.updatePlano(req.params.id, req.body));
    } catch (err) { next(err); }
  }

  static listAssinaturas(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 50, 100);
      res.json(CobrancaService.listAssinaturas(page, limit));
    } catch (err) { next(err); }
  }

  static getAssinatura(req, res, next) {
    try {
      res.json(CobrancaService.getAssinatura(req.params.id));
    } catch (err) { next(err); }
  }

  static getMinhaAssinatura(req, res, next) {
    try {
      const assinatura = CobrancaService.getAssinaturaDoMapeador(req.mapeador.id);
      res.json(assinatura || {});
    } catch (err) { next(err); }
  }

  static createAssinatura(req, res, next) {
    (async () => {
      try {
        const result = await CobrancaService.createAssinatura(req.mapeador.id, req.body.plano_id);
        res.status(201).json(result);
      } catch (err) { next(err); }
    })();
  }

  static cancelAssinatura(req, res, next) {
    (async () => {
      try {
        await CobrancaService.cancelAssinatura(req.params.id);
        res.json({ ok: true });
      } catch (err) { next(err); }
    })();
  }

  static listPagamentos(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 50, 100);
      res.json(CobrancaService.listPagamentos(page, limit));
    } catch (err) { next(err); }
  }

  static getPagamento(req, res, next) {
    try {
      res.json(CobrancaService.getPagamento(req.params.id));
    } catch (err) { next(err); }
  }

  static listPagamentosDaAssinatura(req, res, next) {
    try {
      res.json(CobrancaService.listPagamentosDaAssinatura(req.params.id));
    } catch (err) { next(err); }
  }

  static webhook(req, res, next) {
    (async () => {
      try {
        await CobrancaService.handleWebhook(req.body);
        res.status(200).json({ ok: true });
      } catch (err) {
        console.error('[WEBHOOK]', err.message);
        res.status(200).json({ ok: true });
      }
    })();
  }

  static getFaturamento(req, res, next) {
    try {
      res.json(CobrancaService.getFaturamento());
    } catch (err) { next(err); }
  }
}

module.exports = CobrancaController;
