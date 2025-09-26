const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const Redis = require('ioredis');
const fs = require('fs');
const path = require('path');
const { initializePricingData, loadPricingData } = require('./utils/initializePricingData');
const pricingService = require('./services/pricingService');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4001;

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'pricing-service.log' })
  ]
});

// Initialize Redis client
const memoryCache = {};
const redis = {
  get: async (key) => {
    const item = memoryCache[key];
    if (!item) return null;
    if (item.expiry < Date.now()) {
      delete memoryCache[key];
      return null;
    }
    return item.value;
  },
  set: async (key, value, mode, duration, ttl) => {
    let expiryTime = 0;
    if (mode === 'EX' && duration) {
      expiryTime = Date.now() + (duration * 1000);
    } else if (ttl) {
      expiryTime = Date.now() + ttl;
    } else {
      expiryTime = Date.now() + (3600 * 1000); // Default 1 hour
    }
    
    memoryCache[key] = {
      value,
      expiry: expiryTime
    };
    return 'OK';
  },
  del: async (key) => {
    delete memoryCache[key];
    return 1;
  }
};


// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || Date.now().toString(36) + Math.random().toString(36).substring(2);
  
  logger.info({
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
});


// Define routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.post('/calculate', async (req, res) => {
  try {
    const workload = req.body;
    
    if (!workload) {
      return res.status(400).json({ error: 'Workload configuration is required' });
    }
    
    const cacheKey = `pricing:${JSON.stringify(workload)}`;
    const cachedResult = await redis.get(cacheKey);
    
    if (cachedResult) {
      logger.info({
        requestId: req.requestId,
        message: 'Returning cached pricing result'
      });
      
      return res.json(JSON.parse(cachedResult));
    }
    
    const result = await pricingService.calculateWorkloadCost(workload);
    
    await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
    
    res.json(result);
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ error: 'Error calculating pricing' });
  }
});

app.get('/instances', (req, res) => {
  try {
    const provider = req.query.provider;
    const region = req.query.region;
    
    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' });
    }
    
    const pricingData = loadPricingData();
    
    if (!pricingData.compute[provider]) {
      return res.status(404).json({ error: `Provider ${provider} not found` });
    }
    
    if (region && !pricingData.compute[provider][region]) {
      return res.status(404).json({ error: `Region ${region} not found for provider ${provider}` });
    }
    
    const regionData = region ? 
      { [region]: pricingData.compute[provider][region] } : 
      pricingData.compute[provider];
    
    const instances = {};
    
    for (const [r, data] of Object.entries(regionData)) {
      instances[r] = Object.keys(data).map(instance => ({
        name: instance,
        ...data[instance]
      }));
    }
    
    res.json(instances);
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ error: 'Error retrieving instance types' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error({
    requestId: req.requestId,
    error: err.message,
    stack: err.stack
  });
  
  res.status(500).json({
    error: 'Internal server error',
    requestId: req.requestId
  });
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Pricing Service listening on port ${PORT}`);
});

module.exports = app;