FROM node:18-alpine

WORKDIR /app

COPY services/provider-service/package*.json ./
RUN npm install --production

COPY services/provider-service/ .

EXPOSE 4003

CMD node index.js