# TRAMA-TAR — Especificação do Projeto

**Versão:** 1.0.0  
**Data:** 2026-05-08  
**License:** AGPL-3.0  
**Repositório:** github.com/trama-tar

---

## 1. Visão Geral do Projeto

### 1.1 Nome e Identidade

**Nome:** TRAMA-TAR  
**Nome Completo:** Plataforma de Mapeamento de Redes pela Teoria Ator-Rede  
**Tagline:** "Mapeiecontroversias, visualize redes, siga os actantes."

### 1.2 Propósito

O TRAMA-TAR é uma plataforma open source para pesquisadores mapearemcontroversias, redes sociais e relações sociotécnicas usando os princípios da Teoria Ator-Rede (ANT). A ferramenta permite documentar actantes heterogêneos (humanos, tecnologias, instituições, ideias), suas associações e traduzir as dinâmicas de poder e mediação em uma rede visualizável.

### 1.3 Problema que Resolve

Pesquisadores e mapeadores da tradição ANT frequentemente utilizam ferramentas genéricas (Gephi, Cytoscape, Miro) que:
- Não distinguem entre actantes humanos e não-humanos
- Não capturam conceitos como "plasma", "caixa preta", "tradução"
- Não preservam histórico de mudanças
- Exigem exportação/importação manual para análises

O TRAMA-TAR resolve isso oferecendo uma ferramenta nativa para mapeamento ANT com:
- Tipos específicos de entidades (actantes, actantes-plasma)
- Campos semânticos para mediação/tradução
- Preservação de versões de actantes
- Exportação para formatos acadêmicos

### 1.4 Usuários-Alvo

1. **Pesquisadores acadêmicos** — Mestrandos, doutores e professores usando ANT em teses e artigos
2. **Consultores de ciência e tecnologia** — Análises de redes sociotécnicas
3. **Mapeadores de controvérsias** — Journalists de dados, pesquisadores de STS
4. **Estudantes** — Disciplinas de metodologia qualitativa

### 1.5 Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js + Express |
| Banco de Dados | SQLite (better-sqlite3) |
| Autenticação | JWT + bcrypt |
| Frontend | Vanilla JS + D3.js |
| Servidor | Express static + API |
| Deploy | Docker / manual |

---

## 2. Arquitetura do Sistema

### 2.1 Visão de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Frontend)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Landing Page│  │  App (SPA)  │  │  API (AJAX/Fetch)   │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP/HTTPS (JSON)
                            │
┌─────────────────────────────────────────────────────────────┐
│                     Servidor (Node.js)                      │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Express API                          ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              ││
│  │  │  Auth    │  │  Redes   │  │ Actantes │              ││
│  │  │  Routes  │  │  Routes  │  │  Routes  │              ││
│  │  └──────────┘  └──────────┘  └──────────┘              ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │               Middleware (Auth, Validation)             ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                  Banco de Dados (SQLite)                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  mapeadores | redes | actantes | associacoes            ││
│  │  actante_versoes | caixas_pretas                        ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Estrutura de Diretórios

```
trama-tar/
├── server/
│   ├── index.js              # Entry point do Express
│   ├── config/
│   │   └── index.js          # Configurações centralizadas
│   ├── controllers/          # Lógica de negócio
│   │   ├── redeController.js
│   │   └── actanteController.js
│   ├── repositories/         # Queries SQL
│   │   ├── redeRepository.js
│   │   ├── actanteRepository.js
│   │   └── associacaoRepository.js
│   ├── routes/               # Rotas API
│   │   ├── auth.js
│   │   ├── redes.js
│   │   ├── actantes.js
│   │   └── exportacao.js
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   ├── validation.js     # Schema validation
│   │   ├── checkRede.js     # Validação de acesso à rede
│   │   └── schemas.js       # Schemas de validação
│   ├── utils/
│   │   ├── errors.js        # Classes de erro
│   │   └── parseHelpers.js  # Transformações de dados
│   └── db/
│       └── database.js      # Conexão SQLite
├── public/
│   ├── index.html          # App SPA
│   └── landing.html        # Landing page
├── db/
│   └── schema.sql          # Schema do banco
├── data/                   # Diretório do banco SQLite
├── package.json
├── .env
├── start.sh                # Script de inicialização
└── SPEC.md
```

### 2.3 Padrões de Código

**Convenções adotadas:**
- Classes PascalCase (NotFoundError, RedeRepository)
- Funções/métodos camelCase
- Arquivos lower-case com hífen (actante-controller.js)
- 2 espaços de indentação
- Sem ponto-e-vírgula no final de statements
- Async/await para operações assíncronas
- Use de constantes para valores mágicos

---

## 3. Funcionalidades

### 3.1 Módulos Principais

#### 3.1.1 Autenticação

**Features:**
- Registro de mapeador (nome, email, senha)
- Login com JWT (token válido 24h)
- Middleware de autenticação para rotas protegidas

**Endpoints:**
```
POST /api/auth/registro     - Criar conta
POST /api/auth/login        - Autenticar
GET  /api/auth/me          - Dados do usuário logado
```

**Validações:**
- Email válido (formato email)
- Senha mínimo 8 caracteres
- Email único no banco

#### 3.1.2 Redes (Projetos de Mapeamento)

**Features:**
- Criar rede com metadata (nome, inúmera, controvérsia, etc.)
- Listar redes do usuário
- Editar detalhes da rede
- Deletar rede (soft delete recomendado)

**Endpoints:**
```
GET    /api/redes                      - Listar todas
POST   /api/redes                      - Criar rede
GET    /api/redes/:id                  - Detalhes + actantes + associações
PATCH  /api/redes/:id                  - Atualizar
DELETE /api/redes/:id                  - Deletar
```

**Campos de Rede:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| nome | string | sim | Nome da rede/controvérsia |
| controversia | text | não | Descrição da controvérsia |
| materia_de_preocupacao | text | não | Matéria de preocupação central |
| perspectiva_mapeador | text | não | Posicionamento do pesquisador |
| escopo_temporal | string | não | Período temporal do mapeamento |
| escopo_espacial | string | não | Escopo geográfico |
| atividade_atual | number | não | Status de completude (0-100) |

#### 3.1.3 Actantes

**Features:**
- Criar actante com posição no canvas
- Listar actantes de uma rede
- Editar actante (preserva versão anterior)
- Soft-delete (muda status para "disperso")

**Endpoints:**
```
GET    /api/redes/:redeId/actantes     - Listar
POST   /api/redes/:redeId/actantes     - Criar
PATCH  /api/redes/:redeId/actantes/:id - Editar
DELETE /api/redes/:redeId/actantes/:id - Remover (soft)
```

**Campos de Actante:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| nome | string | sim | Nome/designação do actante |
| descricao | text | não | Descrição detalhada |
| tipo | string | não | humano, tecnologia, instituição, ideia, natureza |
| status | enum | não | em_formacao, estabilizado, contestado, disperso |
| no_plasma | boolean | não | É actante-plasma (não mapeado ainda) |
| pre_campo | boolean | não | Actante identificado antes do trabalho de campo |
| plasma_relacao_controversia | text | não | Como se relaciona com a controvérsia |
| tags | JSON | não | Array de tags |
| modos_agencia | JSON | não | Modos de agência do actante |
| fonte | string | não | Fonte da informação |
| pos_x | number | não | Posição X no canvas |
| pos_y | number | não | Posição Y no canvas |
| distribuido | boolean | não | Actante distribuído geograficamente |

#### 3.1.4 Associações (Relações entre Actantes)

**Features:**
- Criar associação entre dois actantes
- Editar associação
- Deletar associação (hard delete)

**Endpoints:**
```
GET    /api/redes/:redeId/associacoes     - Listar
POST   /api/redes/:redeId/associacoes     - Criar
PATCH  /api/redes/:redeId/associacoes/:id - Editar
DELETE /api/redes/:redeId/associacoes/:id - Deletar
```

**Campos de Associação:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| origem_id | uuid | sim | ID do actante de origem |
| destino_id | uuid | sim | ID do actante de destino |
| modo_acao | enum | sim | mediador, intermediario |
| direcao | enum | não | unidirecional, bidirecional |
| intensidade | number | não | 1-5 (força da relação) |
| descricao_traducao | text | não | Descrição da tradução/mediação |
| status | enum | não | ativa, historica, contestada |
| fonte | string | não | Fonte da informação |
| no_plasma | boolean | não | Associação no domínio do plasma |
| criterio_confirmacao | text | não | Critério de confirmação |

#### 3.1.5 Caixa Preta

**Features:**
- Armazenar notas de actantes estabilizados (caixa preta)
-	Listar caixas pretas de uma rede

**Campos:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| nome | string | Nome/designação |
| descricao | text | Descrição da caixa preta |
| rede_id | uuid | Referência à rede |

#### 3.1.6 Exportação

**Features:**
- Exportar rede em formato JSON (para backup)
- Exportar em formato GraphML (para Gephi/Cytoscape)
- Exportar planilha (CSV)

**Endpoints:**
```
GET /api/redes/:redeId/exportacao/json
GET /api/redes/:redeId/exportacao/graphml
GET /api/redes/:redeId/exportacao/csv
```

### 3.2 Fluxo de Uso

```
1. Usuário acessa /
   └── Vê landing page sobre ANT e TRAMA-TAR

2. Usuário clica "Acessar Plataforma" (/app)
   └── Se não autenticado, vê tela de login/registro

3. Usuário cria conta ou faz login
   └── Recebe JWT armazenado em localStorage

4. Usuário cria primeira rede
   └── Define nome, controvérsia, escopo

5. Usuário adiciona actantes
   └── Posiciona no canvas
   └── Define tipo, status, relações

6. Usuário cria associações
   └── Liga actantes
   └── Define modo de ação (mediador/intermediario)

7. Usuário exporta dados
   └── Compartilha ou analisa em ferramentas externas
```

### 3.3 Casos Especiais

1. **Actantes-plasma** — Actantes marcados `no_plasma=true` aparecem em destaque visual distinto (cor diferente), indicando que estão no domínio do não-representado.

2. **Contestação** — Actantes ou associações com `status=contestado` indicam elementos controversial ou instáveis na rede.

3. **Histórico de Mudanças** — Cada update de actante cria registro em `actante_versoes` com campos anteriores, usuário e justificativa.

4. **Soft Delete** — Ao deletar actante, status muda para "disperso" e associações relacionadas viram "históricas".

---

## 4. Modelo de Dados

### 4.1 Schema SQL

```sql
-- Mapeadores (usuários)
CREATE TABLE mapeadores (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  ultimo_acesso DATETIME
);

-- Redes (projetos)
CREATE TABLE redes (
  id TEXT PRIMARY KEY,
  mapeador_id TEXT NOT NULL REFERENCES mapeadores(id),
  nome TEXT NOT NULL,
  controversia TEXT,
  materia_de_preocupacao TEXT,
  perspectiva_mapeador TEXT,
  escopo_temporal TEXT,
  escopo_espacial TEXT,
  atividade_atual INTEGER DEFAULT 0,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Actantes
CREATE TABLE actantes (
  id TEXT PRIMARY KEY,
  rede_id TEXT NOT NULL REFERENCES redes(id),
  nome TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT DEFAULT 'humano',
  tags TEXT,  -- JSON
  modos_agencia TEXT,  -- JSON
  status TEXT DEFAULT 'em_formacao',
  no_plasma INTEGER DEFAULT 0,
  pre_campo INTEGER DEFAULT 0,
  plasma_relacao_controversia TEXT,
  registrado_por TEXT REFERENCES mapeadores(id),
  fonte TEXT DEFAULT 'observacao_campo',
  pos_x REAL DEFAULT 0,
  pos_y REAL DEFAULT 0,
  distribuido INTEGER DEFAULT 0,
  registrado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Associações
CREATE TABLE associacoes (
  id TEXT PRIMARY KEY,
  rede_id TEXT NOT NULL REFERENCES redes(id),
  origem_id TEXT NOT NULL REFERENCES actantes(id),
  destino_id TEXT NOT NULL REFERENCES actantes(id),
  modo_acao TEXT,  -- mediador, intermediario
  direcao TEXT DEFAULT 'unidirecional',
  intensidade INTEGER DEFAULT 3,
  descricao_traducao TEXT,
  status TEXT DEFAULT 'ativa',
  fonte TEXT DEFAULT 'observacao_campo',
  posicao_contestacao TEXT,
  no_plasma INTEGER DEFAULT 0,
  criterio_confirmacao TEXT,
  registrado_por TEXT REFERENCES mapeadores(id),
  registrado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Histórico de versões de actantes
CREATE TABLE actante_versoes (
  id TEXT PRIMARY KEY,
  actante_id TEXT NOT NULL REFERENCES actantes(id),
  campos_anteriores TEXT NOT NULL,
  modificado_por TEXT REFERENCES mapeadores(id),
  justificativa TEXT,
  modificado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Caixas pretas
CREATE TABLE caixas_pretas (
  id TEXT PRIMARY KEY,
  rede_id TEXT NOT NULL REFERENCES redes(id),
  nome TEXT NOT NULL,
  descricao TEXT,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 Índices Recomendados

```sql
CREATE INDEX idx_actantes_rede ON actantes(rede_id);
CREATE INDEX idx_associacoes_rede ON associacoes(rede_id);
CREATE INDEX idx_redes_mapeador ON redes(mapeador_id);
CREATE INDEX idx_versoes_actante ON actante_versoes(actante_id);
```

---

## 5. API Reference

### 5.1 Headers

Todas as requests autenticadas devem incluir:
```
Authorization: Bearer <token_jwt>
```

### 5.2 Responses

**Sucesso (200-299):**
```json
{ "data": [...] }
```

**Erro (4xx-5xx):**
```json
{ "erro": "Mensagem de erro", "codigo": "ERROR_CODE" }
```

### 5.3 Endpoints Completos

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| GET | / | Não | Landing page |
| GET | /app | Não | App SPA |
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

## 6. Frontend

### 6.1 Páginas/Views

1. **Landing Page** (`/`)
   - Explicação sobre ANT
   - Conceitos-chave
   - Call-to-action para login/cadastro

2. **Login/Registro** (`/app`)
   - Formulário de autenticação
   - Alternância login/registro

3. **Dashboard** (`/app#dashboard`)
   - Lista de redes do usuário
   - Criar nova rede

4. **Editor de Rede** (`/app#rede/:id`)
   - Canvas D3.js central
   - Painel lateral de actantes
   - Painel de associações
   - Toolbar de ferramentas

### 6.2 Componentes UI

- **Canvas** — Área de visualização D3.js com zoom/pan
- **ActanteNode** — Círculo representando actante (cor varia por tipo/status)
- **AssociacaoEdge** — Linha/arced representando relação
- **Sidebar** — Painel lateral com lista de entidades
- **Modal** — Caixas de diálogo para criar/editar
- **Toolbar** — Botões de ação (adicionar, exportar, etc.)

### 6.3 Paleta de Cores

```css
:root {
  --bg: #060606;
  --panel: #0F0F0F;
  --panel2: #161616;
  --hover: #2A2A2A;
  --border: #383838;
  --border2: #2A2A2A;
  --amber: #F0A020;
  --amber-d: #B57818;
  --amber-bg: rgba(200,132,26,.08);
  --white: #FFFFFF;
  --gray-hi: #888;
  --gray-mid: #555;
  --gray-lo: #333;
  --red: #F05545;    /* Contestado */
  --green: #2ECC71;  /* Estabilizado */
  --blue-d: #2C3E50;
}
```

### 6.4 Tipos de Actantes (cores no canvas)

| Tipo | Cor |
|------|-----|
| humano | #F0A020 (amber) |
| tecnologia | #3498db (blue) |
| instituição | #9b59b6 (purple) |
| ideia | #1abc9c (teal) |
| natureza | #27ae60 (green) |
| plasma | #666 (cinza pontilhado) |

---

## 7. Segurança

### 7.1 Autenticação

- Senhas hasheadas com bcrypt (cost factor 12)
- JWT com expiração de 24h
- Secret em variável de ambiente

### 7.2 Rate Limiting

- Geral: 100 req/15min (produção), 1000 req/15min (dev)
- Auth: 10 req/15min (prevenção brute force)

### 7.3 Headers de Segurança

- Helmet.js enabled
- CORS configurável via .env

### 7.4 Validação

- Middleware de validação em todas as rotas POST/PATCH
- Sanitização de inputs
- Prepared statements para SQL (prevenção SQL injection)

---

## 8. Configuração

### 8.1 Variáveis de Ambiente

```env
NODE_ENV=production
PORT=3001
DB_PATH=./data/trama-tar.db
JWT_SECRET=sua_chave_secreta_aqui
CORS_ORIGIN=https://seudominio.com
```

### 8.2 Configurações via Código

Ver `server/config/index.js`:
- Rate limits
- Timeouts
- Paths
- Configurações de ambiente

---

## 9. Scripts Disponíveis

```bash
npm start      # Iniciar servidor (produção)
npm run dev    # Iniciar com nodemon (desenvolvimento)
```

---

## 10. Deploy

### 10.1 Docker (opcional)

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "3001:3001"
    volumes:
      - ./data:/app/data
    environment:
      - NODE_ENV=production
      - JWT_SECRET=...
```

### 10.2 Manual

```bash
# Instalar dependências
npm install

# Criar diretório de dados
mkdir -p data

# Iniciar
npm start
```

---

## 11. Contribuição

### 11.1 Como Contribuir

1. Fork do repositório
2. Criar branch (`git checkout -b feature/nova-feature`)
3. Commitar mudanças
4. Push para branch
5. Criar Pull Request

### 11.2 Estilo de Código

- ESLint configurado
- 2 espaços de indentação
- Sem ponto-e-vírgula
- camelCase para variáveis

---

## 12. Licença

**AGPL-3.0** — GNU Affero General Public License v3.0

Você é livre para:
- Usar para fins comerciais e pessoais
- Modificar o código
- Distribuir
- Usar privado

Requisitos:
- Disponibilizar código fonte de modificações
- Incluir licença e copyright

---

## 13. Roadmap

### v1.1 (Planejado)
- [ ] Importar rede de CSV/Excel
- [ ] Histórico de versões visualizado no UI
- [ ] Comentários em actantes

### v1.2 (Planejado)
- [ ] múltiplos layouts de visualização (force, radial, hierarchical)
- [ ] Filtros por tipo/status
- [ ] Modo de apresentação

### v2.0 (Futuro)
- [ ] Colaboração em tempo real (WebSocket)
- [ ] Versão mobile
- [ ] Plugin system para extensões

---

## 14. Glossário

| Termo | Definição |
|-------|-----------|
| Actante | Entidade que age e é afetada (humano, tecnologia, ideia) |
| Rede | Conjunto de actantes e suas associações |
| Tradução | Processo de mediação entre actantes |
| Mediador | Actante que transforma o que passa por ele |
| Plasma | Domínio do não-mapeado ainda |
| Caixa Preta | Rede estabilizada que funciona como unidade |
| Controvérsia | Issue social que divide actantes |

---

*Documento gerado em 2026-05-08*
*Para a versão mais recente, consulte o repositório GitHub*