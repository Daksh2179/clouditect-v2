const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const winston = require('winston');
const axios = require('axios');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'api-gateway.log' })
  ]
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
  // Generate a unique request ID
  req.requestId = Date.now().toString(36) + Math.random().toString(36).substring(2);
  
  logger.info({
    requestId: req.requestId,
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  
  // Add request ID to response headers
  res.setHeader('X-Request-ID', req.requestId);
  next();
});

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Multi-Cloud Cost Analyzer API',
      version: '1.0.0',
      description: 'API for analyzing costs across multiple cloud providers'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ]
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Service URLs from environment variables
const PRICING_SERVICE_URL = process.env.PRICING_SERVICE_URL || 'http://localhost:4001';
const RECOMMENDATION_SERVICE_URL = process.env.RECOMMENDATION_SERVICE_URL || 'http://localhost:4002';
const PROVIDER_SERVICE_URL = process.env.PROVIDER_SERVICE_URL || 'http://localhost:4003';

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.status(200).send('API Gateway is operational.');
});


// Create routes directory and router files
const fs = require('fs');
if (!fs.existsSync('./routes')) {
  fs.mkdirSync('./routes');
}

// Routes
// Import provider routes
const providerRoutes = require('./routes/providerRoutes');
app.use('/api/providers', providerRoutes);

/**
 * @swagger
 * /api/pricing:
 *   post:
 *     summary: Calculate pricing across cloud providers
 *     tags: [Pricing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workload
 *             properties:
 *               workload:
 *                 type: object
 *     responses:
 *       200:
 *         description: Pricing calculation successful
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
app.post('/api/pricing', async (req, res) => {
  try {
    const workload = req.body;
    
    // Forward request to pricing service
    const response = await axios.post(`${PRICING_SERVICE_URL}/calculate`, workload, {
      headers: { 'X-Request-ID': req.requestId }
    });
    
    res.json(response.data);
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      error: error.message,
      stack: error.stack
    });
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(503).json({ error: 'Service unavailable' });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

/**
 * @swagger
 * /api/recommendations:
 *   post:
 *     summary: Get cost optimization recommendations
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Recommendations generated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
app.post('/api/recommendations', async (req, res) => {
  try {
    const workload = req.body;
    
    // Forward request to recommendation service
    const response = await axios.post(`${RECOMMENDATION_SERVICE_URL}/generate`, workload, {
      headers: { 'X-Request-ID': req.requestId }
    });
    
    res.json(response.data);
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      error: error.message,
      stack: error.stack
    });
    
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      res.status(503).json({ error: 'Service unavailable' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
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
  logger.info(`API Gateway listening on port ${PORT}`);
});

module.exports = app; // For testing