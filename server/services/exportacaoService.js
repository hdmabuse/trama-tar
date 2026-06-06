const { getDB } = require('../db/database');
const { parseActantes } = require('../utils/parseHelpers');
const { NotFoundError } = require('../utils/errors');

class ExportacaoService {
  static getRedeCompleta(redeId, mapeadorId) {
    const db = getDB();
    const rede = db.prepare('SELECT * FROM redes WHERE id=? AND mapeador_id=?').get(redeId, mapeadorId);
    if (!rede) return null;
    const actantes = parseActantes(db.prepare('SELECT * FROM actantes WHERE rede_id=? ORDER BY registrado_em').all(redeId));
    const associacoes = db.prepare('SELECT * FROM associacoes WHERE rede_id=? ORDER BY registrado_em').all(redeId);
    return { ...rede, actantes, associacoes };
  }

  static toCSV(redeId, mapeadorId) {
    const rede = this.getRedeCompleta(redeId, mapeadorId);
    if (!rede) throw new NotFoundError('Rede');

    const esc = (v) => {
      if (v === null || v === undefined) return '';
      return `"${String(v).replace(/"/g, '""').replace(/\n/g, '\\n')}"`;
    };

    const aMap = Object.fromEntries(rede.actantes.map(a => [a.id, a.nome]));

    const actCsv = 'id,nome,descricao,tags,modos_agencia,status,no_plasma,pre_campo,fonte,registrado_em\r\n' +
      rede.actantes.map(a => [a.id, a.nome, a.descricao, a.tags.join(';'), a.modos_agencia.join(';'),
        a.status, a.no_plasma ? 'sim' : 'nao', a.pre_campo ? 'sim' : 'nao', a.fonte, a.registrado_em
      ].map(esc).join(',')).join('\r\n');

    const assocCsv = 'id,origem_id,origem_nome,destino_id,destino_nome,modo_acao,direcao,intensidade,status,descricao_traducao,registrado_em\r\n' +
      rede.associacoes.map(a => [a.id, a.origem_id, aMap[a.origem_id] || '', a.destino_id, aMap[a.destino_id] || '',
        a.modo_acao, a.direcao, a.intensidade, a.status, a.descricao_traducao, a.registrado_em
      ].map(esc).join(',')).join('\r\n');

    return {
      'actantes.csv': actCsv,
      'associacoes.csv': assocCsv,
      instrucoes: 'Salve cada valor como arquivo .csv. Encoding: UTF-8 com BOM. Separador: vírgula.'
    };
  }

  static toMarkdown(redeId, mapeadorId) {
    const rede = this.getRedeCompleta(redeId, mapeadorId);
    if (!rede) throw new NotFoundError('Rede');

    const conf = rede.actantes.filter(a => !a.no_plasma && a.status !== 'disperso');
    const plasma = rede.actantes.filter(a => a.no_plasma);
    const aMap = Object.fromEntries(rede.actantes.map(a => [a.id, a.nome]));
    const semPersp = !rede.perspectiva_mapeador;

    const md = `# ${rede.nome}
## Relato ANT — TRAMA-TAR

**Matéria de preocupação:** ${rede.materia_de_preocupacao || '*não declarada*'}
**Exportado em:** ${new Date().toLocaleDateString('pt-BR')}
**Rede:** ${conf.length} actantes · ${rede.associacoes.length} associações · ${plasma.length} no plasma

---

## ⓪ A Controvérsia

${rede.controversia || '*Controvérsia não declarada.*'}

**Perspectiva da mapeadora:** ${semPersp ? '*Não declarada — reflexividade comprometida.*' : rede.perspectiva_mapeador}

---

## ① Inventário de Actantes

### Actantes confirmados

| Actante | Status | Modos de agência | Tags |
|---|---|---|---|
${conf.map(a => `| ${a.nome} | ${a.status.replace('_', ' ')} | ${a.modos_agencia.join(', ') || '—'} | ${a.tags.join(', ') || '—'} |`).join('\n')}

${plasma.length ? `### Zona de plasma\n\n| Entidade | Relação com a controvérsia |\n|---|---|\n${plasma.map(a => `| ${a.nome} | ${a.plasma_relacao_controversia || '*não especificada*'} |`).join('\n')}` : ''}

---

## ② Estrutura da Rede

| Origem | → | Destino | Modo | Intensidade | Status |
|---|---|---|---|---|---|
${rede.associacoes.map(a => `| ${aMap[a.origem_id] || '?'} | → | ${aMap[a.destino_id] || '?'} | ${a.modo_acao || '⚠ não qualificado'} | ${a.intensidade}/5 | ${a.status} |`).join('\n')}

---

## ③ Traduções

${rede.associacoes.filter(a => a.descricao_traducao).map(a => `
### ${aMap[a.origem_id] || '?'} → ${aMap[a.destino_id] || '?'} · ${a.modo_acao} · ${a.intensidade}/5

${a.descricao_traducao}
`).join('\n')}

---

## Limitações deste relato

${semPersp ? '**Perspectiva não declarada — reflexividade comprometida.**\n' : ''}
**Setas sem tradução:** ${rede.associacoes.filter(a => !a.descricao_traducao).length} de ${rede.associacoes.length}
**Plasma:** ${plasma.length} hipóteses pendentes

*Gerado pelo TRAMA-TAR · Instituto Fab Lab Recife / CESAR School*
`;
    return md;
  }

  static toJSON(redeId, mapeadorId) {
    const rede = this.getRedeCompleta(redeId, mapeadorId);
    if (!rede) throw new NotFoundError('Rede');
    return { ...rede, exportado_em: new Date().toISOString() };
  }

  static toGraphML(redeId, mapeadorId) {
    const rede = this.getRedeCompleta(redeId, mapeadorId);
    if (!rede) throw new NotFoundError('Rede');

    const escXml = (v) => {
      if (v === null || v === undefined) return '';
      return String(v)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    const nodeIds = {};
    let nodeIdx = 1;
    rede.actantes.forEach(a => { nodeIds[a.id] = nodeIdx++; });

    const statusColors = {
      em_formacao: '#F0A020',
      estabilizado: '#2ECC71',
      contestado: '#F05545',
      disperso: '#555555'
    };

    const modoColors = {
      mediador: '#F0A020',
      intermediario: '#888888'
    };

    let graphml = `<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">
  <key id="nome" for="node" attr.name="nome" attr.type="string"/>
  <key id="descricao" for="node" attr.name="descricao" attr.type="string"/>
  <key id="status" for="node" attr.name="status" attr.type="string"/>
  <key id="tags" for="node" attr.name="tags" attr.type="string"/>
  <key id="modos" for="node" attr.name="modos_agencia" attr.type="string"/>
  <key id="tipo" for="node" attr.name="tipo" attr.type="string"/>
  <key id="plasma" for="node" attr.name="no_plasma" attr.type="string"/>
  <key id="fonte" for="node" attr.name="fonte" attr.type="string"/>
  <key id="modo_acao" for="edge" attr.name="modo_acao" attr.type="string"/>
  <key id="direcao" for="edge" attr.name="direcao" attr.type="string"/>
  <key id="intensidade" for="edge" attr.name="intensidade" attr.type="int"/>
  <key id="descricao" for="edge" attr.name="descricao_traducao" attr.type="string"/>
  <key id="edge_status" for="edge" attr.name="status" attr.type="string"/>
  <key id="label" for="node" attr.name="label" attr.type="string"/>
  <key id="weight" for="edge" attr.name="weight" attr.type="double"/>

  <graph id="G" edgedefault="directed">
`;

    rede.actantes.forEach(a => {
      const cor = a.no_plasma ? '#555555' : (statusColors[a.status] || '#888888');
      const label = a.nome.replace(/"/g, '&quot;');
      graphml += `    <node id="n${nodeIds[a.id]}">
      <data key="nome">${escXml(a.nome)}</data>
      <data key="descricao">${escXml(a.descricao)}</data>
      <data key="status">${a.status}</data>
      <data key="tags">${(a.tags || []).join(', ')}</data>
      <data key="modos">${(a.modos_agencia || []).join(', ')}</data>
      <data key="tipo">${a.tipo || 'actante'}</data>
      <data key="plasma">${a.no_plasma ? 'sim' : 'nao'}</data>
      <data key="fonte">${a.fonte}</data>
      <data key="label">${label}</data>
      <graphml:desc>Color: ${cor}</graphml:desc>
    </node>
`;
    });

    rede.associacoes.forEach(a => {
      if (!a.origem_id || !a.destino_id) return;
      const sourceIdx = nodeIds[a.origem_id];
      const targetIdx = nodeIds[a.destino_id];
      if (!sourceIdx || !targetIdx) return;
      const cor = modoColors[a.modo_acao] || '#888888';
      const weight = (a.intensidade || 3) / 5;
      graphml += `    <edge id="e${a.id}" source="n${sourceIdx}" target="n${targetIdx}">
      <data key="modo_acao">${a.modo_acao || ''}</data>
      <data key="direcao">${a.direcao || 'unidirecional'}</data>
      <data key="intensidade">${a.intensidade || 3}</data>
      <data key="descricao">${escXml(a.descricao_traducao)}</data>
      <data key="edge_status">${a.status}</data>
      <data key="weight">${weight}</data>
      <graphml:desc>Color: ${cor}</graphml:desc>
    </edge>
`;
    });

    graphml += `  </graph>
</graphml>`;

    return graphml;
  }
}

module.exports = ExportacaoService;
