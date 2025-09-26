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

module.exports = databasePricing;