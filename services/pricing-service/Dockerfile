FROM node:16-alpine

WORKDIR /app

COPY services/pricing-service/package*.json ./
RUN npm install

COPY services/pricing-service/. .

# Copy the shared pricing data from the project root into the container
COPY data/pricing ./data/

EXPOSE 4001

CMD ["node", "index.js"]