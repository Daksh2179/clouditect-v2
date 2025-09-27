FROM node:18-alpine

WORKDIR /app

# Copy and install dependencies
COPY services/pricing-service/package*.json ./
RUN npm ci --only=production

# Copy service code
COPY services/pricing-service/ .

EXPOSE 4001

# Use the format that works for you (no square brackets)
CMD node index.js