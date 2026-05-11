const { changeLanguage, getSupportedLanguages, t: translate } = require('./index');

function i18nMiddleware(req, res, next) {
  let lang = req.query.lang || req.headers['accept-language'];

  if (req.cookies && req.cookies.lang) {
    lang = req.cookies.lang;
  }

  if (!lang) {
    lang = 'pt-BR';
  }

  const supported = getSupportedLanguages();
  if (!supported.includes(lang)) {
    lang = 'pt-BR';
  }

  changeLanguage(lang).then(() => {
    req.language = lang;
    req.t = (key, options) => translate(key, options);
    next();
  }).catch(() => {
    req.language = 'pt-BR';
    req.t = (key, options) => translate(key, options);
    next();
  });
}

function setLanguage(req, res, next) {
  const lang = req.body.lang || req.query.lang;

  if (lang && getSupportedLanguages().includes(lang)) {
    res.cookie('lang', lang, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: false
    });
    changeLanguage(lang).then(() => {
      req.language = lang;
      req.t = (key, options) => translate(key, options);
      next();
    }).catch(next);
  } else {
    next();
  }
}

function requireLanguage(req, res, next) {
  const lang = req.params.lang;
  const supported = getSupportedLanguages();

  if (lang && supported.includes(lang)) {
    changeLanguage(lang).then(() => {
      req.language = lang;
      req.t = (key, options) => translate(key, options);
      next();
    }).catch(next);
  } else {
    res.status(400).json({
      erro: 'Invalid language',
      codigo: 'INVALID_LANGUAGE'
    });
  }
}

module.exports = {
  i18nMiddleware,
  setLanguage,
  requireLanguage
};