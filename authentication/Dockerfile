FROM node:18.18.2-alpine

WORKDIR /app

# Installer les dépendances système pour les modules natifs (ex: bcrypt)
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000
CMD ["node", "src/index.js"]