require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cookieParser = require('cookie-parser');
const { AppError } = require('./utils/errors');
const config = require('./config');
const { i18nMiddleware } = require('./i18n/middleware');
const { getSupportedLanguages, getLanguageLabel, getCurrentLanguage, t } = require('./i18n');

const app = express();

app.use(cookieParser());
app.use(i18nMiddleware);

app.use(helmet({ contentSecurityPolicy: false }));

const maxLimit = config.env === 'production'
  ? config.rateLimit.max.production
  : config.rateLimit.max.development;

const limiter = rateLimit({ windowMs: config.rateLimit.windowMs, max: maxLimit });
const authLimiter = rateLimit({ windowMs: config.authRateLimit.windowMs, max: config.authRateLimit.max });

app.use(cors({ origin: config.corsOrigin || `http://localhost:${config.port}`, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
app.use(express.static(path.join(__dirname, '../public'), { maxAge: config.env === 'production' ? '1d' : '0', index: false }));

app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/redes', limiter, require('./routes/redes'));

const { actantesRouter, associacoesRouter } = require('./routes/actantes');
app.use('/api/redes/:redeId/actantes', limiter, actantesRouter);
app.use('/api/redes/:redeId/associacoes', limiter, associacoesRouter);
app.use('/api/redes/:redeId/exportacao', limiter, require('./routes/exportacao'));
app.use('/api/admin', limiter, require('./routes/admin'));
app.use('/api/cobranca', limiter, require('./routes/cobranca'));

app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  versao: '1.0.0',
  ambiente: config.env,
  timestamp: new Date().toISOString(),
  linguagem: req.language
}));

app.get('/api/i18n/languages', (_req, res) => {
  const languages = getSupportedLanguages().map(lang => ({
    code: lang,
    label: getLanguageLabel(lang)
  }));
  res.json({ languages });
});

app.post('/api/i18n/language', (req, res) => {
  const { language } = req.body;
  const supported = getSupportedLanguages();

  if (!supported.includes(language)) {
    return res.status(400).json({ erro: req.t('errors.validation'), codigo: 'INVALID_LANGUAGE' });
  }

  res.cookie('lang', language, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: 'lax'
  });

  res.json({ sucesso: true, linguagem: language });
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/landing.html'));
});

app.get('/app', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/admin', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

app.get('/admin/*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ erro: req.t ? req.t('errors.notFoundMessage') : 'Endpoint não encontrado.' });
  res.sendFile(path.join(__dirname, '../public/landing.html'));
});

app.use((err, req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ erro: err.message, codigo: err.code });
  }
  console.error(`[ERRO] ${err.stack || err.message}`);
  const errorMessage = config.env === 'production'
    ? (req.t ? req.t('errors.serverErrorMessage') : 'Erro interno.')
    : err.message;
  res.status(err.statusCode || 500).json({ erro: errorMessage });
});

require('./db/database').getDB();
app.listen(config.port, '0.0.0.0', () => {
  console.log(`\n╔═══════════════════════════════════════╗`);
  console.log(`║  TRAMA-TAR v1.0 · ${config.env.padEnd(19)}║`);
  console.log(`║  http://localhost:${String(config.port).padEnd(19)}║`);
  console.log(`╚═══════════════════════════════════════╝\n`);
});

module.exports = app;