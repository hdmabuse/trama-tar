require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'trama-tar-dev-secret-MUDE-EM-PRODUCAO',
  dbPath: process.env.DB_PATH || undefined,
  corsOrigin: process.env.CORS_ORIGIN || undefined,
  appUrl: process.env.APP_URL || undefined,
  mercadopagoAccessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || undefined,
  billingUrl: process.env.BILLING_URL || undefined,
  billingApiKey: process.env.BILLING_API_KEY || undefined,
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: {
      production: 100,
      development: 1000
    }
  },
  authRateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 10
  }
};