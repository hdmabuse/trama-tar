const registrationSchema = {
  nome: { required: true, type: 'string', minLength: 1 },
  email: {
    required: true,
    type: 'string',
    custom: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: 'E-mail inválido.'
  },
  senha: { required: true, type: 'string', minLength: 8 }
};

const loginSchema = {
  email: { required: true, type: 'string' },
  senha: { required: true, type: 'string' }
};

const actanteSchema = {
  nome: { required: true, type: 'string', minLength: 1 },
  status: {
    type: 'string',
    enum: ['em_formacao', 'estabilizado', 'contestado', 'disperso']
  },
  no_plasma: { type: 'boolean' },
  pre_campo: { type: 'boolean' },
  modo_acao: { type: 'string', enum: ['mediador', 'intermediario'] }
};

const associacaoSchema = {
  origem_id: { required: true, type: 'string' },
  destino_id: { required: true, type: 'string' },
  modo_acao: {
    required: true,
    type: 'string',
    enum: ['mediador', 'intermediario']
  },
  direcao: { type: 'string', enum: ['unidirecional', 'bidirecional'] },
  intensidade: {
    type: 'number',
    custom: v => v >= 1 && v <= 5,
    message: 'Intensidade deve ser entre 1 e 5.'
  },
  status: { type: 'string', enum: ['ativa', 'historica', 'contestada'] }
};

const redeSchema = {
  nome: { required: true, type: 'string', minLength: 1 }
};

module.exports = {
  registrationSchema,
  loginSchema,
  actanteSchema,
  associacaoSchema,
  redeSchema
};