# Como Instalar o TRAMA-TAR
## Guia para quem nunca instalou um servidor antes

> **O que é isso?** O TRAMA-TAR é um programa que roda no seu computador (ou num servidor na internet) e você acessa pelo navegador, como um site. Este guia explica como instalar do zero, sem experiência prévia.

---

## Parte 1 — Instalar no seu computador (uso pessoal)

### O que você vai precisar
- Um computador com Windows, macOS ou Linux
- Conexão com a internet
- Cerca de 15 minutos

---

### Passo 1 — Instalar o Node.js

O Node.js é o "motor" que faz o TRAMA-TAR funcionar. É gratuito e seguro.

**No Windows ou macOS:**
1. Acesse [nodejs.org](https://nodejs.org)
2. Clique no botão verde grande que diz **"LTS"** (versão recomendada)
3. Baixe e instale normalmente (Next, Next, Finish)

**No Ubuntu/Linux:**
Abra o Terminal e cole este comando:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verificar se funcionou:**
Abra o Terminal (ou Prompt de Comando no Windows) e digite:
```bash
node --version
```
Deve aparecer algo como `v20.x.x`. Se aparecer, está pronto.

---

### Passo 2 — Instalar o Git

O Git é usado para baixar o código do TRAMA-TAR.

**Windows:** Baixe em [git-scm.com](https://git-scm.com) e instale (pode deixar todas as opções padrão).

**macOS:** Abra o Terminal e digite `git --version`. Se não estiver instalado, o Mac vai perguntar se quer instalar — clique em Instalar.

**Ubuntu/Linux:**
```bash
sudo apt-get install -y git
```

---

### Passo 3 — Baixar o TRAMA-TAR

Abra o Terminal e escolha uma pasta onde quer instalar. Por exemplo, sua pasta de projetos:

```bash
# Navegar até sua pasta (mude o caminho se preferir outro lugar)
cd ~/Documentos

# Baixar o TRAMA-TAR do GitHub
git clone https://github.com/hdmabuse/trama-tar.git

# Entrar na pasta
cd trama-tar
```

---

### Passo 4 — Instalar as dependências

Dentro da pasta `trama-tar`, execute:

```bash
npm install
```

Vai aparecer bastante texto rolando na tela. Aguarde terminar (pode levar 1-3 minutos). No final vai aparecer algo como `added 162 packages`.

> ⚠️ **Se aparecer erro no Ubuntu/Linux:** Execute antes:
> ```bash
> sudo apt-get install -y python3 make g++
> npm install
> ```

---

### Passo 5 — Configurar o programa

```bash
# Copiar o arquivo de configuração
cp .env.example .env
```

Agora abra o arquivo `.env` num editor de texto simples (Bloco de Notas, TextEdit, gedit). Você vai ver algo assim:

```
NODE_ENV=production
PORT=3000
DB_PATH=./data/trama-tar.db
JWT_SECRET=SUBSTITUA_POR_SEGREDO_ALEATORIO_64_BYTES
CORS_ORIGIN=https://seudominio.com
```

**Mude apenas duas coisas:**

1. `NODE_ENV=production` → mude para `NODE_ENV=development`
2. `JWT_SECRET=SUBSTITUA...` → coloque qualquer sequência longa de letras e números. Por exemplo, execute este comando para gerar uma chave segura automaticamente:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado e cole depois do `JWT_SECRET=`.

Salve o arquivo.

---

### Passo 6 — Criar a pasta de dados

```bash
mkdir data
```

---

### Passo 7 — Iniciar o TRAMA-TAR

```bash
npm start
```

Você verá:

```
╔═══════════════════════════════════════╗
║  TRAMA-TAR v1.0 · development        ║
║  http://localhost:3000               ║
╚═══════════════════════════════════════╝
```

---

### Passo 8 — Acessar pelo navegador

Abra o Firefox ou Chrome e acesse:

```
http://localhost:3000
```

A tela de login do TRAMA-TAR vai aparecer. Crie sua conta e comece a usar!

---

### Para iniciar o TRAMA-TAR da próxima vez

Toda vez que quiser usar, abra o Terminal, navegue até a pasta e execute:

```bash
cd ~/Documentos/trama-tar
npm start
```

Depois acesse `http://localhost:3000` no navegador.

> 💡 **Dica:** Deixe o Terminal aberto enquanto usa o programa. Fechar o Terminal encerra o servidor.

---

### Seus dados ficam onde?

Tudo fica no arquivo `data/trama-tar.db` dentro da pasta do programa. Para fazer backup, simplesmente copie este arquivo para outro lugar.

---

---

## Parte 2 — Instalar num servidor VPS (acesso pela internet)

### O que é uma VPS?

Uma VPS (Virtual Private Server) é um computador que fica ligado 24 horas num datacenter. Você acessa ele pela internet, então o TRAMA-TAR fica disponível de qualquer lugar, sem precisar deixar seu computador ligado.

**Custo:** a partir de R$ 20-50/mês em serviços como DigitalOcean, Contabo, Hetzner, ou Hostgator.

### O que você vai precisar
- Uma VPS com Ubuntu 22.04 ou 24.04 (peça para o suporte do provedor se não souber como escolher)
- Um domínio (opcional mas recomendado, ex: `seusite.com.br`) — a partir de R$ 40/ano
- Acesso SSH à VPS (o provedor vai te enviar as credenciais por e-mail)

---

### Passo 1 — Conectar à VPS

No Terminal do seu computador:

```bash
ssh root@IP_DA_SUA_VPS
```

Substitua `IP_DA_SUA_VPS` pelo endereço IP que o provedor enviou. Digite a senha quando pedir.

> **Windows:** Se não tiver Terminal, instale o [PuTTY](https://putty.org) ou use o Windows Terminal.

---

### Passo 2 — Atualizar o sistema

Após conectar, execute:

```bash
apt-get update && apt-get upgrade -y
apt-get install -y curl git ufw
```

---

### Passo 3 — Criar um usuário (mais seguro que usar root)

```bash
adduser deploy
```

Vai pedir uma senha — crie uma senha segura e anote. Depois:

```bash
usermod -aG sudo deploy
su - deploy
```

Agora você está como o usuário `deploy`.

---

### Passo 4 — Instalar o Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs python3 make g++
```

---

### Passo 5 — Instalar o Docker (recomendado para VPS)

O Docker facilita muito a instalação e manutenção em servidores:

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

Faça logout e login novamente para aplicar:

```bash
exit
ssh deploy@IP_DA_SUA_VPS
```

---

### Passo 6 — Baixar o TRAMA-TAR

```bash
cd ~
git clone https://github.com/hdmabuse/trama-tar.git
cd trama-tar
```

---

### Passo 7 — Configurar

```bash
cp .env.example .env
nano .env
```

O `nano` é um editor de texto no Terminal. Configure assim:

```
NODE_ENV=production
PORT=3000
DB_PATH=/app/data/trama-tar.db
JWT_SECRET=COLE_AQUI_UMA_CHAVE_LONGA_E_ALEATORIA
CORS_ORIGIN=https://seudominio.com.br
```

Para gerar a chave:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Para salvar no nano: `Ctrl+O`, `Enter`, `Ctrl+X`.

---

### Passo 8 — Iniciar com Docker

```bash
docker compose build
docker compose up -d
```

O `-d` faz rodar em segundo plano. Para verificar se está funcionando:

```bash
docker compose ps
curl http://localhost:3000/api/health
```

Deve aparecer `{"status":"ok",...}`.

---

### Passo 9 — Instalar o Nginx (servidor web)

O Nginx vai receber as visitas da internet e encaminhar para o TRAMA-TAR:

```bash
sudo apt-get install -y nginx
```

Crie a configuração:

```bash
sudo nano /etc/nginx/sites-available/trama-tar
```

Cole este conteúdo (substituindo `seudominio.com.br` pelo seu domínio ou pelo IP da VPS):

```nginx
server {
    listen 80;
    server_name seudominio.com.br;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Salve (`Ctrl+O`, `Enter`, `Ctrl+X`) e ative:

```bash
sudo ln -s /etc/nginx/sites-available/trama-tar /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Agora acesse `http://IP_DA_SUA_VPS` no navegador — o TRAMA-TAR deve aparecer.

---

### Passo 10 — Adicionar SSL (cadeado HTTPS) — opcional mas recomendado

Se você tem um domínio apontando para o IP da VPS:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com.br
```

Siga as instruções na tela. Após concluir, o TRAMA-TAR estará disponível em `https://seudominio.com.br` com cadeado de segurança.

---

### Passo 11 — Configurar o firewall

```bash
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

### Manutenção no dia a dia

**Ver se está rodando:**
```bash
cd ~/trama-tar
docker compose ps
```

**Reiniciar:**
```bash
docker compose restart
```

**Ver logs (erros e acessos):**
```bash
docker compose logs -f
```

**Atualizar para nova versão:**
```bash
cd ~/trama-tar
git pull origin main
docker compose build
docker compose up -d
```

**Backup dos dados:**
```bash
docker exec trama-tar-app sqlite3 /app/data/trama-tar.db ".backup /tmp/backup.db"
docker cp trama-tar-app:/tmp/backup.db ~/backup-trama-$(date +%Y%m%d).db
```

---

## Perguntas frequentes

**Esqueci a senha da minha conta no TRAMA-TAR. O que faço?**
O TRAMA-TAR não tem recuperação de senha por design de segurança. Se for instalação local, apague o arquivo `data/trama-tar.db` e reinicie — isso apaga todos os dados e você cria uma nova conta. Se for VPS, acesse o servidor e execute `docker exec trama-tar-app rm /app/data/trama-tar.db && docker compose restart`.

**Posso usar no celular?**
Sim. O TRAMA-TAR funciona no navegador do celular. Se for instalação local, conecte o celular na mesma rede Wi-Fi e acesse `http://IP_DO_SEU_COMPUTADOR:3000`. Para descobrir o IP: `ip addr | grep 192`.

**Meus dados são seguros?**
Na instalação local, os dados ficam no seu computador e nunca saem dele. Na VPS, as senhas são armazenadas com criptografia forte (bcrypt) e os tokens de sessão usam JWT com validade de 24 horas.

**Posso usar sem internet?**
Na instalação local, sim — depois de instalado, funciona completamente offline. Na VPS, precisa de internet para acessar.

**Preciso de alguma habilidade de programação?**
Não. Seguindo este guia passo a passo, qualquer pessoa consegue instalar. Se travar em algum passo, verifique se copiou o comando exatamente como está, incluindo espaços e símbolos.

---

*TRAMA-TAR — sciencestudios.com.br*
