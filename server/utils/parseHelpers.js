function parseActante(actante) {
  if (!actante) return null;
  return {
    ...actante,
    tags: JSON.parse(actante.tags || '[]'),
    modos_agencia: JSON.parse(actante.modos_agencia || '[]'),
    no_plasma: !!actante.no_plasma,
    pre_campo: !!actante.pre_campo,
    distribuido: !!actante.distribuido
  };
}

function parseActantes(actantes) {
  return actantes.map(parseActante);
}

function parseRede(rede) {
  if (!rede) return null;
  return {
    ...rede,
    tags: JSON.parse(rede.tags || '[]'),
    modos_agencia: JSON.parse(rede.modos_agencia || '[]'),
    no_plasma: !!rede.no_plasma,
    pre_campo: !!rede.pre_campo,
    distribuido: !!rede.distribuido
  };
}

module.exports = { parseActante, parseActantes, parseRede };