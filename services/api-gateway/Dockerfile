FROM node:16-alpine

WORKDIR /app

COPY services/api-gateway/package*.json ./
RUN npm install

COPY services/api-gateway/. .

EXPOSE 4000

CMD node index.js