FROM node:18

WORKDIR /app

COPY myapp/package*.json ./
RUN npm ci

COPY myapp/. ./

RUN npm run prepare && npm run build
RUN npm prune --omit=dev
