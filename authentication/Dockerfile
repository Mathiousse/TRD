# authentication/Dockerfile
FROM node:18.18.2-alpine

WORKDIR /app

# Ajouter les dépendances système complètes
RUN apk add --no-cache --virtual .build-deps \
    python3 \
    make \
    g++ \
    git \
    openssh-client

COPY package*.json ./
RUN npm install --production
RUN apk del .build-deps  # Nettoyer les dépendances de build

COPY . .

EXPOSE 3000
CMD ["node", "src/index.js"]