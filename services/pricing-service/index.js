const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const Redis = require('ioredis');
const pricingService = require('./services/pricingService');
// Import the pricing models directly, which is the robust way to load data
const localComputePricing = require('./models/awsComputePricing');

const app = express();
const PORT = process.env.PORT || 4001;

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
      expiryTime = Date.now() + (3600 * 1000);
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

app.use(helmet());
app.use(cors());
app.use(express.json());

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

app.get('/', (req, res) => {
  res.status(200).send('Pricing service is up and running.');
});

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

// Rewritten /instances route to be robust
app.get('/instances', (req, res) => {
  try {
    const provider = req.query.provider;
    const region = req.query.region;
    
    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' });
    }
    
    const pricingData = localComputePricing;
    
    if (!pricingData[provider]) {
      return res.status(404).json({ error: `Provider ${provider} not found` });
    }
    
    if (region && !pricingData[provider][region]) {
      return res.status(404).json({ error: `Region ${region} not found for provider ${provider}` });
    }
    
    const regionData = region ? 
      { [region]: pricingData[provider][region] } : 
      pricingData[provider];
    
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

app.listen(PORT, () => {
  logger.info(`Pricing Service listening on port ${PORT}`);
});

module.exports = app;