// services/pricing-service/services/pricingService.js
const winston = require('winston');
const cloudPricingClient = require('../clients/cloudPricingClient');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

class PricingService {
  /**
   * Calculate compute costs for a specific provider, region, instance type, and quantity
   */
  async calculateComputeCost(provider, region, instanceType, quantity, hoursPerMonth) {
    try {
      const computePricing = await cloudPricingClient.getComputePricing(provider, region);
      
      if (!computePricing[instanceType]) {
        throw new Error(`Pricing data not available for instance type ${instanceType}`);
      }
      
      const instancePricing = computePricing[instanceType];
      
      const hourlyCost = instancePricing.hourly * quantity;
      const monthlyCost = hourlyCost * (hoursPerMonth || 730);
      
      return {
        provider,
        region,
        instanceType,
        quantity,
        hoursPerMonth: hoursPerMonth || 730,
        hourlyCost,
        monthlyCost,
        specs: {
          vcpu: instancePricing.vcpu,
          memory: instancePricing.memory
        }
      };
    } catch (error) {
      logger.error(`Error calculating compute cost: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Calculate storage cost for a specific provider, storage type, and size
   */
  async calculateStorageCost(provider, type, sizeGB) {
    try {
      const storagePricing = await cloudPricingClient.getStoragePricing(provider);
      
      if (!storagePricing[type]) {
        throw new Error(`Storage pricing data not available for ${provider} ${type}`);
      }
      
      const typeSpecificPricing = storagePricing[type];
      const monthlyCost = typeSpecificPricing.monthly_per_gb * sizeGB;
      
      return {
        provider,
        type,
        sizeGB,
        costPerGBPerMonth: typeSpecificPricing.monthly_per_gb,
        monthlyCost,
        details: typeSpecificPricing.details || {}
      };
    } catch (error) {
      logger.error(`Error calculating storage cost: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Calculate database cost for a specific provider, database type, and quantity
   */
  async calculateDatabaseCost(provider, type, quantity) {
    try {
      const databasePricing = await cloudPricingClient.getDatabasePricing(provider);
      
      if (!databasePricing[type]) {
        throw new Error(`Database pricing data not available for ${provider} ${type}`);
      }
      
      const dbPricing = databasePricing[type];
      let monthlyCost = 0;
      
      if (dbPricing.monthly) {
        monthlyCost = dbPricing.monthly * quantity;
      } else if (dbPricing.hourly) {
        monthlyCost = dbPricing.hourly * 730 * quantity;
      }
      
      return {
        provider,
        type,
        quantity,
        monthlyCost,
        details: dbPricing.details || {}
      };
    } catch (error) {
      logger.error(`Error calculating database cost: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Calculate total workload cost across all resources
   */
  async calculateWorkloadCost(workload) {
    try {
      const costs = {
        aws: { compute: 0, storage: 0, database: 0, total: 0, details: {} },
        azure: { compute: 0, storage: 0, database: 0, total: 0, details: {} },
        gcp: { compute: 0, storage: 0, database: 0, total: 0, details: {} },
        ibm: { compute: 0, storage: 0, database: 0, total: 0, details: {} },
        oracle: { compute: 0, storage: 0, database: 0, total: 0, details: {} },
        alibaba: { compute: 0, storage: 0, database: 0, total: 0, details: {} },
        digitalocean: { compute: 0, storage: 0, database: 0, total: 0, details: {} }
      };
      
      const regions = {
        aws: workload.region?.aws || 'us-east-1',
        azure: workload.region?.azure || 'eastus',
        gcp: workload.region?.gcp || 'us-central1',
        ibm: workload.region?.ibm || 'us-south',
        oracle: workload.region?.oracle || 'us-ashburn-1',
        alibaba: workload.region?.alibaba || 'us-west-1',
        digitalocean: workload.region?.digitalocean || 'nyc1'
      };
      
      Object.keys(costs).forEach(provider => {
        costs[provider].details.compute = [];
        costs[provider].details.storage = [];
        costs[provider].details.database = [];
      });
      
// START MODIFICATION
      if (workload.compute && workload.compute.length > 0) {
        const instanceMap = {
          small: { 
            aws: 't2.small', 
            azure: 'B1S', 
            gcp: 'e2-small',
            ibm: 'cx2-2x4',
            oracle: 'VM.Optimized3.Flex.2.4',
            alibaba: 'ecs.c6.large',
            digitalocean: 's-1vcpu-1gb'
          },
          medium: { 
            aws: 't2.medium', 
            azure: 'B2S', 
            gcp: 'e2-medium',
            ibm: 'bx2-2x8',
            oracle: 'VM.Standard.E3.Flex.2.8',
            alibaba: 'ecs.g6.large',
            digitalocean: 's-2vcpu-4gb'
          },
          large: { 
            aws: 'm5.large', 
            azure: 'D2s_v3', 
            gcp: 'n1-standard-2',
            ibm: 'bx2-4x16',
            oracle: 'VM.Standard.E3.Flex.4.16',
            alibaba: 'ecs.g6.xlarge',
            digitalocean: 's-4vcpu-8gb'
          }
        };
        
        for (const vm of workload.compute) {
          if (workload.deploymentStrategy === 'multi-cloud') {
            const provider = vm.provider || 'aws';
            const instance = vm[`${provider}_instance`] || instanceMap[vm.size][provider];
            const compute = await this.calculateComputeCost(provider, regions[provider], instance, vm.quantity, vm.hoursPerMonth);
            costs[provider].compute += compute.monthlyCost;
            costs[provider].details.compute.push(compute);
          } else {
            const quantity = vm.quantity || 1;
            const hoursPerMonth = vm.hoursPerMonth || 730;
            const vmSize = vm.size || 'medium';
            
            for (const provider of Object.keys(costs)) {
              const instance = instanceMap[vmSize]?.[provider];
              if (instance) {
                const compute = await this.calculateComputeCost(provider, regions[provider], instance, quantity, hoursPerMonth);
                costs[provider].compute += compute.monthlyCost;
                costs[provider].details.compute.push(compute);
              }
            }
          }
        }
      }
// END MODIFICATION
      
      if (workload.storage && workload.storage.length > 0) {
        for (const storage of workload.storage) {
          const sizeGB = storage.sizeGB || 100;
          const storageType = storage.type || 'standard';
          
          let awsStorageType, azureStorageType, gcpStorageType, 
              ibmStorageType, oracleStorageType, alibabaStorageType, doStorageType;
          
          if (storageType === 'object') {
            awsStorageType = 's3_standard';
            azureStorageType = 'blob_storage';
            gcpStorageType = 'cloud_storage_standard';
            ibmStorageType = 'cloud_object_storage_standard';
            oracleStorageType = 'object_storage_standard';
            alibabaStorageType = 'oss_standard';
            doStorageType = 'spaces';
          } else {
            awsStorageType = 'ebs_gp2';
            azureStorageType = 'managed_disk_standard';
            gcpStorageType = 'persistent_disk_standard';
            ibmStorageType = 'block_storage_general';
            oracleStorageType = 'block_volume';
            alibabaStorageType = 'disk_standard';
            doStorageType = 'volumes';
          }
          
          try {
            for (const provider of Object.keys(costs)) {
              let type;
              switch (provider) {
                case 'aws': type = awsStorageType; break;
                case 'azure': type = azureStorageType; break;
                case 'gcp': type = gcpStorageType; break;
                case 'ibm': type = ibmStorageType; break;
                case 'oracle': type = oracleStorageType; break;
                case 'alibaba': type = alibabaStorageType; break;
                case 'digitalocean': type = doStorageType; break;
              }
              if (type) {
                const storageCost = await this.calculateStorageCost(provider, type, sizeGB);
                costs[provider].storage += storageCost.monthlyCost;
                costs[provider].details.storage.push(storageCost);
              }
            }
          } catch (error) {
            logger.error(`Error calculating storage costs: ${error.message}`);
          }
        }
      }
      
      if (workload.database && workload.database.length > 0) {
        for (const db of workload.database) {
          const quantity = db.quantity || 1;
          const dbType = db.type || 'mysql';
          
          let awsDBType, azureDBType, gcpDBType,
              ibmDBType, oracleDBType, alibabaDBType, doDBType;
          
          if (dbType === 'mysql') {
            awsDBType = 'rds_mysql_t3_small';
            azureDBType = 'mysql_b_gen5_1';
            gcpDBType = 'cloud_sql_mysql_db_f1_micro';
            ibmDBType = 'db2_small';
            oracleDBType = 'mysql_basic';
            alibabaDBType = 'rds_mysql_basic';
            doDBType = 'managed-mysql';
          } else { 
            awsDBType = 'dynamodb';
            azureDBType = 'cosmos_db';
            gcpDBType = 'firestore';
            ibmDBType = 'cloudant';
            oracleDBType = 'autonomous_transaction';
            alibabaDBType = 'tablestore';
            doDBType = 'managed-redis';
          }
          
          try {
            for (const provider of Object.keys(costs)) {
              let type;
              switch (provider) {
                case 'aws': type = awsDBType; break;
                case 'azure': type = azureDBType; break;
                case 'gcp': type = gcpDBType; break;
                case 'ibm': type = ibmDBType; break;
                case 'oracle': type = oracleDBType; break;
                case 'alibaba': type = alibabaDBType; break;
                case 'digitalocean': type = doDBType; break;
              }
              if (type) {
                const dbCost = await this.calculateDatabaseCost(provider, type, quantity);
                costs[provider].database += dbCost.monthlyCost;
                costs[provider].details.database.push(dbCost);
              }
            }
          } catch (error) {
            logger.error(`Error calculating database costs: ${error.message}`);
          }
        }
      }
      
      Object.keys(costs).forEach(provider => {
        costs[provider].total = costs[provider].compute + costs[provider].storage + costs[provider].database;
      });
      
      const result = {};
      Object.keys(costs).forEach(provider => {
        result[provider] = {
          compute: Math.round(costs[provider].compute * 100) / 100,
          storage: Math.round(costs[provider].storage * 100) / 100,
          database: Math.round(costs[provider].database * 100) / 100,
          total: Math.round(costs[provider].total * 100) / 100,
          details: costs[provider].details
        };
      });
      
      return result;
    } catch (error) {
      logger.error(`Error calculating workload cost: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new PricingService();