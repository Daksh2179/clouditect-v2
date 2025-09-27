FROM node:16-alpine

WORKDIR /app

COPY services/provider-service/package*.json ./
RUN npm install

COPY services/provider-service/. .

# Copy the shared pricing data from the project root into the container
COPY data/pricing ./data/

EXPOSE 4003

CMD node index.js