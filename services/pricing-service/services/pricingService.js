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
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'pricing-service.log' })
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
      
      // Calculate cost based on hourly rate and usage
      const hourlyCost = instancePricing.hourly * quantity;
      const monthlyCost = hourlyCost * (hoursPerMonth || 730); // Default to 730 hours per month (24/7)
      
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
        monthlyCost = dbPricing.hourly * 730 * quantity; // 730 hours in a month
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
      // Initialize cost objects for each provider
      const costs = {
        aws: { compute: 0, storage: 0, database: 0, total: 0, details: {} },
        azure: { compute: 0, storage: 0, database: 0, total: 0, details: {} },
        gcp: { compute: 0, storage: 0, database: 0, total: 0, details: {} },
        ibm: { compute: 0, storage: 0, database: 0, total: 0, details: {} },
        oracle: { compute: 0, storage: 0, database: 0, total: 0, details: {} },
        alibaba: { compute: 0, storage: 0, database: 0, total: 0, details: {} },
        digitalocean: { compute: 0, storage: 0, database: 0, total: 0, details: {} }
      };
      
      // Default regions if not specified
      const regions = {
        aws: workload.region?.aws || 'us-east-1',
        azure: workload.region?.azure || 'eastus',
        gcp: workload.region?.gcp || 'us-central1',
        ibm: workload.region?.ibm || 'us-south',
        oracle: workload.region?.oracle || 'us-ashburn-1',
        alibaba: workload.region?.alibaba || 'us-west-1',
        digitalocean: workload.region?.digitalocean || 'nyc1'
      };
      
      // Initialize details arrays for all providers
      Object.keys(costs).forEach(provider => {
        costs[provider].details.compute = [];
        costs[provider].details.storage = [];
        costs[provider].details.database = [];
      });
      
      // Calculate compute costs
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
            
            const awsInstance = vm.aws_instance || instanceMap[vmSize]?.aws || 't2.medium';
            const awsCompute = await this.calculateComputeCost('aws', regions.aws, awsInstance, quantity, hoursPerMonth);
            costs.aws.compute += awsCompute.monthlyCost;
            costs.aws.details.compute.push(awsCompute);
            
            const azureInstance = vm.azure_instance || instanceMap[vmSize]?.azure || 'B2S';
            const azureCompute = await this.calculateComputeCost('azure', regions.azure, azureInstance, quantity, hoursPerMonth);
            costs.azure.compute += azureCompute.monthlyCost;
            costs.azure.details.compute.push(azureCompute);
            
            const gcpInstance = vm.gcp_instance || instanceMap[vmSize]?.gcp || 'e2-medium';
            const gcpCompute = await this.calculateComputeCost('gcp', regions.gcp, gcpInstance, quantity, hoursPerMonth);
            costs.gcp.compute += gcpCompute.monthlyCost;
            costs.gcp.details.compute.push(gcpCompute);
            
            const ibmInstance = vm.ibm_instance || instanceMap[vmSize]?.ibm || 'bx2-2x8';
            const ibmCompute = await this.calculateComputeCost('ibm', regions.ibm, ibmInstance, quantity, hoursPerMonth);
            costs.ibm.compute += ibmCompute.monthlyCost;
            costs.ibm.details.compute.push(ibmCompute);
            
            const oracleInstance = vm.oracle_instance || instanceMap[vmSize]?.oracle || 'VM.Standard.E3.Flex.2.8';
            const oracleCompute = await this.calculateComputeCost('oracle', regions.oracle, oracleInstance, quantity, hoursPerMonth);
            costs.oracle.compute += oracleCompute.monthlyCost;
            costs.oracle.details.compute.push(oracleCompute);
            
            const alibabaInstance = vm.alibaba_instance || instanceMap[vmSize]?.alibaba || 'ecs.g6.large';
            const alibabaCompute = await this.calculateComputeCost('alibaba', regions.alibaba, alibabaInstance, quantity, hoursPerMonth);
            costs.alibaba.compute += alibabaCompute.monthlyCost;
            costs.alibaba.details.compute.push(alibabaCompute);

            const doInstance = vm.digitalocean_instance || instanceMap[vmSize]?.digitalocean || 's-2vcpu-4gb';
            const doCompute = await this.calculateComputeCost('digitalocean', regions.digitalocean, doInstance, quantity, hoursPerMonth);
            costs.digitalocean.compute += doCompute.monthlyCost;
            costs.digitalocean.details.compute.push(doCompute);
          }
        }
      }
      
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
            const awsStorage = await this.calculateStorageCost('aws', awsStorageType, sizeGB);
            costs.aws.storage += awsStorage.monthlyCost;
            costs.aws.details.storage.push(awsStorage);
            
            const azureStorage = await this.calculateStorageCost('azure', azureStorageType, sizeGB);
            costs.azure.storage += azureStorage.monthlyCost;
            costs.azure.details.storage.push(azureStorage);
            
            const gcpStorage = await this.calculateStorageCost('gcp', gcpStorageType, sizeGB);
            costs.gcp.storage += gcpStorage.monthlyCost;
            costs.gcp.details.storage.push(gcpStorage);
            
            const ibmStorage = await this.calculateStorageCost('ibm', ibmStorageType, sizeGB);
            costs.ibm.storage += ibmStorage.monthlyCost;
            costs.ibm.details.storage.push(ibmStorage);
            
            const oracleStorage = await this.calculateStorageCost('oracle', oracleStorageType, sizeGB);
            costs.oracle.storage += oracleStorage.monthlyCost;
            costs.oracle.details.storage.push(oracleStorage);
            
            const alibabaStorage = await this.calculateStorageCost('alibaba', alibabaStorageType, sizeGB);
            costs.alibaba.storage += alibabaStorage.monthlyCost;
            costs.alibaba.details.storage.push(alibabaStorage);

            const doStorage = await this.calculateStorageCost('digitalocean', doStorageType, sizeGB);
            costs.digitalocean.storage += doStorage.monthlyCost;
            costs.digitalocean.details.storage.push(doStorage);
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
            const awsDB = await this.calculateDatabaseCost('aws', awsDBType, quantity);
            costs.aws.database += awsDB.monthlyCost;
            costs.aws.details.database.push(awsDB);
            
            const azureDB = await this.calculateDatabaseCost('azure', azureDBType, quantity);
            costs.azure.database += azureDB.monthlyCost;
            costs.azure.details.database.push(azureDB);
            
            const gcpDB = await this.calculateDatabaseCost('gcp', gcpDBType, quantity);
            costs.gcp.database += gcpDB.monthlyCost;
            costs.gcp.details.database.push(gcpDB);
            
            const ibmDB = await this.calculateDatabaseCost('ibm', ibmDBType, quantity);
            costs.ibm.database += ibmDB.monthlyCost;
            costs.ibm.details.database.push(ibmDB);
            
            const oracleDB = await this.calculateDatabaseCost('oracle', oracleDBType, quantity);
            costs.oracle.database += oracleDB.monthlyCost;
            costs.oracle.details.database.push(oracleDB);
            
            const alibabaDB = await this.calculateDatabaseCost('alibaba', alibabaDBType, quantity);
            costs.alibaba.database += alibabaDB.monthlyCost;
            costs.alibaba.details.database.push(alibabaDB);

            const doDB = await this.calculateDatabaseCost('digitalocean', doDBType, quantity);
            costs.digitalocean.database += doDB.monthlyCost;
            costs.digitalocean.details.database.push(doDB);
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