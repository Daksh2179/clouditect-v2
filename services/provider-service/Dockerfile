FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Copy the shared pricing data from the project root into the container
COPY ../../data/pricing ./data/

EXPOSE 4003

CMD ["node", "index.js"]