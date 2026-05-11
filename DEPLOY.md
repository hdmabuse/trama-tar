# Deploy no Droplet - Digital Ocean

## Informações do Servidor

- **IP**: 143.198.177.192
- **Projeto**: trama-tar
- **Stack**: Node.js 20 + Express + SQLite + Docker

---

## Passo a Passo

### 1. Acessar o droplet

```bash
ssh root@143.198.177.192
```

### 2. Instalar Docker (se não estiver instalado)

```bash
apt update && apt install -y docker.io docker-compose
systemctl enable docker
```

### 3. Criar diretório e clonar o repositório

```bash
mkdir -p /opt/trama-tar
cd /opt/trama-tar
git clone https://github.com/hdmabuse/trama-tar.git .
```

### 4. Criar arquivo `.env`

```bash
cp .env.example .env
nano .env
```

Editar com os valores reais:

```
NODE_ENV=production
PORT=3000
DB_PATH=./data/trama-tar.db
JWT_SECRET=gerar_uma_chave_secreta_segura_aqui
CORS_ORIGIN=https://seudominio.com  # ou IP do droplet
```

Para gerar JWT_SECRET:

```bash
openssl rand -base64 32
```

### 5. Build e iniciar o container

```bash
docker-compose up -d --build
```

### 6. Verificar status

```bash
docker-compose ps
docker-compose logs -f
```

### 7. Configurar Nginx como proxy reverso (recomendado)

```bash
apt install -y nginx
```

Criar config:

```bash
nano /etc/nginx/sites-available/trama-tar
```

```nginx
server {
    listen 80;
    server_name SEU_DOMINIO_OU_IP;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/trama-tar /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 8. SSL (opcional, com Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d seu-dominio.com
```

---

## Comandos úteis

```bash
# Reiniciar
docker-compose restart

# Parar
docker-compose down

# Ver logs
docker-compose logs -f

# Atualizar após mudanças no GitHub
git pull
docker-compose up -d --build
```

---

## Notas

- O container expose a porta 3001 no host (mapeada para 3000 no container)
- O banco de dados SQLite fica no volume `trama-data`
- O container reinicia automaticamente (`restart: unless-stopped`)