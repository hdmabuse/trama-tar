FROM node:20-alpine
RUN apk add --no-cache python3 make g++
RUN addgroup -g 1001 -S trama && adduser -S -u 1001 -G trama trama
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
RUN npm rebuild better-sqlite3
COPY --chown=trama:trama . .
RUN mkdir -p /app/data && chown trama:trama /app/data
USER trama
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s CMD wget -qO- http://localhost:3000/api/health || exit 1
CMD ["node", "server/index.js"]
