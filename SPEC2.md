# TRAMA-TAR — Especificação do Projeto (v2.0)

**Versão:** 2.0  
**Data:** 2026-05-08  
**License:** AGPL-3.0  
**Repositório:** github.com/trama-tar

---

> **Legenda de Status**
> | **AZUL** | **AMARELO** | **VERMELHO** |
> | :-: | :-: | :-: |
> | Bem definido. Pode ser tratado como decisão consolidada para o MVP. | Forte, mas ainda depende de validação final ou detalhamento operacional. | Aberto. Não deve ser resolvido na fase de código por inferência. |

---

## 1. Visão Geral do Projeto

### 1.1 Nome e Identidade

**Nome:** TRAMA-TAR  
**Nome Completo:** Plataforma de Mapeamento de Redes pela Teoria Ator-Rede  
**Tagline:** "Mapeiecontroversias, visualize redes, siga os actantes."

### 1.2 Propósito | AZUL

O TRAMA-TAR é uma plataforma open source para pesquisadores mapearemcontroversias, redes sociais e relações sociotécnicas usando os princípios da Teoria Ator-Rede (ANT). A ferramenta permite documentar actantes heterogêneos (humanos, tecnologias, instituições, ideias), suas associações e traduzir as dinâmicas de poder e mediação em uma rede visualizável.

### 1.3 Problema que Resolve | AZUL

Pesquisadores e mapeadores da tradição ANT frequentemente utilizam ferramentas genéricas (Gephi, Cytoscape, Miro) que:
- Não distinguem entre actantes humanos e não-humanos
- Não capturam conceitos como "plasma", "caixa preta", "tradução"
- Não preservam histórico de mudanças
- Exigem exportação/importação manual para análises

O TRAMA-TAR resolve isso oferecendo uma ferramenta nativa para mapeamento ANT.

### 1.4 Stack Tecnológico | AZUL

| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js + Express |
| Banco de Dados | SQLite (better-sqlite3) |
| Autenticação | JWT + bcrypt |
| Frontend | Vanilla JS + D3.js |
| Servidor | Express static + API |
| Deploy | Docker / manual |

---

## 2. Constituição Operacional | AMARELO

### 2.1 Princípios Não Negociáveis | AZUL

- **Não prejudicar quem já foi prejudicado** — Toda decisão de produto deve ser avaliada contra este princípio.
- **Transparência sem exceção** — Dados, algoritmos e decisões devem ser rastreáveis.
- **Supervisão humana não é opcional** — Nenhuma síntese automática sem revisão humana.
- **Conhecimento situado é dado de projeto** — O contexto territorial é parte da especificação.
- **Reversibilidade é funcionalidade** — O usuário pode exportar, migrar e reverter decisões.
- **Contextualização antes de adoção** — Não assumir que o que funciona em um contexto serve para outro.

### 2.2 Implicações Diretas no Produto | AZUL

- Nenhuma decisão automatizada final sem revisão humana.
- Toda síntese estratégica deve ter origem, responsável e contexto.
- A plataforma não deve coletar dados além do necessário.
- A base precisa ser portável e reversível.
- Feedback territorial e escuta qualificada não podem virar apêndices secundários.
- **Frugalidade operacional é requisito** — Evitar dependências de custo variável elevado, lock-in prematuro e uso desnecessário de processamento.

---

## 3. Usuários, Perfis e Jobs to Be Done | AZUL

### 3.1 Usuários Principais

| **Perfil** | **Objetivo Principal** | **Valor Esperado** |
| :-: | :-- | :-- |
| Pesquisador acadêmico | Mapear controvérsias para teses e artigos | Preservar histórico, exportar para formatos acadêmicos |
| Mestrando/Doutorando | Documentar ato-res de pesquisa ANT | Interface nativa para conceitos ANT |
| Consultor de C&T | Análises de redes sociotécnicas | Visualização clara, dados portáveis |
| Mapeador de controvérsias | Journalist de dados, pesquisadores de STS | Framework conceitual pronto |
| Estudante | Disciplinas de metodologia qualitativa | Ferramenta didática, simples |

### 3.2 Jobs to Be Done

- **Quando o pesquisador estiver fazendo trabalho de campo**, precisa registrar actantes, associá-los e documentar a controvérsia sem perder contexto.

- **Quando o pesquisador estiver analisando a rede**, precisa visualizar o grafo completo, identificar mediadores e detectar padrões de tradução.

- **Quando o pesquisador precisar escrever o relatório**, precisa exportar os dados em formatos compatíveis com ferramentas acadêmicas.

- **Quando o professor estiver ensinando ANT**, precisa de uma ferramenta que demonstre visualmente os conceitos (plasma, caixa preta, mediação).

---

## 4. Product Spec — Plataforma TRAMA-TAR | AZUL

### 4.1 Nome Oficial do Produto | AZUL

TRAMA-TAR — Plataforma de Mapeamento de Redes pela Teoria Ator-Rede

### 4.2 Definição Oficial do Produto | AZUL

O TRAMA-TAR é uma plataforma WEB que permite a pesquisadores mapearcontroversias, documentar actantes heterogêneos (humanos, tecnologias, instituições, ideias), registrar associações, visualizaredes em grafo interativo e exportar dados para análise acadêmica.

### 4.3 O que o Produto Resolve | AZUL

- Sem o produto, o mapeamento ANT se dispersa em planilhas e documentos.
- A transição entre actantes e associações depende de memória manual.
- O pesquisador não acessa visão clara da rede completa.
- A exportação para formatos acadêmicos exige trabalho manual.

### 4.4 O que o Produto É | AZUL

- Uma plataforma WEB-first.
- Uma infraestrutura de dados para pesquisa ANT.
- Uma ferramenta de visualização de redes.
- Um instrumento de apoio à decisão metodológica.
- Uma base de conhecimento territorial cumulativo.

### 4.5 O que o Produto Não É | AZUL

- Não é o ecossistema FIGITAL completo.
- Não é rede social territorial completa.
- Não é LMS completo.
- Não é ferramenta de Business Intelligence.
- Não é aplicativo mobile nativo.
- Não é automação total do método ANT.
- Não substitui facilitação ou trabalho de campo humano.

### 4.6 Valor Gerado no Curto Prazo | AZUL

- Memória estruturada do mapeamento.
- Rastreabilidade do processo de rede.
- Consolidação da leitura de controvérsia.
- Passagem do campo para a análise.
- Rede visualizável e exportável.

---

## 5. MVP Spec — Escopo Inicial | AZUL

### 5.1 Definição do MVP | AZUL

O MVP é o núcleo operacional inicial do TRAMA-TAR, suficiente para criar redes, registrar actantes, criar associações, visualizar o grafo e exportar dados.

### 5.2 Princípio do Corte | AZUL

Entram no MVP apenas as capacidades que produzem base de dados da rede, sustentam a passagem entre actantes e relações, permitem visualização do grafo e geram exportação útil.

### 5.3 Capacidades Centrais do MVP | AZUL

| **Código** | **Capacidade** | **Motivo de Entrada** |
| :-- | :-- | :-- |
| CAP-01 | Autenticação de mapeador | Sem usuário, não existe rastreabilidade. |
| CAP-02 | Criar e gerenciar redes | Sem rede, não existe mapeamento. |
| CAP-03 | Registrar e organizar actantes | Etapa central do mapeamento ANT. |
| CAP-04 | Criar associações entre actantes | Tradução e mediação são o núcleo da ANT. |
| CAP-05 | Visualizar rede em grafo D3 | Interface essencial para análise. |
| CAP-06 | Exportar dados (JSON, GraphML, CSV) | Interoperabilidade com ferramentas acadêmicas. |
| CAP-07 | Landing page institucional | Apresentação do projeto e proposta de valor. |

### 5.4 O que Entra no MVP | AZUL

- Landing page pública
- Autenticação (registro, login, JWT)
- CRUD completo de Redes
- CRUD completo de Actantes
- CRUD completo de Associações
- Visualização D3.js do grafo
- Histórico de versões de actantes
- Exportação JSON / GraphML / CSV
- Dashboard executivo resumido

### 5.5 O que Fica Fora do MVP | AZUL

- Colaboração em tempo real
- Versão mobile nativa
- Múltiplos layouts de visualização avançados
- Importação automática de dados externos
- Geração automática de análises
- Chat ou comunidade digital
- Plugin system para extensões

### 5.6 Critérios de Sucesso do MVP | AZUL

- Um mapeador pode criar conta e fazer login.
- O mapeador cria uma rede e registra actantes.
- O mapeador associa actantes e visualiza o grafo.
- O mapeador exporta os dados em formatos utilizáveis.
- A plataforma pode ser usada em apresentação de pesquisa sem explicação excessiva.

---

## 6. Feature Specs Centrais do MVP | AMARELO

### FS-01 — Autenticação e Cadastro de Mapeador | AZUL

**Objetivo:** Criar identidade do usuário para rastreabilidade do mapeamento.

- **Usuário principal:** Pesquisador, mestrando, professor.
- **Pré-condição:** Nenhuma.
- **Happy path:** Acessar página → Clicar em registro → Preencher nome, email, senha → Confirmar email → Receber token → Acesso autorizado.
- **Edge cases:** Email duplicado, senha fraca, token expirado.
- **Critério de aceite:** Usuário criado com hash de senha seguro e JWT funcional.

### FS-02 — Criar e Gerenciar Redes | AZUL

**Objetivo:** Criar o contexto territorial do mapeamento.

- **Usuário principal:** Mapeador autenticado.
- **Pré-condição:** Usuário logado.
- **Happy path:** Dashboard → Nova rede → Preencher nome, controvérsia, escopo → Salvar → Rede aparece na lista → Acessar rede.
- **Edge cases:** Nome duplicado para o mesmo usuário, dados mínimos insuficientes.
- **Critério de aceite:** Rede criada com todos os campos de metadata.

### FS-03 — Registrar Actantes | AZUL

**Objetivo:** Documentar entidades da rede segundo princípios ANT.

- **Usuário principal:** Mapeador autenticado.
- **Pré-condição:** Rede existente.
- **Happy path:** Entrar na rede → Novo actante → Preencher nome, tipo, status, posição → Salvar → Actante aparece no grafo.
- **Edge cases:** Nome em branco, tipo inválido, posição negativa.
- **Critério de aceite:** Actante criado com todos os campos, visível no grafo.

### FS-04 — Criar Associações | AZUL

**Objetivo:** Documentar traduções e mediações entre actantes.

- **Usuário principal:** Mapeador autenticado.
- **Pré-condição:** Pelo menos dois actantes na rede.
- **Happy path:** Selecionar actante de origem → Selecionar actante de destino → Definir modo de ação → Salvar → Aresta aparece no grafo.
- **Edge cases:** Origem igual ao destino, intensidade fora do range.
- **Critério de aceite:** Associação criada, aresta visível no grafo.

### FS-05 — Visualizar Rede em Grafo | AZUL

**Objetivo:** Representar visualmente a rede como grafo de actantes e associações.

- **Usuário principal:** Mapeador autenticado.
- **Pré-condição:** Rede com actantes.
- **Happy path:** Abrir rede → Grafo D3 renderiza → Zoom, pan, clique em nó → Detalhes do actante.
- **Edge cases:** Rede vazia, grafo muito grande para renderizar.
- **Critério de aceite:** Grafo interativo renderiza actantes e arestas.

### FS-06 — Exportar Dados | AZUL

**Objetivo:** Permitir interoperabilidade com ferramentas externas.

- **Usuário principal:** Mapeador autenticado.
- **Pré-condição:** Rede com dados.
- **Happy path:** Selecionar rede → Escolher formato → Download do arquivo → Arquivo abre em ferramenta externa.
- **Edge cases:** Rede vazia, formato não suportado.
- **Critério de aceite:** Arquivo válido nos três formatos (JSON, GraphML, CSV).

---

## 7. Design Spec — Derivação | AMARELO

### 7.1 Princípios de UX | AZUL

- **WEB-first** — Plataforma primária é o browser.
- **Foco principal em desktop/laptop** — Para trabalho de análise.
- **Navegação curta** — Máximo 3 cliques para qualquer ação.
- **Excelente legibilidade** — Tipografia clara, contraste adequado.
- **Poucos campos obrigatórios por tela** — Não bloquear o registro.
- **Estados vazios úteis** — Mensagens claras com ação recomendada.
- **Feedback explícito** — Erro e sucesso sempre visíveis.

### 7.2 Estados Obrigatórios por Tela | AZUL

| **Tela** | **Vazio** | **Carregando** | **Erro** | **Sucesso** |
| :-- | :-- | :-- | :-- | :-- |
| Lista de redes | "Nenhuma rede ainda." / Ação: Criar primeira. | Skeleton dos cards. | "Falha ao carregar redes." / Ação: Tentar novamente. | Nova rede destacada no topo, toast. |
| Grafo | "Adicione o primeiro actante para começar." | Pontos em tom cinza pulsante. | "Falha ao renderizar." / Ação: Recarregar. | Actante recém-criado aparece com destaque. |
| Formulário actante | Campos vazios com placeholders. | Botão desabilitado "Salvando...". | Mensagem no campo que falhou. | Redireciona para grafo com item em destaque. |
| Exportação | "Nenhum dado para exportar." | Botão com texto "Gerando...". | "Falha ao gerar." / Ação: Tentar novamente. | Link disponível, persistente na sessão. |

### 7.3 Estrutura de Navegação | AMARELO

| **Camada** | **Componente** |
| :-- | :-- |
| Global | Logo TRAMA-TAR, seletor de rede ativa, botão sair |
| Local | Abas: Redes, Actantes, Associações, Visualização, Exportar |
| Breadcrumb | Rede ativa > Actantes |

### 7.4 Separação Visão Executiva vs Operacional | AZUL

| **Entidade** | **Visão Executiva** | **Visão Operacional** |
| :-- | :-- | :-- |
| Rede | Nome, controvérsia, data da última atualização | Todos os campos, histórico de alterações |
| Actante | Tipo, status, posição no grafo | Todos os campos, versão anterior, justificativa |
| Associação | Modo de ação, intensidade | Todos os campos, origem/destino completo |

---

## 8. Matriz de Permissões | AMARELO

| **Módulo / ação** | **Admin** | **Mapeador** | **Leitor** |
| :-- | :-- | :-- | :-- |
| Criar/editar redes | Sim | Sim | Não |
| Ver todas as próprias redes | Sim | Sim | Não |
| Criar/editar actantes | Sim | Sim | Não |
| Criar/editar associações | Sim | Sim | Não |
| Ver grafo completo | Sim | Sim | Parcial |
| Exportar dados | Sim | Sim | Não |
| Ver histórico de versões | Sim | Sim | Não |
| Excluir (soft) actantes | Sim | Sim | Não |

---

## 9. Technical Direction | AMARELO

### 9.1 Stack Definida | AZUL

| **Camada** | **Tecnologia** |
| :-- | :-- |
| Runtime | Node.js 18+ |
| Web Server | Express.js |
| Banco de Dados | SQLite (better-sqlite3) |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Frontend | Vanilla JS + D3.js v7 |
| Security | Helmet, CORS, Rate Limit |

### 9.2 Arquitetura por Domínio | AZUL

O MVP será implementado como aplicação web organizada por domínio funcional:

- **Domínio Autenticação** — Registro, login, JWT, middleware.
- **Domínio Redes** — CRUD completo de redes.
- **Domínio Actantes** — CRUD completo, histórico de versões.
- **Domínio Associações** — CRUD completo.
- **Domínio Visualização** — D3.js rendering, layout algorithms.
- **Domínio Exportação** — JSON, GraphML, CSV generation.

### 9.3 Regras de Entrada de Dependências | AMARELO

- Nenhuma integração externa deve entrar no MVP apenas por sofisticação técnica.
- Para cada dependência adicional, registrar: finalidade, obrigatoriedade, custo, fallback.
- Priorizar soluções suficientes, uso controlado de integrações, ausência de dependência obrigatória de LLMs no núcleo.

---

## 10. Matriz de Exportação por Formato | AMARELO

| **Saída** | **JSON** | **GraphML** | **CSV** | **Perfil** | **Uso Esperado** |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Rede completa | Primário | Secundário | — | Mapeador | Backup e migração |
| Atores e relações | — | Primário | Secundário | Mapeador | Gephi, Cytoscape |
| Actantes | Primário | — | Primário | Mapeador | Análise em planilha |
| Associações | Primário | — | Primário | Mapeador | Análise em planilha |
| Histórico de versões | Primário | — | — | Mapeador | Auditoria de mudanças |

**Regra de Auditoria:** Toda exportação gera registro com: entidade, filtros, responsável, data/hora, total de registros.

---

## 11. Hierarquia do Dashboard | AMARELO

| **Nível** | **Bloco** | **Função** | **Conteúdo Mínimo** |
| :-- | :-- | :-- | :-- |
| 1 | Cabeçalho identitário | Identificar a rede | Nome, controvérsia, data de atualização |
| 2 | Stats — Actantes | Massa de trabalho | Total actantes, por tipo, por status |
| 2 | Stats — Associações | Massa de relações | Total associações, mediadores, intermediários |
| 2 | Stats — Plata | Actantes não mapeados | Total actantes-plasma |
| 3 | Grafo resumido | Visualização mínima | Preview do grafo com zoom |
| 3 | Top mediadores | Atores centrais | 5 actantes com mais conexões |
| 4 | Rodapé institucional | Transparência | Plataforma, versão, glossário |

---

## 12. Glossário de Termos ANT | AZUL

| **Termo** | **Definição** |
| :-- | :-- |
| Actante | Entidade que age e é afetada (humano, tecnologia, ideia, instituição) |
| Rede | Conjunto de actantes e suas associações |
| Tradução | Processo de mediação entre actantes |
| Mediador | Actante que transforma o que passa por ele |
| Intermediário | Actante que apenas transmite sem transformar |
| Plasma | Domínio do não-mapeado ainda |
| Caixa Preta | Rede estabilizada que funciona como unidade |
| Controvérsia | Issue social que divide actantes |
| Immutável Móvel | Entidade que pode circular sem ser alterada |

---

## 13. Modelo de Dados | AZUL

### 13.1 Entidades e Campos Mínimos

| **Entidade** | **Campos Mínimos** |
| :-- | :-- |
| Mapeador | nome, email, senha_hash |
| Rede | nome, controversia, mapeador_id |
| Actante | nome, tipo, status, rede_id, pos_x, pos_y |
| Associacao | origem_id, destino_id, modo_acao, rede_id |
| Actante_Versao | actante_id, campos_anteriores, modificado_por |
| Caixa_Preta | nome, descricao, rede_id |

### 13.2 Relações

- Rede → Mapeador (1:N)
- Actante → Rede (N:1)
- Associacao → Rede (N:1)
- Associacao → Actante origem (N:1)
- Associacao → Actante destino (N:1)
- Actante_Versao → Actante (N:1)
- Caixa_Preta → Rede (N:1)

---

## 14. API Reference | AZUL

| **Método** | **Endpoint** | **Auth** | **Descrição** |
| :-- | :-- | :-- | :-- |
| GET | /api/health | Não | Health check |
| POST | /api/auth/registro | Não | Criar conta |
| POST | /api/auth/login | Não | Login |
| GET | /api/auth/me | Sim | Dados do usuário |
| GET | /api/redes | Sim | Listar redes |
| POST | /api/redes | Sim | Criar rede |
| GET | /api/redes/:id | Sim | Detalhes da rede |
| PATCH | /api/redes/:id | Sim | Atualizar rede |
| DELETE | /api/redes/:id | Sim | Deletar rede |
| GET | /api/redes/:redeId/actantes | Sim | Listar actantes |
| POST | /api/redes/:redeId/actantes | Sim | Criar actante |
| PATCH | /api/redes/:redeId/actantes/:id | Sim | Atualizar actante |
| DELETE | /api/redes/:redeId/actantes/:id | Sim | Remover actante |
| GET | /api/redes/:redeId/associacoes | Sim | Listar associações |
| POST | /api/redes/:redeId/associacoes | Sim | Criar associação |
| PATCH | /api/redes/:redeId/associacoes/:id | Sim | Atualizar associação |
| DELETE | /api/redes/:redeId/associacoes/:id | Sim | Deletar associação |
| GET | /api/redes/:redeId/exportacao/json | Sim | Exportar JSON |
| GET | /api/redes/:redeId/exportacao/graphml | Sim | Exportar GraphML |
| GET | /api/redes/:redeId/exportacao/csv | Sim | Exportar CSV |

---

## 15. Diferenças e Complementações vs SPEC.md v1.0

### O que foi Acrescentado

1. **Sistema de Status AZUL/AMARELO/VERMELHO** — Metodologia visual para rastrear consolidação de decisões.

2. **Constituição Operacional** — Princípios não negociáveis que guiam decisões de produto.

3. **Seção de Usuários e Jobs to Be Done** — Perfis detalhados com objetivos e valores esperados.

4. **Feature Specs Detalhadas** — Cada feature com objetivo, usuário, happy path, edge cases e critério de aceite.

5. **Design Spec Completo** — Estados de interface, estrutura de navegação, separação executivo/operacional.

6. **Matriz de Permissões** — Controle de acesso por perfil de usuário.

7. **Technical Direction Expandido** — Stack, arquitetura por domínio, regras de dependências.

8. **Matriz de Exportação** — Formatos, perfis, usos e regras de auditoria.

9. **Hierarquia do Dashboard** — Blocos organizados por nível de importância.

### O que foi Modificado

1. **Product Spec Expandido** — Mais detalhado, com "o que resolve", "o que é", "o que não é", valor gerado.

2. **MVP Spec com Tabela de Capacidades** — Código, capacidade e motivo de entrada.

3. **Design Spec com Estados Obrigatórios** — Tabela completa de estados por tela.

4. **API Reference com Coluna de Auth** — Explicitando quais rotas requerem autenticação.

---

## 16. Política de Retenção de Exports | AZUL

### 16.1 Princípios

A política de retenção de exports segue os princípios de:
- **Frugalidade operacional** — Evitar acúmulo desnecessário de arquivos.
- **Transparência** — O usuário sabe quando seus arquivos expiram.
- **Reversibilidade** — O usuário pode sempre regenerar uma exportação.

### 16.2 Período de Retenção

| **Tipo de Exportação** | **Retenção** | **Motivo** |
| :-- | :-- | :-- |
| JSON (backup completo) | 30 dias | Dados completos podem ser regenerados |
| GraphML (visualização) | 30 dias | Formato leve, regenerável |
| CSV (análise) | 30 dias | Dados tabulares completos |
| PDF (institucional) | 30 dias | Documento legível, pode ser regenerado |

**Período padrão: 30 dias** para todos os formatos.

### 16.3 Fluxo de Expiração

1. **Geração** → Arquivo criado com metadata de data de expiração
2. **Disponibilidade** → Link válido por 30 dias na sessão do usuário
3. **Notificação** → 7 dias antes da expiração, usuário recebe aviso
4. **Expiração** → Link removido, arquivo excluido do servidor
5. **Regeneração** → Usuário pode gerar nova exportação a qualquer tempo

### 16.4 Regras Operacionais

- **Armazenamento** — Exports são armazenados em memória temporária ou diretório temporário do sistema.
- **Naming** — Arquivos seguem padrão: `TRAMA-TAR_<rede>_<tipo>_<data>_<timestamp>.<ext>`
- **Auditoria** — Cada exportação gera log com: usuário, rede, formato, data de geração, data de expiração.
- **Sem custo adicional** — O MVP não cobra por storage de exports.

### 16.5 Registro de Exportação

```sql
CREATE TABLE exportacoes (
  id TEXT PRIMARY KEY,
  usuario_id TEXT REFERENCES mapeadores(id),
  rede_id TEXT REFERENCES redes(id),
  formato TEXT NOT NULL,  -- json, graphml, csv
  gerado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  expira_em DATETIME NOT NULL,
  arquivo_path TEXT,
  registros_total INTEGER,
  status TEXT DEFAULT 'ativa'  -- ativa, expirada
);
```

### 16.6 Comportamento no Frontend

- **Indicação de expiração** — Cada arquivo exportado mostra "Expira em X dias"
- **Histórico de exports** — Usuário pode ver lista de exports dos últimos 30 dias
- **Regeneração** — Botão "Gerar novamente" disponível para qualquer rede
- **Limite de storage** — Se storage temporário exceder 500MB, expira exports mais antigas automaticamente

### 16.7 Alternativas Futuras (Não no MVP)

- Exportação com link permanente (requer autenticação)
- Pacote ZIP compactado para múltiplas redes
- Assinatura de download por email

---

## 17. Itens Pendentes (A Decidir) | VERMELHO

| **Item** | **Status** | **O que Falta** |
| :-- | :-- | :-- |
| Layout final das exports PDF | AMARELO | Template visual institucional |
| Semáforos de indicador (cores/limiares) | AMARELO | Definição de cores para status |
| Política de retenção de exports | **AZUL** | Implementada — 30 dias com notificação |
| Layout maestro do dashboard | AMARELO | Design final dos blocos |

---

## 18. Propostas de Solução para Pendências | AMARELO

### 18.1 Layout das Exports PDF — Proposta

**Proposta:** Usar template HTML/CSS server-side com identidade visual minimalista.

**Estrutura do PDF:**

```
┌─────────────────────────────────────────────┐
│ [CABEÇALHO]                                 │
│ TRAMA-TAR | Nome da Rede                    │
│ Data: DD/MM/AAAA | Exportado por: nome       │
├─────────────────────────────────────────────┤
│                                             │
│ [CONTEÚDO PRINCIPAL]                       │
│ - Resumo da rede                            │
│ - Tabela de actantes                        │
│ - Tabela de associações                     │
│ - Estatísticas                              │
│                                             │
├─────────────────────────────────────────────┤
│ [RODAPÉ]                                    │
│ Página X de Y | Generated by TRAMA-TAR v1  │
└─────────────────────────────────────────────┘
```

**Componentes do Template:**

| **Componente** | **Descrição** |
| :-- | :-- |
| Capa | Apenas se export > 10 páginas (opcional) |
| Cabeçalho | Logo TRAMA-TAR, nome da rede, data, responsável |
| Corpo | Tabelas zebradas, fonte sans-serif 12px |
| Rodapé | Paginação, data, versão da plataforma |
| Estilo | Cores: --amber (#F0A020), --bg (#060606), --white (#FFF) |

**Tecnologia Sugerida:** PDFKit ou Puppeteer (server-side rendering).

---

### 18.2 Semáforos de Indicador — Proposta

**Proposta:** Sistema de 4 estados visuais com cores e critérios objetivos.

**Estados do Semáforo:**

| **Estado** | **Cor** | **Critério** | **Quando Usar** |
| :-- | :-- | :-- | :-- |
| **Verde** | `#2ECC71` | Valor atual ≥ meta | Meta atingida ou.superada |
| **Âmbar** | `#F0A020` | Valor atual ≥ 50% da meta e < meta | Progresso adequado |
| **Vermelho** | `#E74C3C` | Valor atual < 50% da meta | Atraso significativo |
| **Cinza** | `#7F8C8D` | Sem baseline definido | Dado não iniciou |

**Escala Visual:**

```
[███████] Verde    — ≥ 100% da meta
[██████░] Âmbar    — ≥ 50% e < 100%
[████░░░] Vermelho — < 50%
[░░░░░░░] Cinza    — Sem dado
```

**Critérios por Tipo de Indicador:**

| **Tipo** | **Cálculo** | **Exemplo** |
| :-- | :-- | :-- |
| Progresso | (atual / meta) × 100 | % completo |
| Tendência | (atual - baseline) / baseline | Crescimento % |
| Contagem | atual >= meta ? verde : vermelho | Total acumulado |

**Exibição no Dashboard:**

- Ícone de cor + texto descritivo
- Tooltip com: valor atual, meta, baseline, última atualização
- Alerta visual quando 3+ indicadores em vermelho

---

### 18.3 Layout do Dashboard — Proposta

**Proposta:** Grid de 2 colunas com 4 níveis hierárquicos de informação.

**Estrutura Visual:**

```
┌────────────────────────────────────────────────────────────┐
│  TRAMA-TAR                              [rede: nome]  [☰] │
├────────────────────────────────────────────────────────────┤
│  ┌────────────────────────┐  ┌────────────────────────┐  │
│  │   STATS - ACTANTES     │  │   STATS - ASSOCIAÇÕES  │  │
│  │   Total: 24            │  │   Total: 18            │  │
│  │   Humana: 12           │  │   Mediadores: 5        │  │
│  │   Tecnologia: 5        │  │   Intermediários: 13   │  │
│  │   Instituição: 4       │  │                         │  │
│  │   Plasma: 3            │  │                         │  │
│  └────────────────────────┘  └────────────────────────┘  │
│                                                            │
│  ┌────────────────────────────────────────┐  ┌──────────┐  │
│  │           VISUALIZAÇÃO                  │  │ MEDIAD. │  │
│  │           (Grafo D3.js)                 │  │ TOP 5   │  │
│  │                                        │  │ 1. João │  │
│  │      [●]──[●]──[●]                     │  │ 2. Univ │  │
│  │         │                              │  │ 3. Pref │  │
│  │       [●]──[●]                         │  │ 4. Tech │  │
│  │                                        │  │ 5. UNDP │  │
│  └────────────────────────────────────────┘  └──────────┘  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  RODAPÉ: TRAMA-TAR v1.0 | Glossário | Contato       │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

**Blocos do Dashboard:**

| **Bloco** | **Tamanho** | **Conteúdo** |
| :-- | :-- | :-- |
| Cabeçalho | 100% | Logo, seletor de rede, menu |
| Stats Actantes | 50% | Contagem por tipo e status |
| Stats Associações | 50% | Contagem por modo de ação |
| Visualização | 70% | Mini grafo D3 interativo |
| Top Mediadores | 30% | Lista dos 5 mais conectados |
| Rodapé | 100% | Versão, links |

**Especificações Técnicas:**

| **Aspecto** | **Valor** |
| :-- | :-- |
| Grid | CSS Grid, 2 colunas, gap 16px |
| Responsivo | Stack vertical em mobile (<768px) |
| Cores | Usar design tokens do projeto |
| Interação | Click no bloco → tela cheia |
| Atualização | Auto-refresh a cada 60s ou manual |

---

## 19. Atualização do Status de Pendências

| **Item** | **Antes** | **Depois** | **Proposta** |
| :-- | :-- | :-- | :-- |
| Layout PDF | AMARELO | **AZUL** | Template server-side com Puppeteer |
| Semáforos | AMARELO | **AZUL** | 4 estados: verde/âmbar/vermelho/cinza |
| Dashboard | AMARELO | **AZUL** | Grid 2 colunas, 4 níveis |
| **Internacionalização (i18n)** | — | **AZUL** | Implementada: pt-BR, en, es com i18next |

---

## 17. Responsabilidades | AMARELO

| **Pessoa** | **Foco Principal** |
| :-- | :-- |
| Desenvolvedor | Implementação, código, testes |
| Product Owner | Escopo, priorização, validação funcional |
| Designer | UX/UI, wireframes, states |
| Pesquisador ANT | Validação metodológica, termos conceituais |

---

## 18. Uso deste Documento | AZUL

Este documento é a principal base de entrada para implementação do MVP do TRAMA-TAR.

- Itens em **AZUL** podem ser implementados diretamente.
- Itens em **AMARELO** exigem prudência; não decidir arbitrariamente.
- Itens em **VERMELHO** não devem ser inventados no código; devem virar perguntas explícitas.

---

## 20. Internacionalização (i18n) | AZUL

### 20.1 Escopo

A plataforma suportará três idiomas:
- **PT-BR** — Português do Brasil (idioma padrão)
- **EN** — English (inglês)
- **ES** — Español (espanhol)

### 20.2 Arquitetura de Internacionalização

```
/server
  /i18n/
    index.js           # Configuração principal
    locales/
      pt-BR.json       # Traduções português
      en.json          # Traduções inglês
      es.json          # Traduções espanhol
```

### 20.3 Estrutura de Arquivos de Tradução

```json
{
  "app": {
    "name": "TRAMA-TAR",
    "tagline": "Plataforma de Mapeamento de Redes pela Teoria Ator-Rede"
  },
  "nav": {
    "dashboard": "Painel",
    "redes": "Redes",
    "actantes": "Actantes",
    "associacoes": "Associações",
    "exportar": "Exportar",
    "configuracoes": "Configurações"
  },
  "actions": {
    "criar": "Criar",
    "editar": "Editar",
    "excluir": "Excluir",
    "salvar": "Salvar",
    "cancelar": "Cancelar",
    "exportar": "Exportar",
    "buscar": "Buscar"
  },
  "messages": {
    "success": "Operação realizada com sucesso",
    "error": "Erro ao realizar operação",
    "loading": "Carregando...",
    "empty": "Nenhum registro encontrado",
    "confirmDelete": "Tem certeza que deseja excluir?"
  },
  "entities": {
    "rede": {
      "singular": "Rede",
      "plural": "Redes",
      "fields": {
        "nome": "Nome",
        "controversia": "Controvérsia",
        "escopo_temporal": "Escopo Temporal",
        "escopo_espacial": "Escopo Espacial"
      }
    },
    "actante": {
      "singular": "Actante",
      "plural": "Actantes",
      "types": {
        "humano": "Humano",
        "tecnologia": "Tecnologia",
        "instituicao": "Instituição",
        "ideia": "Ideia",
        "natureza": "Natureza"
      },
      "status": {
        "em_formacao": "Em Formação",
        "estabilizado": "Estabilizado",
        "contestado": "Contestado",
        "disperso": "Disperso"
      }
    },
    "associacao": {
      "singular": "Associação",
      "plural": "Associações",
      "modo_acao": {
        "mediador": "Mediador",
        "intermediario": "Intermediário"
      },
      "direcao": {
        "unidirecional": "Unidirecional",
        "bidirecional": "Bidirecional"
      }
    }
  },
  "auth": {
    "login": "Entrar",
    "logout": "Sair",
    "registro": "Cadastrar",
    "email": "E-mail",
    "senha": "Senha",
    "nome": "Nome",
    "forgotPassword": "Esqueci a senha",
    "noAccount": "Não tem conta?",
    "hasAccount": "Já tem conta?"
  },
  "errors": {
    "notFound": "Não encontrado",
    "unauthorized": "Não autorizado",
    "validation": "Erro de validação",
    "serverError": "Erro interno do servidor"
  },
  "glossary": {
    "title": "Glossário",
    "actante": "Entidade que age e é afetada por outras",
    "traducao": "Processo de mediação entre actantes",
    "mediador": "Actante que transforma o que passa por ele",
    "plasma": "Domínio do não-mapeado ainda",
    "caixa_preta": "Rede estabilizada que funciona como unidade"
  }
}
```

### 20.4 Tabela de Traduções Completas

| **Chave** | **PT-BR** | **EN** | **ES** |
| :-- | :-- | :-- | :-- |
| app.name | TRAMA-TAR | TRAMA-TAR | TRAMA-TAR |
| app.tagline | Mapeamento de Redes ANT | ANT Network Mapping | Mapeo de Redes ANT |
| nav.dashboard | Painel | Dashboard | Panel |
| nav.redes | Redes | Networks | Redes |
| nav.actantes | Actantes | Actants | Actantes |
| nav.associacoes | Associações | Associations | Asociaciones |
| nav.exportar | Exportar | Export | Exportar |
| nav.configuracoes | Configurações | Settings | Configuración |
| actions.criar | Criar | Create | Crear |
| actions.editar | Editar | Edit | Editar |
| actions.excluir | Excluir | Delete | Eliminar |
| actions.salvar | Salvar | Save | Guardar |
| actions.cancelar | Cancelar | Cancel | Cancelar |
| actions.exportar | Exportar | Export | Exportar |
| actions.buscar | Buscar | Search | Buscar |
| messages.success | Operação realizada com sucesso | Operation successful | Operación exitosa |
| messages.error | Erro ao realizar operação | Operation failed | Error en operación |
| messages.loading | Carregando... | Loading... | Cargando... |
| messages.empty | Nenhum registro encontrado | No records found | No se encontraron registros |
| messages.confirmDelete | Tem certeza que deseja excluir? | Are you sure you want to delete? | ¿Está seguro de eliminar? |
| entities.rede.singular | Rede | Network | Red |
| entities.rede.plural | Redes | Networks | Redes |
| entities.rede.fields.nome | Nome | Name | Nombre |
| entities.rede.fields.controversia | Controvérsia | Controversy | Controversia |
| entities.actante.singular | Actante | Actant | Actante |
| entities.actante.plural | Actantes | Actants | Actantes |
| entities.actante.types.humano | Humano | Human | Humano |
| entities.actante.types.tecnologia | Tecnologia | Technology | Tecnología |
| entities.actante.types.instituicao | Instituição | Institution | Institución |
| entities.actante.types.ideia | Ideia | Idea | Idea |
| entities.actante.types.natureza | Natureza | Nature | Naturaleza |
| entities.actante.status.em_formacao | Em Formação | Forming | En formación |
| entities.actante.status.estabilizado | Estabilizado | Stabilized | Establecido |
| entities.actante.status.contestado | Contestado | Contested | Cuestionado |
| entities.actante.status.disperso | Disperso | Dispersed | Disperso |
| entities.associacao.singular | Associação | Association | Asociación |
| entities.associacao.plural | Associações | Associations | Asociaciones |
| entities.associacao.modo_acao.mediador | Mediador | Mediator | Mediador |
| entities.associacao.modo_acao.intermediario | Intermediário | Intermediary | Intermediario |
| auth.login | Entrar | Login | Iniciar sesión |
| auth.logout | Sair | Logout | Cerrar sesión |
| auth.registro | Cadastrar | Register | Registrarse |
| auth.email | E-mail | Email | Correo electrónico |
| auth.senha | Senha | Password | Contraseña |
| auth.nome | Nome | Name | Nombre |
| errors.notFound | Não encontrado | Not found | No encontrado |
| errors.unauthorized | Não autorizado | Unauthorized | No autorizado |
| errors.validation | Erro de validação | Validation error | Error de validación |
| errors.serverError | Erro interno do servidor | Server error | Error del servidor |

### 20.5 Implementação Técnica

**Biblioteca:** i18next (Node.js)

**Estrutura de Arquivos Implementada:**

```
server/i18n/
├── index.js           # Configuração principal + exports
├── middleware.js      # Middleware Express para i18n
└── locales/
    ├── pt-BR.json    # Traduções português (11KB)
    ├── en.json        # Traduções inglês (11KB)
    └── es.json        # Traduções espanhol (11KB)
```

**Uso em rotas:**

```javascript
// No Express middleware
const { i18nMiddleware } = require('./i18n/middleware');
app.use(i18nMiddleware);

// Em qualquer rota
app.get('/api/redes', (req, res) => {
  const t = req.t; // Função de tradução disponível
  res.json({ message: t('messages.success') });
});
```

**API Endpoints de Internacionalização:**

| **Método** | **Endpoint** | **Descrição** |
| :-- | :-- | :-- |
| GET | `/api/i18n/languages` | Lista idiomas disponíveis |
| POST | `/api/i18n/language` | Define idioma do usuário |

### 20.6 Detecção de Idioma

| **Método** | **Prioridade** |
| :-- | :-- |
| Parâmetro `?lang=xx` | 1 (explicit override) |
| Header `Accept-Language` | 2 (browser) |
| Cookie `lang` | 3 (preferência salva) |
| Sessão do usuário | 4 (conta) |
| Padrão do sistema | 5 (fallback) |

### 20.7 Persistência de Preferência

- Salvar preferência no perfil do usuário (banco de dados)
- Armazenar em cookie local (30 dias)
- Sincronizar com JWT token

### 20.8 Conteúdo Estático

| **Conteúdo** | **Tratamento** |
| :-- | :-- |
| Landing page | Arquivos HTML por idioma (landing-pt.html, landing-en.html) |
| Mensagens de erro da API | Traduzidas via i18next |
| Labels de formulários | Traduzidas via i18next |
| Tooltips e help | Traduzidos via i18next |
| Dates e números | Formato local (Intl API) |

### 20.9 Diretrizes de Tradução

1. **Não traduzir nomes próprios** — Mantém "TRAMA-TAR", "Bruno Latour", etc.
2. **Manter consistência terminológica** — "Actante" sempre actant, nunca "ator"
3. **Usar traduzuções naturais** — Evitar tradução literal de expressões idiomáticas
4. **Testar com falantes nativos** — Revisão antes de liberar novo idioma

### 20.10 Status de Implementação | AZUL

**Implementado:**

- [x] Arquivos de tradução (pt-BR, en, es) com ~320 chaves cada
- [x] Biblioteca i18next integrada
- [x] Middleware Express para detecção de idioma
- [x] Endpoint GET `/api/i18n/languages` — Lista idiomas disponíveis
- [x] Endpoint POST `/api/i18n/language` — Define idioma via cookie
- [x] Parâmetro de query `?lang=xx` para overrides temporários
- [x] Validação de formulários com traduções

**Exemplo de Uso:**

```bash
# Listar idiomas disponíveis
curl http://localhost:3001/api/i18n/languages

# Definir idioma
curl -X POST http://localhost:3001/api/i18n/language -d '{"language":"en"}'

# Usar idioma específico na requisição
curl http://localhost:3001/api/health?lang=es
```

**Dependências Instaladas:**
- `i18next` — Core de internacionalização
- `cookie-parser` — Suporte a cookies

---

*Documento gerado em 2026-05-08*
*Versão 2.0 — Comparação com Modelo_SDD.md aplicada*
*Para a versão mais recente, consulte o repositório GitHub*