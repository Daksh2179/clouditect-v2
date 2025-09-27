const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const Redis = require('ioredis');
const fs = require('fs');
const path = require('path');

// Import region data
const regions = require('./models/regions');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4003;

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'provider-service.log' })
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
    // Handle different forms of the set command
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
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

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

// Provider information
const providers = {
  aws: {
    name: 'Amazon Web Services',
    description: 'Amazon Web Services (AWS) is a comprehensive cloud computing platform provided by Amazon.',
    regions: regions.aws,
    services: {
      compute: {
        name: 'EC2',
        description: 'Elastic Compute Cloud (EC2) provides resizable compute capacity in the cloud.'
      },
      storage: {
        object: {
          name: 'S3',
          description: 'Simple Storage Service (S3) provides object storage through a web service interface.'
        },
        block: {
          name: 'EBS',
          description: 'Elastic Block Store (EBS) provides persistent block storage volumes for EC2 instances.'
        }
      },
      database: {
        relational: {
          name: 'RDS',
          description: 'Relational Database Service (RDS) makes it easy to set up, operate, and scale a relational database in the cloud.'
        },
        nosql: {
          name: 'DynamoDB',
          description: 'DynamoDB is a key-value and document database that delivers single-digit millisecond performance at any scale.'
        }
      }
    }
  },
  azure: {
    name: 'Microsoft Azure',
    description: 'Microsoft Azure is a cloud computing service created by Microsoft for building, testing, deploying, and managing applications and services.',
    regions: regions.azure,
    services: {
      compute: {
        name: 'Virtual Machines',
        description: 'Azure Virtual Machines provides on-demand, scalable computing resources.'
      },
      storage: {
        object: {
          name: 'Blob Storage',
          description: 'Azure Blob Storage is Microsoft\'s object storage solution for the cloud.'
        },
        block: {
          name: 'Managed Disks',
          description: 'Azure Managed Disks are block-level storage volumes that are managed by Azure.'
        }
      },
      database: {
        relational: {
          name: 'Azure SQL',
          description: 'Azure SQL Database is a fully managed relational database with built-in intelligence.'
        },
        nosql: {
          name: 'Cosmos DB',
          description: 'Azure Cosmos DB is a globally distributed, multi-model database service.'
        }
      }
    }
  },
  gcp: {
    name: 'Google Cloud Platform',
    description: 'Google Cloud Platform (GCP) is a suite of cloud computing services that runs on the same infrastructure that Google uses internally.',
    regions: regions.gcp,
    services: {
      compute: {
        name: 'Compute Engine',
        description: 'Google Compute Engine delivers virtual machines running in Google\'s data centers.'
      },
      storage: {
        object: {
          name: 'Cloud Storage',
          description: 'Google Cloud Storage is a RESTful online file storage web service for storing and accessing data on Google\'s infrastructure.'
        },
        block: {
          name: 'Persistent Disk',
          description: 'Persistent Disk is a durable network storage device that virtual machines can access like a physical disk.'
        }
      },
      database: {
        relational: {
          name: 'Cloud SQL',
          description: 'Cloud SQL is a fully-managed database service that makes it easy to set up, maintain, and administer relational databases on Google Cloud Platform.'
        },
        nosql: {
          name: 'Firestore',
          description: 'Cloud Firestore is a flexible, scalable database for mobile, web, and server development.'
        }
      }
    }
  },
  ibm: {
    name: 'IBM Cloud',
    description: 'IBM Cloud offers a wide range of services including compute, storage, networking, database, and AI, with particular strengths in hybrid cloud solutions and enterprise integration.',
    regions: regions.ibm,
    services: {
      compute: {
        name: 'Virtual Servers',
        description: 'IBM Virtual Servers provide flexible compute capacity with various profiles optimized for different workloads.'
      },
      storage: {
        object: {
          name: 'Cloud Object Storage',
          description: 'IBM Cloud Object Storage provides durable, cost-effective storage for unstructured data with built-in security and compliance.'
        },
        block: {
          name: 'Block Storage',
          description: 'IBM Block Storage offers persistent storage for virtual servers with customizable IOPS.'
        }
      },
      database: {
        relational: {
          name: 'Db2',
          description: 'IBM Db2 is a family of data management products, including database servers, developed by IBM.'
        },
        nosql: {
          name: 'Cloudant',
          description: 'IBM Cloudant is a fully managed, distributed database optimized for heavy workloads and fast-growing web and mobile apps.'
        }
      }
    }
  },
  oracle: {
    name: 'Oracle Cloud',
    description: 'Oracle Cloud provides a comprehensive suite of cloud applications, platform services, and engineered systems with a focus on database and enterprise applications.',
    regions: regions.oracle,
    services: {
      compute: {
        name: 'Compute',
        description: 'Oracle Cloud Compute offers scalable compute capacity with a choice of virtual machine shapes.'
      },
      storage: {
        object: {
          name: 'Object Storage',
          description: 'Oracle Object Storage is a scalable, secure, and durable solution for storing unstructured data.'
        },
        block: {
          name: 'Block Volume',
          description: 'Oracle Block Volume provides persistent block storage for virtual machines with customizable performance.'
        }
      },
      database: {
        relational: {
          name: 'Autonomous Database',
          description: 'Oracle Autonomous Database is a self-driving, self-securing, and self-repairing database service.'
        },
        nosql: {
          name: 'NoSQL Database',
          description: 'Oracle NoSQL Database Cloud Service is a serverless, fully managed NoSQL database.'
        }
      }
    }
  },
  alibaba: {
    name: 'Alibaba Cloud',
    description: 'Alibaba Cloud, also known as Aliyun, offers a suite of cloud computing services globally, with particular strength in Asia Pacific regions and e-commerce solutions.',
    regions: regions.alibaba,
    services: {
      compute: {
        name: 'Elastic Compute Service',
        description: 'Alibaba ECS provides secure, reliable, and high-performance compute in the cloud.'
      },
      storage: {
        object: {
          name: 'Object Storage Service',
          description: 'Alibaba OSS is a secure, cost-effective, and scalable cloud storage service.'
        },
        block: {
          name: 'Disk Storage',
          description: 'Alibaba Disk Storage offers persistent block-level storage for ECS instances.'
        }
      },
      database: {
        relational: {
          name: 'ApsaraDB for RDS',
          description: 'Alibaba RDS is a stable, reliable, and scalable online database service.'
        },
        nosql: {
          name: 'Table Store',
          description: 'Alibaba Table Store is a fully managed NoSQL database service for storage and retrieval of massive structured data.'
        }
      }
    }
  }
};

// Service mappings across providers
const serviceMappings = {
  compute: {
    aws: 'EC2',
    azure: 'Virtual Machines',
    gcp: 'Compute Engine',
    description: 'Virtual machines and compute resources'
  },
  object_storage: {
    aws: 'S3',
    azure: 'Blob Storage',
    gcp: 'Cloud Storage',
    description: 'Object storage for files and unstructured data'
  },
  block_storage: {
    aws: 'EBS',
    azure: 'Managed Disks',
    gcp: 'Persistent Disk',
    description: 'Block storage for virtual machines'
  },
  relational_database: {
    aws: 'RDS',
    azure: 'Azure SQL',
    gcp: 'Cloud SQL',
    description: 'Managed relational database services'
  },
  nosql_database: {
    aws: 'DynamoDB',
    azure: 'Cosmos DB',
    gcp: 'Firestore',
    description: 'NoSQL database services'
  },
  load_balancing: {
    aws: 'ELB',
    azure: 'Load Balancer',
    gcp: 'Cloud Load Balancing',
    description: 'Distribute incoming network traffic'
  },
  cdn: {
    aws: 'CloudFront',
    azure: 'CDN',
    gcp: 'Cloud CDN',
    description: 'Content delivery network'
  },
  container_orchestration: {
    aws: 'EKS',
    azure: 'AKS',
    gcp: 'GKE',
    description: 'Managed Kubernetes services'
  }
};

// Instance type mappings
const instanceMappings = {
  // Small instances (1-2 vCPU, 2-4 GB RAM)
  small: {
    aws: ['t2.small', 't3.small', 't3a.small'],
    azure: ['B1ms', 'B2s', 'D2s_v3'],
    gcp: ['e2-small', 'e2-medium', 'n1-standard-1']
  },
  // Medium instances (2-4 vCPU, 4-8 GB RAM)
  medium: {
    aws: ['t3.medium', 'm5.large', 'c5.large'],
    azure: ['B2ms', 'D2s_v3', 'D2as_v4'],
    gcp: ['e2-standard-2', 'n1-standard-2', 'c2-standard-4']
  },
  // Large instances (4-8 vCPU, 16-32 GB RAM)
  large: {
    aws: ['m5.xlarge', 'c5.xlarge', 'r5.large'],
    azure: ['D4s_v3', 'E2s_v3', 'F4s_v2'],
    gcp: ['e2-standard-4', 'n1-standard-4', 'n2-standard-4']
  },
  // Extra large instances (8+ vCPU, 32+ GB RAM)
  xlarge: {
    aws: ['m5.2xlarge', 'c5.2xlarge', 'r5.xlarge'],
    azure: ['D8s_v3', 'E4s_v3', 'F8s_v2'],
    gcp: ['e2-standard-8', 'n1-standard-8', 'n2-standard-8']
  }
};

// Define routes
app.get('/', (req, res) => {
  res.status(200).send('Provider service is up and running.');
});
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// List all providers
app.get('/list', async (req, res) => {
  try {
    // Check cache first
    const cacheKey = 'providers:list';
    const cachedResult = await redis.get(cacheKey);
    
    if (cachedResult) {
      logger.info({
        requestId: req.requestId,
        message: 'Returning cached provider list'
      });
      
      return res.json(JSON.parse(cachedResult));
    }
    
    // Prepare provider list
    const providerList = Object.keys(providers).map(id => ({
      id,
      name: providers[id].name,
      description: providers[id].description
    }));
    
    // Cache result for 24 hours
    await redis.set(cacheKey, JSON.stringify(providerList), 'EX', 86400);
    
    res.json(providerList);
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ error: 'Error retrieving provider list' });
  }
});

// Get provider details
app.get('/provider/:id', async (req, res) => {
  try {
    const providerId = req.params.id;
    
    if (!providers[providerId]) {
      return res.status(404).json({ error: `Provider ${providerId} not found` });
    }
    
    // Check cache first
    const cacheKey = `provider:${providerId}`;
    const cachedResult = await redis.get(cacheKey);
    
    if (cachedResult) {
      logger.info({
        requestId: req.requestId,
        message: `Returning cached provider details for ${providerId}`
      });
      
      return res.json(JSON.parse(cachedResult));
    }
    
    // Get provider details
    const providerDetails = {
      id: providerId,
      ...providers[providerId]
    };
    
    // Cache result for 24 hours
    await redis.set(cacheKey, JSON.stringify(providerDetails), 'EX', 86400);
    
    res.json(providerDetails);
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ error: 'Error retrieving provider details' });
  }
});

// List all regions for a provider
app.get('/provider/:id/regions', async (req, res) => {
  try {
    const providerId = req.params.id;
    
    if (!providers[providerId]) {
      return res.status(404).json({ error: `Provider ${providerId} not found` });
    }
    
    // Check cache first
    const cacheKey = `provider:${providerId}:regions`;
    const cachedResult = await redis.get(cacheKey);
    
    if (cachedResult) {
      logger.info({
        requestId: req.requestId,
        message: `Returning cached regions for ${providerId}`
      });
      
      return res.json(JSON.parse(cachedResult));
    }
    
    // Get regions for the provider
    const regions = providers[providerId].regions;
    
    // Cache result for 24 hours
    await redis.set(cacheKey, JSON.stringify(regions), 'EX', 86400);
    
    res.json(regions);
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ error: 'Error retrieving regions' });
  }
});

// Get service mappings
app.get('/service-mappings', async (req, res) => {
  try {
    // Check cache first
    const cacheKey = 'service-mappings';
    const cachedResult = await redis.get(cacheKey);
    
    if (cachedResult) {
      logger.info({
        requestId: req.requestId,
        message: 'Returning cached service mappings'
      });
      
      return res.json(JSON.parse(cachedResult));
    }
    
    // Cache result for 24 hours
    await redis.set(cacheKey, JSON.stringify(serviceMappings), 'EX', 86400);
    
    res.json(serviceMappings);
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ error: 'Error retrieving service mappings' });
  }
});

// Get instance type mappings
app.get('/instance-mappings', async (req, res) => {
  try {
    // Check cache first
    const cacheKey = 'instance-mappings';
    const cachedResult = await redis.get(cacheKey);
    
    if (cachedResult) {
      logger.info({
        requestId: req.requestId,
        message: 'Returning cached instance mappings'
      });
      
      return res.json(JSON.parse(cachedResult));
    }
    
    // Cache result for 24 hours
    await redis.set(cacheKey, JSON.stringify(instanceMappings), 'EX', 86400);
    
    res.json(instanceMappings);
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ error: 'Error retrieving instance mappings' });
  }
});

// Get equivalent services across providers
app.get('/equivalent-services/:service', async (req, res) => {
  try {
    const serviceType = req.params.service;
    
    if (!serviceMappings[serviceType]) {
      return res.status(404).json({ error: `Service type ${serviceType} not found` });
    }
    
    // Check cache first
    const cacheKey = `equivalent-services:${serviceType}`;
    const cachedResult = await redis.get(cacheKey);
    
    if (cachedResult) {
      logger.info({
        requestId: req.requestId,
        message: `Returning cached equivalent services for ${serviceType}`
      });
      
      return res.json(JSON.parse(cachedResult));
    }
    
    // Get equivalent services
    const equivalentServices = serviceMappings[serviceType];
    
    // Cache result for 24 hours
    await redis.set(cacheKey, JSON.stringify(equivalentServices), 'EX', 86400);
    
    res.json(equivalentServices);
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ error: 'Error retrieving equivalent services' });
  }
});

// Get equivalent instance types
app.get('/equivalent-instances/:size', async (req, res) => {
  try {
    const size = req.params.size;
    
    if (!instanceMappings[size]) {
      return res.status(404).json({ error: `Instance size ${size} not found` });
    }
    
    // Check cache first
    const cacheKey = `equivalent-instances:${size}`;
    const cachedResult = await redis.get(cacheKey);
    
    if (cachedResult) {
      logger.info({
        requestId: req.requestId,
        message: `Returning cached equivalent instances for ${size}`
      });
      
      return res.json(JSON.parse(cachedResult));
    }
    
    // Get equivalent instance types
    const equivalentInstances = instanceMappings[size];
    
    // Cache result for 24 hours
    await redis.set(cacheKey, JSON.stringify(equivalentInstances), 'EX', 86400);
    
    res.json(equivalentInstances);
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ error: 'Error retrieving equivalent instances' });
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
  logger.info(`Provider Service listening on port ${PORT}`);
});

module.exports = app; // For testing