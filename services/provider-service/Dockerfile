FROM node:18-alpine

WORKDIR /app

# Copy package files explicitly
COPY services/provider-service/package*.json ./
RUN npm ci --only=production


# Copy application code
COPY services/provider-service/ .

EXPOSE 4003

# Start the application
CMD node index.js