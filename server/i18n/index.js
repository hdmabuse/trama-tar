const i18next = require('i18next');
const path = require('path');
const fs = require('fs');

const supportedLanguages = ['pt-BR', 'en', 'es'];
const defaultLanguage = 'pt-BR';
const localesPath = path.join(__dirname, 'locales');

function loadResources() {
  const resources = {};
  supportedLanguages.forEach(lang => {
    const filePath = path.join(localesPath, `${lang}.json`);
    if (fs.existsSync(filePath)) {
      resources[lang] = {
        translation: JSON.parse(fs.readFileSync(filePath, 'utf8'))
      };
    }
  });
  return resources;
}

const resources = loadResources();

i18next.init({
  resources,
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  supportedLngs: supportedLanguages,
  preload: supportedLanguages,
  interpolation: {
    escapeValue: false
  }
}).then(() => {
  console.log('✓ i18n initialized');
}).catch(err => {
  console.error('✗ i18n init failed:', err);
});

function t(key, options) {
  return i18next.t(key, options);
}

async function changeLanguage(lang) {
  if (supportedLanguages.includes(lang)) {
    await i18next.changeLanguage(lang);
  }
}

function getCurrentLanguage() {
  return i18next.language || defaultLanguage;
}

function getSupportedLanguages() {
  return supportedLanguages;
}

function getLanguageLabel(lang) {
  const labels = {
    'pt-BR': 'Português (BR)',
    'en': 'English',
    'es': 'Español'
  };
  return labels[lang] || lang;
}

function getI18next() {
  return i18next;
}

module.exports = {
  i18next: getI18next,
  t,
  changeLanguage,
  getCurrentLanguage,
  getSupportedLanguages,
  getLanguageLabel,
  defaultLanguage,
  supportedLanguages
};