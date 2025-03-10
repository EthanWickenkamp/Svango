FROM node:18

WORKDIR /app

#copy package list and npm install
COPY myapp/package*.json ./
RUN npm install

COPY . .

EXPOSE 5173
