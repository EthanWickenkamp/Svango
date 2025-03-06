FROM node:18

WORKDIR /app

COPY myapp/package*.json  myapp/package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5173
