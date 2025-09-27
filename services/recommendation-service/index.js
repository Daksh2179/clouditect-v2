const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const Redis = require('ioredis');
const axios = require('axios');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4002;

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'recommendation-service.log' })
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

const PRICING_SERVICE_URL = process.env.PRICING_SERVICE_URL || 'http://localhost:4001';

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
  res.status(200).send('Recommendation service is up and running.');
});

const checkOverProvisioning = (workload) => {
  const recommendations = [];
  
  if (workload.compute) {
    for (const vm of workload.compute) {
      if (vm.size === 'large' && (vm.utilization || 0) < 50) {
        recommendations.push({
          type: 'compute',
          severity: 'high',
          description: 'Consider downsizing large instances with low utilization',
          saving_potential: '20-30%',
          resource: `${vm.size} instance (${vm.quantity} units)`,
          recommendation: 'Downsize to medium instances',
          action: 'resize',
          details: 'Large instances with less than 50% utilization are candidates for downsizing.'
        });
      }
      
      if ((vm.quantity || 1) > 3 && (vm.utilization || 0) < 30) {
        recommendations.push({
          type: 'compute',
          severity: 'medium',
          description: 'Consider reducing the number of instances',
          saving_potential: '15-25%',
          resource: `${vm.size} instance (${vm.quantity} units)`,
          recommendation: 'Reduce instance count',
          action: 'reduce',
          details: 'Multiple instances with low utilization suggest over-provisioning.'
        });
      }
    }
  }
  
  if (workload.storage) {
    for (const storage of workload.storage) {
      if (storage.type === 'premium' && !storage.critical) {
        recommendations.push({
          type: 'storage',
          severity: 'medium',
          description: 'Consider using standard storage for non-critical data',
          saving_potential: '40-60%',
          resource: `Premium storage (${storage.sizeGB} GB)`,
          recommendation: 'Switch to standard storage',
          action: 'change_type',
          details: 'Premium storage is costlier and best used for performance-critical workloads.'
        });
      }
      
      if ((storage.sizeGB || 0) > 1000 && (storage.utilization || 0) < 40) {
        recommendations.push({
          type: 'storage',
          severity: 'low',
          description: 'Consider reducing storage size',
          saving_potential: '10-20%',
          resource: `${storage.type} storage (${storage.sizeGB} GB)`,
          recommendation: 'Reduce allocated storage',
          action: 'resize',
          details: 'Large storage volumes with low utilization suggest over-provisioning.'
        });
      }
    }
  }
  
  if (workload.database) {
    for (const db of workload.database) {
      if (db.tier === 'high' && (db.utilization || 0) < 40) {
        recommendations.push({
          type: 'database',
          severity: 'high',
          description: 'Consider downsizing database tier',
          saving_potential: '30-50%',
          resource: `${db.type} database (${db.tier} tier)`,
          recommendation: 'Downgrade to standard tier',
          action: 'downgrade',
          details: 'High-tier databases with low utilization are candidates for downsizing.'
        });
      }
    }
  }
  
  return recommendations;
};

const recommendReservedInstances = (workload) => {
  const recommendations = [];
  
  if (workload.compute) {
    for (const vm of workload.compute) {
      if ((vm.hoursPerMonth || 0) > 700) {
        recommendations.push({
          type: 'compute',
          severity: 'high',
          description: 'Consider reserved instances for 24/7 workloads',
          saving_potential: '30-60%',
          resource: `${vm.size} instance (${vm.quantity} units)`,
          recommendation: 'Purchase 1-year or 3-year reserved instances',
          action: 'reserved_instance',
          details: 'Instances running 24/7 can benefit significantly from reserved instance pricing.'
        });
      }
      
      if ((vm.hoursPerMonth || 0) > 400 && (vm.hoursPerMonth || 0) <= 700) {
        recommendations.push({
          type: 'compute',
          severity: 'medium',
          description: 'Consider savings plans for predictable workloads',
          saving_potential: '20-40%',
          resource: `${vm.size} instance (${vm.quantity} units)`,
          recommendation: 'Purchase 1-year savings plan',
          action: 'savings_plan',
          details: 'Predictable but not 24/7 workloads can benefit from savings plans.'
        });
      }
    }
  }
  
  if (workload.database) {
    for (const db of workload.database) {
      if ((db.hoursPerMonth || 0) > 700) {
        recommendations.push({
          type: 'database',
          severity: 'high',
          description: 'Consider reserved instances for databases',
          saving_potential: '20-50%',
          resource: `${db.type} database`,
          recommendation: 'Purchase 1-year or 3-year reserved database instances',
          action: 'reserved_db',
          details: 'Databases running 24/7 can benefit significantly from reserved instance pricing.'
        });
      }
    }
  }
  
  return recommendations;
};

const recommendRegionOptimization = (workload, pricingData) => {
  const recommendations = [];
  
  if (pricingData) {
    const cheapestProvider = Object.keys(pricingData).reduce((a, b) => 
      pricingData[a].total < pricingData[b].total ? a : b
    );
    
    if (workload.region?.aws && workload.region.aws !== 'us-east-1' && pricingData.aws && pricingData.aws.total > 500) {
      recommendations.push({
        type: 'region',
        severity: 'medium',
        description: 'Consider using us-east-1 region for AWS resources',
        saving_potential: '5-15%',
        resource: 'AWS Region',
        recommendation: `Switch from ${workload.region.aws} to us-east-1`,
        action: 'change_region',
        details: 'The us-east-1 region often offers lower pricing compared to other regions.'
      });
    }
    
    if (workload.region?.azure && workload.region.azure !== 'eastus' && pricingData.azure && pricingData.azure.total > 500) {
      recommendations.push({
        type: 'region',
        severity: 'medium',
        description: 'Consider using eastus region for Azure resources',
        saving_potential: '5-15%',
        resource: 'Azure Region',
        recommendation: `Switch from ${workload.region.azure} to eastus`,
        action: 'change_region',
        details: 'The eastus region often offers lower pricing compared to other regions.'
      });
    }
    
    if (workload.region?.gcp && workload.region.gcp !== 'us-central1' && pricingData.gcp && pricingData.gcp.total > 500) {
      recommendations.push({
        type: 'region',
        severity: 'medium',
        description: 'Consider using us-central1 region for GCP resources',
        saving_potential: '5-15%',
        resource: 'GCP Region',
        recommendation: `Switch from ${workload.region.gcp} to us-central1`,
        action: 'change_region',
        details: 'The us-central1 region often offers lower pricing compared to other regions.'
      });
    }
    
    if (workload.region?.ibm && workload.region.ibm !== 'us-south' && pricingData.ibm && pricingData.ibm.total > 500) {
      recommendations.push({
        type: 'region',
        severity: 'medium',
        description: 'Consider using us-south region for IBM resources',
        saving_potential: '5-15%',
        resource: 'IBM Region',
        recommendation: `Switch from ${workload.region.ibm} to us-south`,
        action: 'change_region',
        details: 'The us-south (Dallas) region often offers the best pricing and lowest latency for IBM Cloud.'
      });
    }
    
    if (workload.region?.oracle && workload.region.oracle !== 'us-ashburn-1' && pricingData.oracle && pricingData.oracle.total > 500) {
      recommendations.push({
        type: 'region',
        severity: 'medium',
        description: 'Consider using us-ashburn-1 region for Oracle resources',
        saving_potential: '5-15%',
        resource: 'Oracle Region',
        recommendation: `Switch from ${workload.region.oracle} to us-ashburn-1`,
        action: 'change_region',
        details: 'The us-ashburn-1 region is Oracle\'s primary region and often offers the best pricing.'
      });
    }
    
    if (workload.region?.alibaba && workload.region.alibaba !== 'us-west-1' && pricingData.alibaba && pricingData.alibaba.total > 500) {
      recommendations.push({
        type: 'region',
        severity: 'medium',
        description: 'Consider using us-west-1 region for Alibaba resources',
        saving_potential: '5-15%',
        resource: 'Alibaba Region',
        recommendation: `Switch from ${workload.region.alibaba} to us-west-1`,
        action: 'change_region',
        details: 'For US-based workloads, the us-west-1 (Silicon Valley) region offers the best performance and pricing.'
      });
    }
    
    if (cheapestProvider && workload.preferred_provider && cheapestProvider !== workload.preferred_provider) {
      const savingPercentage = Math.round(
        (1 - pricingData[cheapestProvider].total / pricingData[workload.preferred_provider].total) * 100
      );
      
      if (savingPercentage > 15) {
        recommendations.push({
          type: 'provider',
          severity: 'high',
          description: `Consider switching from ${workload.preferred_provider.toUpperCase()} to ${cheapestProvider.toUpperCase()}`,
          saving_potential: `${savingPercentage}%`,
          resource: 'Cloud Provider',
          recommendation: `Migrate from ${workload.preferred_provider.toUpperCase()} to ${cheapestProvider.toUpperCase()}`,
          action: 'change_provider',
          details: `${cheapestProvider.toUpperCase()} offers significantly lower pricing for your workload.`
        });
      }
    }
  }
  
  return recommendations;
};

const recommendStorageOptimizations = (workload) => {
  const recommendations = [];
  
  if (workload.storage) {
    for (const storage of workload.storage) {
      if (storage.type === 'object' && (storage.sizeGB || 0) > 500) {
        recommendations.push({
          type: 'storage',
          severity: 'medium',
          description: 'Implement storage lifecycle policies',
          saving_potential: '10-30%',
          resource: `Object storage (${storage.sizeGB} GB)`,
          recommendation: 'Implement lifecycle policies to move older data to cheaper storage tiers',
          action: 'lifecycle_policy',
          details: 'Large object storage can benefit from lifecycle policies that move older data to cheaper storage classes.'
        });
      }
      
      if (storage.type === 'block' && (storage.sizeGB || 0) > 1000) {
        recommendations.push({
          type: 'storage',
          severity: 'low',
          description: 'Consider data tiering for large block storage',
          saving_potential: '15-25%',
          resource: `Block storage (${storage.sizeGB} GB)`,
          recommendation: 'Implement data tiering to move cold data to cheaper storage',
          action: 'data_tiering',
          details: 'Large block storage may contain cold data that can be moved to cheaper storage tiers.'
        });
      }
    }
  }
  
  return recommendations;
};

const providerSpecificRecommendations = (workload, pricingData) => {
  const recommendations = [];
  const preferredProvider = workload.preferred_provider || 'aws';
  
  if (preferredProvider === 'aws' && pricingData?.aws) {
    if (pricingData.aws.compute > 200) {
      recommendations.push({
        type: 'aws_specific',
        severity: 'high',
        description: 'Consider AWS Savings Plans for compute resources',
        saving_potential: '20-40%',
        resource: 'AWS Compute',
        recommendation: 'Purchase 1-year or 3-year Compute Savings Plans',
        action: 'savings_plan',
        details: 'AWS Compute Savings Plans provide flexibility across instance family, size, AZ, region, OS, and tenancy.'
      });
    }
    
    if (pricingData.aws.database > 150) {
      recommendations.push({
        type: 'aws_specific',
        severity: 'medium',
        description: 'Consider RDS Reserved Instances',
        saving_potential: '30-60%',
        resource: 'AWS RDS',
        recommendation: 'Purchase 1-year or 3-year RDS Reserved Instances',
        action: 'rds_ri',
        details: 'RDS Reserved Instances can provide significant savings for database instances running 24/7.'
      });
    }
  }
  
  if (preferredProvider === 'azure' && pricingData?.azure) {
    if (pricingData.azure.compute > 200) {
      recommendations.push({
        type: 'azure_specific',
        severity: 'high',
        description: 'Consider Azure Reserved VM Instances',
        saving_potential: '20-40%',
        resource: 'Azure VMs',
        recommendation: 'Purchase 1-year or 3-year Reserved VM Instances',
        action: 'azure_ri',
        details: 'Azure Reserved VM Instances provide significant savings for committed VM usage.'
      });
    }
    
    if (pricingData.azure.storage > 100) {
      recommendations.push({
        type: 'azure_specific',
        severity: 'medium',
        description: 'Consider Azure Storage Reserved Capacity',
        saving_potential: '15-35%',
        resource: 'Azure Storage',
        recommendation: 'Purchase Storage Reserved Capacity',
        action: 'azure_storage_reserved',
        details: 'Reserved capacity for Azure Blob storage can provide significant savings for predictable storage needs.'
      });
    }
  }
  
  if (preferredProvider === 'gcp' && pricingData?.gcp) {
    if (pricingData.gcp.compute > 200) {
      recommendations.push({
        type: 'gcp_specific',
        severity: 'high',
        description: 'Consider GCP Committed Use Discounts',
        saving_potential: '25-55%',
        resource: 'GCP Compute',
        recommendation: 'Purchase 1-year or 3-year Committed Use Discounts',
        action: 'gcp_cud',
        details: 'GCP Committed Use Discounts provide significant savings for steady-state workloads.'
      });
    }
    
    if (workload.bigquery && workload.bigquery.length > 0) {
      recommendations.push({
        type: 'gcp_specific',
        severity: 'medium',
        description: 'Consider BigQuery capacity commitments',
        saving_potential: '20-40%',
        resource: 'BigQuery',
        recommendation: 'Purchase BigQuery capacity commitments',
        action: 'bigquery_commitment',
        details: 'BigQuery capacity commitments can reduce costs for predictable analytics workloads.'
      });
    }
  }
  
  if (preferredProvider === 'ibm' && pricingData?.ibm) {
    if (pricingData.ibm.compute > 200) {
      recommendations.push({
        type: 'ibm_specific',
        severity: 'high',
        description: 'Consider IBM Reserved Virtual Server Instances',
        saving_potential: '20-40%',
        resource: 'IBM Virtual Servers',
        recommendation: 'Purchase 1-year or 3-year Reserved Instances',
        action: 'ibm_reserved',
        details: 'IBM Reserved Virtual Server Instances provide significant savings for long-term workloads.'
      });
    }
    
    if (workload.database && workload.database.length > 0) {
      recommendations.push({
        type: 'ibm_specific',
        severity: 'medium',
        description: 'Consider IBM Cloud Pak for Data',
        saving_potential: '15-30%',
        resource: 'IBM Database Services',
        recommendation: 'Evaluate Cloud Pak for Data bundle',
        action: 'cloud_pak',
        details: 'IBM Cloud Pak for Data can provide bundled pricing for database, AI, and analytics services.'
      });
    }
  }
  
  if (preferredProvider === 'oracle' && pricingData?.oracle) {
    if (pricingData.oracle.compute > 150) {
      recommendations.push({
        type: 'oracle_specific',
        severity: 'high',
        description: 'Consider Oracle Universal Credits',
        saving_potential: '25-50%',
        resource: 'Oracle Cloud Services',
        recommendation: 'Purchase Pay-As-You-Go Universal Credits',
        action: 'oracle_credits',
        details: 'Oracle Universal Credits provide flexible discounts across all Oracle Cloud services.'
      });
    }
    
    if (workload.database && workload.database.length > 0) {
      recommendations.push({
        type: 'oracle_specific',
        severity: 'high',
        description: 'Consider Oracle BYOL (Bring Your Own License)',
        saving_potential: '40-60%',
        resource: 'Oracle Database',
        recommendation: 'Use existing Oracle Database licenses with BYOL model',
        action: 'oracle_byol',
        details: 'If you have existing Oracle Database licenses, using BYOL can dramatically reduce cloud costs.'
      });
    }
  }
  
  if (preferredProvider === 'alibaba' && pricingData?.alibaba) {
    if (pricingData.alibaba.compute > 150) {
      recommendations.push({
        type: 'alibaba_specific',
        severity: 'high',
        description: 'Consider Alibaba Cloud Reserved Instances',
        saving_potential: '20-45%',
        resource: 'Alibaba ECS',
        recommendation: 'Purchase 1-year or 3-year Reserved Instances',
        action: 'alibaba_reserved',
        details: 'Alibaba Cloud Reserved Instances provide significant discounts for long-term usage.'
      });
    }
    
    if (workload.networking && workload.networking.some(n => n.type === 'cdn')) {
      recommendations.push({
        type: 'alibaba_specific',
        severity: 'medium',
        description: 'Consider Alibaba CDN Resource Package',
        saving_potential: '15-30%',
        resource: 'Alibaba CDN',
        recommendation: 'Purchase CDN Traffic Package',
        action: 'alibaba_cdn_package',
        details: 'Alibaba Cloud CDN resource packages can reduce costs for predictable CDN traffic.'
      });
    }
  }
  
  return recommendations;
};

const generateRecommendations = async (workload) => {
  try {
    let pricingData = null;
    try {
      const pricingResponse = await axios.post(`${PRICING_SERVICE_URL}/calculate`, workload, {
        headers: { 'Content-Type': 'application/json' }
      });
      pricingData = pricingResponse.data;
    } catch (error) {
      logger.error(`Error fetching pricing data: ${error.message}`);
    }
    
    const overProvisioningRecs = checkOverProvisioning(workload);
    const reservedInstanceRecs = recommendReservedInstances(workload);
    const regionRecs = recommendRegionOptimization(workload, pricingData);
    const storageRecs = recommendStorageOptimizations(workload);
    const providerSpecificRecs = providerSpecificRecommendations(workload, pricingData);
    
    const allRecommendations = [
      ...overProvisioningRecs,
      ...reservedInstanceRecs,
      ...regionRecs,
      ...storageRecs,
      ...providerSpecificRecs
    ];

// START MODIFICATION
    if (workload.deploymentStrategy === 'multi-cloud') {
      allRecommendations.push({
        type: 'multi-cloud',
        severity: 'high',
        description: 'Optimize your multi-cloud strategy',
        saving_potential: '10-20%',
        resource: 'Multi-Cloud Workload',
        recommendation: 'Implement a multi-cloud management platform to streamline operations and reduce overhead.',
        action: 'multi-cloud-management',
        details: 'A multi-cloud management platform can provide a unified view of your resources, costs, and security policies across all your cloud providers.'
      });
    }

    if (workload.deploymentStrategy === 'multi-cloud') {
        let complexity = 0;
        let devHours = 0;
        workload.compute.forEach(vm => {
            complexity += (vm.quantity || 1);
            devHours += (vm.quantity || 1) * 8;
        });
        allRecommendations.push({
            type: 'migration',
            severity: 'medium',
            description: 'Migration Complexity and Developer Hours Estimate',
            saving_potential: 'N/A',
            resource: 'Multi-Cloud Migration',
            recommendation: `Estimated migration complexity is ${complexity} units with approximately ${devHours} developer hours.`,
            action: 'migration-planning',
            details: 'This is a high-level estimate based on the number of compute resources. A detailed migration plan is recommended.'
        });
    }
// END MODIFICATION
    
    allRecommendations.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
    
    let totalMonthlyCost = 0;
    let potentialSavings = 0;
    
    if (pricingData) {
      const preferredProvider = workload.preferred_provider || 'aws';
      totalMonthlyCost = pricingData[preferredProvider]?.total || 0;
      
      for (const rec of allRecommendations) {
        if (!rec.saving_potential || rec.saving_potential === 'N/A') continue;
        const savingRange = rec.saving_potential.replace('%', '').split('-');
        const avgSavingPercentage = (parseInt(savingRange[0]) + parseInt(savingRange[1])) / 200;
        
        let affectedPortion = 0;
        
        switch (rec.type) {
          case 'compute':
            affectedPortion = pricingData[preferredProvider]?.compute / totalMonthlyCost || 0.4;
            break;
          case 'storage':
            affectedPortion = pricingData[preferredProvider]?.storage / totalMonthlyCost || 0.2;
            break;
          case 'database':
            affectedPortion = pricingData[preferredProvider]?.database / totalMonthlyCost || 0.2;
            break;
          case 'region':
          case 'provider':
            affectedPortion = 1;
            break;
          case 'aws_specific':
          case 'azure_specific':
          case 'gcp_specific':
          case 'ibm_specific':
          case 'oracle_specific':
          case 'alibaba_specific':
            if (rec.action.includes('compute') || rec.action.includes('reserved')) {
              affectedPortion = pricingData[preferredProvider]?.compute / totalMonthlyCost || 0.4;
            } else if (rec.action.includes('storage')) {
              affectedPortion = pricingData[preferredProvider]?.storage / totalMonthlyCost || 0.2;
            } else if (rec.action.includes('database') || rec.action.includes('db')) {
              affectedPortion = pricingData[preferredProvider]?.database / totalMonthlyCost || 0.2;
            } else {
              affectedPortion = 0.5;
            }
            break;
          default:
            affectedPortion = 0.2;
        }
        
        if (rec.resource.includes('instance')) {
          const instanceCount = workload.compute ? workload.compute.reduce((sum, vm) => sum + (vm.quantity || 1), 0) : 1;
          affectedPortion = (pricingData[preferredProvider]?.compute / totalMonthlyCost || 0.4) / instanceCount;
        }
        
        potentialSavings += totalMonthlyCost * affectedPortion * avgSavingPercentage;
      }
    }
    
    return {
      recommendations: allRecommendations,
      summary: {
        total_recommendations: allRecommendations.length,
        high_priority: allRecommendations.filter(r => r.severity === 'high').length,
        medium_priority: allRecommendations.filter(r => r.severity === 'medium').length,
        low_priority: allRecommendations.filter(r => r.severity === 'low').length,
        estimated_monthly_savings: Math.round(potentialSavings * 100) / 100,
        current_monthly_cost: Math.round(totalMonthlyCost * 100) / 100,
        savings_percentage: totalMonthlyCost > 0 ? Math.round((potentialSavings / totalMonthlyCost) * 100) : 0
      }
    };
  } catch (error) {
    logger.error(`Error generating recommendations: ${error.message}`);
    throw error;
  }
};

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.post('/generate', async (req, res) => {
  try {
    const workload = req.body;
    
    if (!workload) {
      return res.status(400).json({ error: 'Workload configuration is required' });
    }
    
    const cacheKey = `recommendations:${JSON.stringify(workload)}`;
    const cachedResult = await redis.get(cacheKey);
    
    if (cachedResult) {
      logger.info({
        requestId: req.requestId,
        message: 'Returning cached recommendations'
      });
      
      return res.json(JSON.parse(cachedResult));
    }
    
    const recommendations = await generateRecommendations(workload);
    
    await redis.set(cacheKey, JSON.stringify(recommendations), 'EX', 3600);
    
    res.json(recommendations);
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ error: 'Error generating recommendations' });
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
  logger.info(`Recommendation Service listening on port ${PORT}`);
});

module.exports = app;