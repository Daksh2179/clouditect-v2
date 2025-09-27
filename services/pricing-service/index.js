const express = require('express');

const app = express();
const PORT = process.env.PORT || 4001;

// Basic middleware only
app.use(express.json());

// Enable CORS manually (no external package)
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

// Root endpoint
app.get('/', (req, res) => {
  console.log('Root endpoint called');
  res.status(200).json({
    service: 'Pricing Service',
    status: 'running',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  console.log('Health check called');
  res.status(200).json({
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    memory: process.memoryUsage().rss,
    timestamp: new Date().toISOString()
  });
});

// Basic pricing calculation
app.post('/calculate', (req, res) => {
  console.log('Calculate endpoint called');
  try {
    const workload = req.body || {};
    
    // Super simple calculation
    const instances = workload.instances || 1;
    const storage = workload.storage || 100;
    
    const result = {
      aws: {
        compute: instances * 73,
        storage: storage * 0.023,
        total: (instances * 73) + (storage * 0.023)
      },
      azure: {
        compute: instances * 88,
        storage: storage * 0.025,
        total: (instances * 88) + (storage * 0.025)
      },
      gcp: {
        compute: instances * 66,
        storage: storage * 0.020,
        total: (instances * 66) + (storage * 0.020)
      },
      timestamp: new Date().toISOString()
    };
    
    console.log(`Calculated pricing for ${instances} instances, ${storage}GB storage`);
    res.json(result);
  } catch (error) {
    console.error('Calculate error:', error.message);
    res.status(500).json({
      error: 'Calculation failed',
      message: error.message
    });
  }
});

// Basic instances endpoint
app.get('/instances', (req, res) => {
  console.log('Instances endpoint called');
  const { provider } = req.query;
  
  const data = {
    aws: [
      { name: 't3.micro', vcpu: 2, memory: 1, price: 0.0104 },
      { name: 't3.small', vcpu: 2, memory: 2, price: 0.0208 }
    ],
    azure: [
      { name: 'Standard_B1s', vcpu: 1, memory: 1, price: 0.0052 }
    ],
    gcp: [
      { name: 'n1-standard-1', vcpu: 1, memory: 3.75, price: 0.0475 }
    ]
  };
  
  if (provider && data[provider]) {
    res.json({ provider, instances: data[provider] });
  } else {
    res.json({ instances: data });
  }
});

// Catch all other routes
app.use('*', (req, res) => {
  console.log(`404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not found',
    path: req.originalUrl,
    available: ['/', '/health', 'POST /calculate', '/instances']
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
console.log(`Starting server on port ${PORT}...`);
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Pricing Service successfully started on port ${PORT}`);
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