FROM node:16-alpine

WORKDIR /app

COPY services/recommendation-service/package*.json ./
RUN npm install

COPY services/recommendation-service/. .

EXPOSE 4002

CMD node index.js