const config = require('../config');

const BILLING_BASE = process.env.BILLING_URL || 'http://localhost:3212';
const BILLING_API_KEY = process.env.BILLING_API_KEY || 'bill_dev_default_key_abc123';

async function request(method, path, body) {
  const url = `${BILLING_BASE}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${BILLING_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ error: res.statusText }));
      const err = new Error(errBody.error || 'Billing error');
      err.status = res.status;
      err.body = errBody;
      throw err;
    }

    return res.json();
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

function isConfigured() {
  return !!(process.env.BILLING_URL || process.env.BILLING_API_KEY);
}

module.exports = {
  BILLING_BASE,
  BILLING_API_KEY,

  isConfigured,

  async ensureCustomer(mapeadorId, email, nome) {
    try {
      const existing = await this.getCustomerByProjectId(mapeadorId);
      if (existing) return existing;

      return await request('POST', '/customers', {
        project_customer_id: mapeadorId,
        email,
        name: nome,
      });
    } catch (err) {
      console.warn('[billing] ensureCustomer error:', err.message);
      return null;
    }
  },

  async getCustomerByProjectId(projectCustomerId) {
    try {
      const res = await request('GET', `/customers?q=${encodeURIComponent(projectCustomerId)}`);
      const found = (res.customers || []).find(c => c.project_customer_id === projectCustomerId);
      return found || null;
    } catch {
      return null;
    }
  },

  async listPlans() {
    const res = await request('GET', '/plans');
    return res.plans || [];
  },

  async createSubscription(customerId, planId, gateway) {
    return request('POST', '/subscriptions', {
      customer_id: customerId,
      plan_id: planId,
      gateway: gateway || 'mercadopago',
      success_url: `${config.appUrl || 'http://localhost:3000'}/app`,
      cancel_url: `${config.appUrl || 'http://localhost:3000'}/app`,
    });
  },

  async getSubscriptionByCustomer(customerId) {
    try {
      const res = await request('GET', `/subscriptions?customer_id=${customerId}`);
      return (res.subscriptions || [])[0] || null;
    } catch {
      return null;
    }
  },

  async getSubscription(id) {
    return request('GET', `/subscriptions/${id}`);
  },

  async cancelSubscription(id) {
    await request('POST', `/subscriptions/${id}/cancel`);
  },

  async forwardWebhook(body) {
    if (!isConfigured()) return;
    try {
      await request('POST', '/webhooks/mercadopago', body);
    } catch (err) {
      console.warn('[billing] falha ao encaminhar webhook:', err.message);
    }
  },
};
