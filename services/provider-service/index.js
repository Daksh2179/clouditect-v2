const express = require('express');

const app = express();
const PORT = process.env.PORT || 4003;

// Basic middleware
app.use(express.json());

// Manual CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Simple logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Mock provider data
const providers = {
  aws: {
    name: 'Amazon Web Services',
    description: 'Comprehensive cloud computing platform',
    regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1']
  },
  azure: {
    name: 'Microsoft Azure',
    description: 'Cloud computing service for building and deploying applications',
    regions: ['East US', 'West US', 'North Europe', 'Southeast Asia']
  },
  gcp: {
    name: 'Google Cloud Platform',
    description: 'Suite of cloud computing services',
    regions: ['us-central1', 'us-west1', 'europe-west1', 'asia-southeast1']
  }
};

// Root endpoint
app.get('/', (req, res) => {
  console.log('Provider service root endpoint called');
  res.json({
    service: 'Provider Service',
    status: 'running',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  console.log('Provider service health check called');
  res.json({
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    memory: process.memoryUsage().rss,
    timestamp: new Date().toISOString()
  });
});

// List all providers
app.get('/list', (req, res) => {
  console.log('Get provider list called');
  try {
    const providerList = Object.keys(providers).map(id => ({
      id,
      name: providers[id].name,
      description: providers[id].description
    }));
    
    res.json(providerList);
  } catch (error) {
    console.error('Get provider list error:', error.message);
    res.status(500).json({ error: 'Error retrieving provider list' });
  }
});

// Get provider details
app.get('/provider/:id', (req, res) => {
  console.log(`Get provider details for ${req.params.id} called`);
  try {
    const providerId = req.params.id;
    
    if (!providers[providerId]) {
      return res.status(404).json({ error: `Provider ${providerId} not found` });
    }
    
    const providerDetails = {
      id: providerId,
      ...providers[providerId]
    };
    
    res.json(providerDetails);
  } catch (error) {
    console.error('Get provider details error:', error.message);
    res.status(500).json({ error: 'Error retrieving provider details' });
  }
});

// List regions for a provider
app.get('/provider/:id/regions', (req, res) => {
  console.log(`Get regions for ${req.params.id} called`);
  try {
    const providerId = req.params.id;
    
    if (!providers[providerId]) {
      return res.status(404).json({ error: `Provider ${providerId} not found` });
    }
    
    res.json({
      provider: providerId,
      regions: providers[providerId].regions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get regions error:', error.message);
    res.status(500).json({ error: 'Error retrieving regions' });
  }
});

// Service mappings
app.get('/service-mappings', (req, res) => {
  console.log('Get service mappings called');
  try {
    const serviceMappings = {
      compute: {
        aws: 'EC2',
        azure: 'Virtual Machines',
        gcp: 'Compute Engine',
        description: 'Virtual machines and compute resources'
      },
      storage: {
        aws: 'S3',
        azure: 'Blob Storage',
        gcp: 'Cloud Storage',
        description: 'Object storage services'
      },
      database: {
        aws: 'RDS',
        azure: 'Azure SQL',
        gcp: 'Cloud SQL',
        description: 'Managed database services'
      }
    };
    
    res.json(serviceMappings);
  } catch (error) {
    console.error('Get service mappings error:', error.message);
    res.status(500).json({ error: 'Error retrieving service mappings' });
  }
});

// Instance mappings
app.get('/instance-mappings', (req, res) => {
  console.log('Get instance mappings called');
  try {
    const instanceMappings = {
      small: {
        aws: ['t3.small', 't2.small'],
        azure: ['B1ms', 'B2s'],
        gcp: ['e2-small', 'n1-standard-1']
      },
      medium: {
        aws: ['t3.medium', 'm5.large'],
        azure: ['B2ms', 'D2s_v3'],
        gcp: ['e2-standard-2', 'n1-standard-2']
      },
      large: {
        aws: ['m5.xlarge', 'c5.xlarge'],
        azure: ['D4s_v3', 'E2s_v3'],
        gcp: ['e2-standard-4', 'n1-standard-4']
      }
    };
    
    res.json(instanceMappings);
  } catch (error) {
    console.error('Get instance mappings error:', error.message);
    res.status(500).json({ error: 'Error retrieving instance mappings' });
  }
});

// Catch all other routes
app.use('*', (req, res) => {
  console.log(`404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not found',
    path: req.originalUrl,
    available: ['/', '/health', '/list', '/provider/:id', '/provider/:id/regions', '/service-mappings', '/instance-mappings']
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
console.log(`Starting provider service on port ${PORT}...`);
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Provider Service successfully started on port ${PORT}`);
  console.log(`🏥 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`📊 Ready to serve requests`);
});

// Handle startup errors
server.on('error', (error) => {
  console.error('❌ Server startup error:', error.message);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Keep process alive
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;