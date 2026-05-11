const { ValidationError } = require('../utils/errors');
const {
  registrationSchema,
  loginSchema,
  actanteSchema,
  associacaoSchema,
  redeSchema
} = require('./schemas');

function validate(schema) {
  return (req, res, next) => {
    const errors = [];
    const { body } = req;
    const translate = req.t || ((key) => key);

    for (const [field, rules] of Object.entries(schema)) {
      const value = body[field];
      const fieldLabel = translate(`entities.${getEntityFromSchema(schema)}fields.${field}`) || field;

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(translate('validation.required', { field: fieldLabel }));
        continue;
      }

      if (value !== undefined && value !== null) {
        if (rules.type === 'string' && typeof value !== 'string') {
          errors.push(translate('validation.invalidField', { field: fieldLabel }));
        } else if (rules.type === 'array' && !Array.isArray(value)) {
          errors.push(`${fieldLabel} deve ser uma lista.`);
        } else if (rules.type === 'number' && typeof value !== 'number') {
          errors.push(`${fieldLabel} deve ser número.`);
        } else if (rules.type === 'boolean' && typeof value !== 'boolean') {
          errors.push(`${fieldLabel} deve ser verdadeiro ou falso.`);
        } else if (rules.minLength && value.length < rules.minLength) {
          errors.push(translate('validation.minLength', { field: fieldLabel, count: rules.minLength }));
        } else if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(translate('validation.maxLength', { field: fieldLabel, count: rules.maxLength }));
        } else if (rules.enum && !rules.enum.includes(value)) {
          errors.push(translate('validation.enum', { field: fieldLabel, values: rules.enum.join(', ') }));
        } else if (rules.custom && !rules.custom(value)) {
          errors.push(rules.message || `${fieldLabel} é inválido.`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ erro: errors[0], erros: errors });
    }

    next();
  };
}

function getEntityFromSchema(schema) {
  if (schema === registrationSchema || schema === loginSchema) return 'mapeador.';
  if (schema === actanteSchema) return 'actante.';
  if (schema === associacaoSchema) return 'associacao.';
  if (schema === redeSchema) return 'rede.';
  return '';
}

const schemas = {
  registro: registrationSchema,
  login: loginSchema,
  actante: actanteSchema,
  associacao: associacaoSchema,
  rede: redeSchema
};

module.exports = { validate, schemas };