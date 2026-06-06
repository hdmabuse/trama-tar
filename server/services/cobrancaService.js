const CobrancaRepository = require('../repositories/cobrancaRepository');
const { NotFoundError, ValidationError } = require('../utils/errors');
const config = require('../config');
const billingService = require('./billingService');

class CobrancaService {
  static getMercadoPago() {
    try {
      const { MercadoPagoConfig, Preference, Preapproval, Payment } = require('mercadopago');
      const client = new MercadoPagoConfig({
        accessToken: config.mercadopagoAccessToken,
        options: { timeout: 10000 }
      });
      return { client, Preference, Preapproval, Payment };
    } catch {
      return null;
    }
  }

  // ---- Planos ----
  static listPlanos(apenasAtivos) {
    return CobrancaRepository.listPlanos(apenasAtivos);
  }

  static getPlano(id) {
    const p = CobrancaRepository.findPlanoById(id);
    if (!p) throw new NotFoundError('Plano');
    if (p.recursos && typeof p.recursos === 'string') p.recursos = JSON.parse(p.recursos);
    return p;
  }

  static createPlano(data) {
    return CobrancaRepository.createPlano(data);
  }

  static updatePlano(id, data) {
    if (!CobrancaRepository.findPlanoById(id)) throw new NotFoundError('Plano');
    return CobrancaRepository.updatePlano(id, data);
  }

  // ---- Assinaturas ----
  static listAssinaturas(page, limit) {
    return CobrancaRepository.listAssinaturas(page, limit);
  }

  static getAssinatura(id) {
    const a = CobrancaRepository.findAssinaturaById(id);
    if (!a) throw new NotFoundError('Assinatura');
    return a;
  }

  static getAssinaturaDoMapeador(mapeadorId) {
    const local = CobrancaRepository.findAssinaturaByMapeador(mapeadorId);
    if (local) return local;

    // Fallback: tenta buscar do billing service
    if (billingService.isConfigured()) {
      (async () => {
        try {
          const cust = await billingService.getCustomerByProjectId(mapeadorId);
          if (cust) {
            const sub = await billingService.getSubscriptionByCustomer(cust.id);
            if (sub) {
              return {
                id: sub.id,
                mapeador_id: mapeadorId,
                plano_id: sub.plan_id,
                status: sub.status === 'active' ? 'ativa' : sub.status,
                mp_sub_id: sub.gateway_subscription_id,
                plano_nome: sub.plan.name,
                plano_preco: sub.plan.price_cents / 100,
                expira_em: sub.current_period_end,
              };
            }
          }
        } catch {}
      })();
    }
    return null;
  }

  static async createAssinatura(mapeadorId, planoId) {
    const plano = CobrancaRepository.findPlanoById(planoId);
    if (!plano) throw new NotFoundError('Plano');
    if (!plano.ativo) throw new ValidationError('Plano nao esta ativo.');

    const existente = CobrancaRepository.findAssinaturaByMapeador(mapeadorId);
    if (existente) throw new ValidationError('Mapeador ja possui assinatura ativa.');

    const assinatura = CobrancaRepository.createAssinatura({
      mapeador_id: mapeadorId, plano_id: planoId, status: 'pendente'
    });

    // Tenta billing service primeiro
    if (billingService.isConfigured()) {
      try {
        const mapeador = CobrancaRepository.findAssinaturaById(assinatura.id);
        const cust = await billingService.ensureCustomer(mapeadorId, mapeador?.mapeador_email, mapeador?.mapeador_nome);
        if (cust) {
          const result = await billingService.createSubscription(cust.id, planoId, 'mercadopago');
          CobrancaRepository.updateAssinatura(assinatura.id, {
            mp_sub_id: result.subscription_id,
            mp_preapproval_id: result.subscription_id,
            status: 'pendente'
          });
          return { assinatura: { ...assinatura, mp_init_point: result.checkout_url }, mp_init_point: result.checkout_url };
        }
      } catch (err) {
        console.warn('[billing] servico indisponivel, fallback MP direto:', err.message);
      }
    }

    // Fallback: Mercado Pago direto
    const mp = this.getMercadoPago();
    if (mp && config.mercadopagoAccessToken && config.mercadopagoAccessToken !== 'TEST-XXXXXXXX') {
      try {
        const preapproval = new mp.Preapproval(mp.client);
        const result = await preapproval.create({
          body: {
            payer_email: assinatura.mapeador_email || '',
            reason: `TRAMA-TAR - ${plano.nome}`,
            external_reference: assinatura.id,
            auto_recurring: {
              frequency: 1,
              frequency_type: plano.intervalo || 'months',
              transaction_amount: plano.preco,
              currency_id: plano.moeda || 'BRL'
            },
            back_url: {
              success: `${config.appUrl || 'http://localhost:3000'}/app`,
              pending: `${config.appUrl || 'http://localhost:3000'}/app`,
              failure: `${config.appUrl || 'http://localhost:3000'}/app`
            },
            notification_url: `${config.appUrl || 'http://localhost:3000'}/api/cobranca/webhook`
          }
        });
        CobrancaRepository.updateAssinatura(assinatura.id, {
          mp_sub_id: result.id,
          mp_preapproval_id: result.id,
          status: 'pendente'
        });
        return { assinatura: { ...assinatura, mp_init_point: result.init_point }, mp_init_point: result.init_point };
      } catch (err) {
        console.error('[MERCADO PAGO] Erro ao criar preapproval:', err.message);
      }
    }
    return { assinatura };
  }

  static async cancelAssinatura(id) {
    const a = CobrancaRepository.findAssinaturaById(id);
    if (!a) throw new NotFoundError('Assinatura');

    // Tenta billing service primeiro
    if (billingService.isConfigured()) {
      try {
        await billingService.cancelSubscription(id);
        CobrancaRepository.cancelAssinatura(id);
        return;
      } catch (err) {
        console.warn('[billing] fallback MP direto no cancelamento:', err.message);
      }
    }

    // Fallback: Mercado Pago direto
    const mp = this.getMercadoPago();
    if (mp && a.mp_sub_id && config.mercadopagoAccessToken && config.mercadopagoAccessToken !== 'TEST-XXXXXXXX') {
      try {
        const preapproval = new mp.Preapproval(mp.client);
        await preapproval.update({ id: a.mp_sub_id, body: { status: 'cancelled' } });
      } catch (err) {
        console.error('[MERCADO PAGO] Erro ao cancelar no MP:', err.message);
      }
    }
    CobrancaRepository.cancelAssinatura(id);
  }

  // ---- Pagamentos ----
  static listPagamentos(page, limit) {
    return CobrancaRepository.listPagamentos(page, limit);
  }

  static getPagamento(id) {
    const p = CobrancaRepository.findPagamentoById(id);
    if (!p) throw new NotFoundError('Pagamento');
    return p;
  }

  static listPagamentosDaAssinatura(assinaturaId) {
    return CobrancaRepository.listPagamentosPorAssinatura(assinaturaId);
  }

  static async handleWebhook(data) {
    // Encaminha para billing service (fire-and-forget)
    if (billingService.isConfigured()) {
      billingService.forwardWebhook(data).catch(() => {});
    }

    // Processa localmente (legado)
    const mp = this.getMercadoPago();
    if (!mp || !data?.data?.id) return null;

    try {
      const payment = new mp.Payment(mp.client);
      const result = await payment.get({ id: data.data.id });

      const externalRef = result.external_reference;
      if (!externalRef) return null;

      const assinatura = CobrancaRepository.findAssinaturaById(externalRef);
      if (!assinatura) return null;

      const pgStatus = result.status;
      let nossoStatus = 'pendente';
      if (pgStatus === 'approved') nossoStatus = 'aprovado';
      else if (pgStatus === 'rejected' || pgStatus === 'cancelled' || pgStatus === 'refunded') nossoStatus = 'recusado';
      else if (pgStatus === 'in_process') nossoStatus = 'processando';

      const pagamentoExistente = CobrancaRepository.listPagamentosPorAssinatura(externalRef)
        .find(p => p.mp_payment_id === String(result.id));

      if (!pagamentoExistente) {
        CobrancaRepository.createPagamento({
          assinatura_id: assinatura.id,
          mapeador_id: assinatura.mapeador_id,
          plano_id: assinatura.plano_id,
          valor: result.transaction_amount,
          moeda: result.currency_id || 'BRL',
          status: nossoStatus,
          mp_payment_id: String(result.id),
          mp_preference_id: result.preference_id,
          forma_pagamento: result.payment_method_id,
          parcelas: result.installments
        });
      } else {
        CobrancaRepository.updatePagamento(pagamentoExistente.id, {
          status: nossoStatus,
          pago_em: nossoStatus === 'aprovado' ? new Date().toISOString() : undefined
        });
      }

      if (nossoStatus === 'aprovado') {
        const dataAtual = new Date();
        const expira = new Date(dataAtual);
        expira.setMonth(expira.getMonth() + 1);
        CobrancaRepository.updateAssinatura(assinatura.id, {
          status: 'ativa',
          expira_em: expira.toISOString()
        });
      } else if (nossoStatus === 'recusado') {
        const pagamentos = CobrancaRepository.listPagamentosPorAssinatura(externalRef);
        const aprovados = pagamentos.filter(p => p.status === 'aprovado');
        if (aprovados.length === 0) {
          CobrancaRepository.updateAssinatura(assinatura.id, { status: 'pendente' });
        }
      }

      return nossoStatus;
    } catch (err) {
      console.error('[MERCADO PAGO] Webhook error:', err.message);
      return null;
    }
  }

  // ---- Faturamento ----
  static getFaturamento() {
    return CobrancaRepository.getFaturamento();
  }
}

module.exports = CobrancaService;
