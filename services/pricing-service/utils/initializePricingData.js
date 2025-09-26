const fs = require('fs');
const path = require('path');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'pricing-data.log' })
  ]
});

// Function to initialize pricing data if not exists
const initializePricingData = () => {
  logger.info('Checking if pricing data exists...');
  
  // Define data directory paths - check both possible locations
  const dataDirs = [
    path.join(__dirname, '..', 'data'),
    path.join(__dirname, '..', '..', '..', 'data', 'pricing'),
    '/app/data' // Docker volume mapped path
  ];
  
  // Find the first valid data directory
  let dataDir = null;
  for (const dir of dataDirs) {
    if (fs.existsSync(dir)) {
      dataDir = dir;
      logger.info(`Found data directory at: ${dataDir}`);
      break;
    }
  }
  
  // If no valid directory is found, create one
  if (!dataDir) {
    dataDir = path.join(__dirname, '..', 'data');
    logger.info(`Creating data directory at: ${dataDir}`);
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Check if aws-compute.json exists
  const awsComputePath = path.join(dataDir, 'aws-compute.json');
  const azureComputePath = path.join(dataDir, 'azure-compute.json');
  const gcpComputePath = path.join(dataDir, 'gcp-compute.json');
  const storagePath = path.join(dataDir, 'storage.json');
  const databasePath = path.join(dataDir, 'database.json');
  
  // Create data files if they don't exist
  if (!fs.existsSync(awsComputePath) || 
      !fs.existsSync(azureComputePath) || 
      !fs.existsSync(gcpComputePath) || 
      !fs.existsSync(storagePath) || 
      !fs.existsSync(databasePath)) {
    
    logger.info('Some pricing data files missing, creating them...');
    
    // Sample AWS compute pricing data
    const awsComputePricing = {
      'us-east-1': {
        't2.micro': { hourly: 0.0116, monthly: 8.47, vcpu: 1, memory: 1 },
        't2.small': { hourly: 0.023, monthly: 16.79, vcpu: 1, memory: 2 },
        't2.medium': { hourly: 0.0464, monthly: 33.87, vcpu: 2, memory: 4 },
        't2.large': { hourly: 0.0928, monthly: 67.74, vcpu: 2, memory: 8 },
        'm5.large': { hourly: 0.096, monthly: 70.08, vcpu: 2, memory: 8 },
        'c5.large': { hourly: 0.085, monthly: 62.05, vcpu: 2, memory: 4 },
        'r5.large': { hourly: 0.126, monthly: 91.98, vcpu: 2, memory: 16 }
      }
    };
    
    // Sample Azure compute pricing data
    const azureComputePricing = {
      'eastus': {
        'B1S': { hourly: 0.0104, monthly: 7.59, vcpu: 1, memory: 1 },
        'B2S': { hourly: 0.0416, monthly: 30.37, vcpu: 2, memory: 4 },
        'D2s_v3': { hourly: 0.096, monthly: 70.08, vcpu: 2, memory: 8 },
        'F2s_v2': { hourly: 0.085, monthly: 62.05, vcpu: 2, memory: 4 },
        'E2s_v3': { hourly: 0.126, monthly: 91.98, vcpu: 2, memory: 16 }
      }
    };
    
    // Sample GCP compute pricing data
    const gcpComputePricing = {
      'us-central1': {
        'e2-micro': { hourly: 0.0105, monthly: 7.67, vcpu: 0.25, memory: 1 },
        'e2-small': { hourly: 0.021, monthly: 15.33, vcpu: 0.5, memory: 2 },
        'e2-medium': { hourly: 0.042, monthly: 30.66, vcpu: 1, memory: 4 },
        'n1-standard-1': { hourly: 0.0475, monthly: 34.68, vcpu: 1, memory: 3.75 },
        'n1-standard-2': { hourly: 0.095, monthly: 69.35, vcpu: 2, memory: 7.5 },
        'c2-standard-4': { hourly: 0.2088, monthly: 152.42, vcpu: 4, memory: 16 }
      }
    };

    // Sample storage pricing data
    const storagePricing = {
      aws: {
        's3_standard': { 
          monthly_per_gb: 0.023,
          details: {
            durability: "99.999999999%",
            availability: "99.99%",
            min_storage_duration: "No minimum",
            retrieval_fee: "No retrieval fee",
            data_transfer_out: "$0.09/GB",
            lifecycle_policies: true,
            replication: true,
            infrequent_access_tier: true
          }
        },
        'ebs_gp2': { 
          monthly_per_gb: 0.10,
          details: {
            volume_type: "SSD",
            iops: "3 IOPS/GB, minimum 100 IOPS",
            throughput: "Up to 250 MiB/s",
            max_volume_size: "16 TiB",
            snapshot_storage: "$0.05/GB-month",
            boot_volume_support: true,
            encryption: true
          }
        }
      },
      azure: {
        'blob_storage': { 
          monthly_per_gb: 0.0184,
          details: {
            durability: "99.999999999%",
            availability: "99.9%",
            min_storage_duration: "No minimum",
            retrieval_fee: "No retrieval fee for hot tier",
            data_transfer_out: "$0.087/GB",
            lifecycle_policies: true,
            replication: true,
            access_tiers: "Hot, Cool, Archive"
          }
        },
        'managed_disk_standard': { 
          monthly_per_gb: 0.0475,
          details: {
            volume_type: "HDD",
            iops: "500 IOPS",
            throughput: "60 MiB/s",
            max_volume_size: "32 TiB",
            snapshot_storage: "$0.05/GB-month",
            boot_volume_support: true,
            encryption: true
          }
        }
      },
      gcp: {
        'cloud_storage_standard': { 
          monthly_per_gb: 0.020,
          details: {
            durability: "99.999999999%",
            availability: "99.95%",
            min_storage_duration: "No minimum",
            retrieval_fee: "No retrieval fee",
            data_transfer_out: "$0.08/GB",
            lifecycle_policies: true,
            replication: true,
            storage_classes: "Standard, Nearline, Coldline, Archive"
          }
        },
        'persistent_disk_standard': { 
          monthly_per_gb: 0.04,
          details: {
            volume_type: "HDD",
            iops: "Up to 3000 IOPS",
            throughput: "Up to 180 MiB/s",
            max_volume_size: "64 TiB",
            snapshot_storage: "$0.026/GB-month",
            boot_volume_support: true,
            encryption: true
          }
        }
      }
    };

    // Sample database pricing data
    const databasePricing = {
      aws: {
        'rds_mysql_t3_small': { 
          hourly: 0.034, 
          monthly: 24.82,
          details: {
            vcpu: 2,
            memory: "2 GiB",
            storage: "20 GB included, additional $0.115/GB-month",
            iops: "3 IOPS/GB baseline",
            backups: "Daily backup, 7 day retention included",
            multi_az: "Additional cost",
            dormancy_policy: "Resources billed until explicitly terminated",
            auto_scaling: true,
            maintenance_window: "Weekly 30-minute window",
            performance: "Burstable performance"
          }
        },
        'dynamodb': { 
          monthly_per_gb: 0.25, 
          read_capacity_unit: 0.00025, 
          write_capacity_unit: 0.00125,
          details: {
            consistency: "Eventually consistent reads by default",
            throughput_mode: "On-demand or provisioned",
            max_item_size: "400 KB",
            indexes: "Local and global secondary indexes",
            dormancy_policy: "Pay only for resources used, no termination required",
            auto_scaling: true,
            backups: "Point-in-time recovery additional cost",
            encryption: "Encryption at rest included",
            time_to_live: "Automatic item expiration"
          }
        }
      },
      azure: {
        'mysql_b_gen5_1': { 
          hourly: 0.036, 
          monthly: 26.28,
          details: {
            vcpu: 1,
            memory: "2 GiB",
            storage: "5 GB included, additional $0.115/GB-month",
            iops: "300 IOPS included",
            backups: "7 days retention included, 35 days additional cost",
            geo_redundancy: "Additional cost",
            dormancy_policy: "Resources billed until explicitly deleted",
            auto_scaling: "Storage only",
            maintenance_window: "Configurable maintenance window",
            performance: "Burstable performance"
          }
        },
        'cosmos_db': { 
          monthly_per_gb: 0.25, 
          request_unit: 0.008,
          details: {
            consistency: "Five consistency levels",
            throughput_mode: "Provisioned or serverless",
            max_item_size: "2 MB",
            dormancy_policy: "Minimum 400 RU/s or 40,000 RU/s per hour in serverless",
            auto_scaling: true,
            backups: "Continuous backups included",
            encryption: "Encryption at rest included",
            time_to_live: "Automatic item expiration",
            indexing: "Automatic indexing"
          }
        }
      },
      gcp: {
        'cloud_sql_mysql_db_f1_micro': { 
          hourly: 0.0105, 
          monthly: 7.67,
          details: {
            vcpu: "Shared",
            memory: "0.6 GiB",
            storage: "10 GB included, additional $0.17/GB-month",
            iops: "Based on disk size",
            backups: "7 automatic backups included",
            high_availability: "Additional cost",
            dormancy_policy: "Resources billed until explicitly deleted",
            maintenance_window: "Configurable maintenance window",
            performance: "Shared-core performance"
          }
        },
        'firestore': { 
          monthly_per_gb: 0.18, 
          read: 0.06, 
          write: 0.18,
          details: {
            consistency: "Strong consistency",
            throughput_mode: "Pay per operation",
            max_document_size: "1 MB",
            dormancy_policy: "Pay only for storage and operations used",
            auto_scaling: "Automatic scaling",
            backups: "Managed export operations",
            encryption: "Encryption at rest included",
            indexes: "Automatic and composite indexes",
            offline_support: true
          }
        }
      }
    };
  
    // Write pricing data to files
    if (!fs.existsSync(awsComputePath)) {
      fs.writeFileSync(awsComputePath, JSON.stringify(awsComputePricing, null, 2));
    }
    
    if (!fs.existsSync(azureComputePath)) {
      fs.writeFileSync(azureComputePath, JSON.stringify(azureComputePricing, null, 2));
    }
    
    if (!fs.existsSync(gcpComputePath)) {
      fs.writeFileSync(gcpComputePath, JSON.stringify(gcpComputePricing, null, 2));
    }
    
    if (!fs.existsSync(storagePath)) {
      fs.writeFileSync(storagePath, JSON.stringify(storagePricing, null, 2));
    }
    
    if (!fs.existsSync(databasePath)) {
      fs.writeFileSync(databasePath, JSON.stringify(databasePricing, null, 2));
    }
    
    logger.info('Pricing data files created successfully');
  } else {
    logger.info('All pricing data files already exist');
  }
};

// Function to load pricing data
const loadPricingData = () => {
  logger.info('Loading pricing data...');
  
  // Define data directory paths - check both possible locations
  const dataDirs = [
    path.join(__dirname, '..', 'data'),
    path.join(__dirname, '..', '..', '..', 'data', 'pricing'),
    '/app/data' // Docker volume mapped path
  ];
  
  // Find the first valid data directory
  let dataDir = null;
  for (const dir of dataDirs) {
    if (fs.existsSync(dir)) {
      dataDir = dir;
      logger.info(`Found data directory at: ${dataDir}`);
      break;
    }
  }
  
  if (!dataDir) {
    throw new Error('Could not find data directory');
  }
  
  // Load the pricing data from the data directory
  const awsComputePath = path.join(dataDir, 'aws-compute.json');
  const azureComputePath = path.join(dataDir, 'azure-compute.json');
  const gcpComputePath = path.join(dataDir, 'gcp-compute.json');
  const storagePath = path.join(dataDir, 'storage.json');
  const databasePath = path.join(dataDir, 'database.json');
  
  try {
    const awsCompute = JSON.parse(fs.readFileSync(awsComputePath, 'utf8'));
    const azureCompute = JSON.parse(fs.readFileSync(azureComputePath, 'utf8'));
    const gcpCompute = JSON.parse(fs.readFileSync(gcpComputePath, 'utf8'));
    const storage = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
    const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));
    
    logger.info('Pricing data loaded successfully');
    
    return {
      compute: {
        aws: awsCompute,
        azure: azureCompute,
        gcp: gcpCompute
      },
      storage,
      database
    };
  } catch (error) {
    logger.error(`Error loading pricing data: ${error.message}`);
    throw error;
  }
};

module.exports = {
  initializePricingData,
  loadPricingData
};