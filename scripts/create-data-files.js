/**
 * Script to generate initial pricing data files for all cloud providers
 * 
 * Usage: node create-data-files.js
 */

const fs = require('fs');
const path = require('path');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data', 'pricing');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// AWS Compute Pricing
const awsComputePricing = {
  "us-east-1": {
    "t2.micro": {
      "hourly": 0.0116,
      "monthly": 8.47,
      "vcpu": 1,
      "memory": 1
    },
    "t2.small": {
      "hourly": 0.023,
      "monthly": 16.79,
      "vcpu": 1,
      "memory": 2
    },
    "t2.medium": {
      "hourly": 0.0464,
      "monthly": 33.87,
      "vcpu": 2,
      "memory": 4
    },
    "t2.large": {
      "hourly": 0.0928,
      "monthly": 67.74,
      "vcpu": 2,
      "memory": 8
    },
    "m5.large": {
      "hourly": 0.096,
      "monthly": 70.08,
      "vcpu": 2,
      "memory": 8
    },
    "c5.large": {
      "hourly": 0.085,
      "monthly": 62.05,
      "vcpu": 2,
      "memory": 4
    },
    "r5.large": {
      "hourly": 0.126,
      "monthly": 91.98,
      "vcpu": 2,
      "memory": 16
    }
  },
  "us-west-2": {
    "t2.micro": {
      "hourly": 0.0116,
      "monthly": 8.47,
      "vcpu": 1,
      "memory": 1
    },
    "t2.small": {
      "hourly": 0.023,
      "monthly": 16.79,
      "vcpu": 1,
      "memory": 2
    },
    "t2.medium": {
      "hourly": 0.0464,
      "monthly": 33.87,
      "vcpu": 2,
      "memory": 4
    },
    "t2.large": {
      "hourly": 0.0928,
      "monthly": 67.74,
      "vcpu": 2,
      "memory": 8
    },
    "m5.large": {
      "hourly": 0.096,
      "monthly": 70.08,
      "vcpu": 2,
      "memory": 8
    },
    "c5.large": {
      "hourly": 0.085,
      "monthly": 62.05,
      "vcpu": 2,
      "memory": 4
    },
    "r5.large": {
      "hourly": 0.126,
      "monthly": 91.98,
      "vcpu": 2,
      "memory": 16
    }
  }
};

// Azure Compute Pricing
const azureComputePricing = {
  "eastus": {
    "B1S": {
      "hourly": 0.0104,
      "monthly": 7.59,
      "vcpu": 1,
      "memory": 1
    },
    "B2S": {
      "hourly": 0.0416,
      "monthly": 30.37,
      "vcpu": 2,
      "memory": 4
    },
    "D2s_v3": {
      "hourly": 0.096,
      "monthly": 70.08,
      "vcpu": 2,
      "memory": 8
    },
    "F2s_v2": {
      "hourly": 0.085,
      "monthly": 62.05,
      "vcpu": 2,
      "memory": 4
    },
    "E2s_v3": {
      "hourly": 0.126,
      "monthly": 91.98,
      "vcpu": 2,
      "memory": 16
    }
  },
  "westeurope": {
    "B1S": {
      "hourly": 0.0114,
      "monthly": 8.32,
      "vcpu": 1,
      "memory": 1
    },
    "B2S": {
      "hourly": 0.0457,
      "monthly": 33.36,
      "vcpu": 2,
      "memory": 4
    },
    "D2s_v3": {
      "hourly": 0.1104,
      "monthly": 80.59,
      "vcpu": 2,
      "memory": 8
    },
    "F2s_v2": {
      "hourly": 0.0978,
      "monthly": 71.39,
      "vcpu": 2,
      "memory": 4
    },
    "E2s_v3": {
      "hourly": 0.1449,
      "monthly": 105.78,
      "vcpu": 2,
      "memory": 16
    }
  }
};

// GCP Compute Pricing
const gcpComputePricing = {
  "us-central1": {
    "e2-micro": {
      "hourly": 0.0105,
      "monthly": 7.67,
      "vcpu": 0.25,
      "memory": 1
    },
    "e2-small": {
      "hourly": 0.021,
      "monthly": 15.33,
      "vcpu": 0.5,
      "memory": 2
    },
    "e2-medium": {
      "hourly": 0.042,
      "monthly": 30.66,
      "vcpu": 1,
      "memory": 4
    },
    "n1-standard-1": {
      "hourly": 0.0475,
      "monthly": 34.68,
      "vcpu": 1,
      "memory": 3.75
    },
    "n1-standard-2": {
      "hourly": 0.095,
      "monthly": 69.35,
      "vcpu": 2,
      "memory": 7.5
    },
    "c2-standard-4": {
      "hourly": 0.2088,
      "monthly": 152.42,
      "vcpu": 4,
      "memory": 16
    }
  },
  "europe-west1": {
    "e2-micro": {
      "hourly": 0.0115,
      "monthly": 8.4,
      "vcpu": 0.25,
      "memory": 1
    },
    "e2-small": {
      "hourly": 0.023,
      "monthly": 16.79,
      "vcpu": 0.5,
      "memory": 2
    },
    "e2-medium": {
      "hourly": 0.046,
      "monthly": 33.58,
      "vcpu": 1,
      "memory": 4
    },
    "n1-standard-1": {
      "hourly": 0.0522,
      "monthly": 38.11,
      "vcpu": 1,
      "memory": 3.75
    },
    "n1-standard-2": {
      "hourly": 0.1045,
      "monthly": 76.29,
      "vcpu": 2,
      "memory": 7.5
    },
    "c2-standard-4": {
      "hourly": 0.2297,
      "monthly": 167.68,
      "vcpu": 4,
      "memory": 16
    }
  }
};

// IBM Compute Pricing
const ibmComputePricing = {
  "us-south": {
    "bx2-2x8": {
      "hourly": 0.0996,
      "monthly": 72.71,
      "vcpu": 2,
      "memory": 8
    },
    "bx2-4x16": {
      "hourly": 0.1992,
      "monthly": 145.42,
      "vcpu": 4,
      "memory": 16
    },
    "bx2-8x32": {
      "hourly": 0.3984,
      "monthly": 290.83,
      "vcpu": 8,
      "memory": 32
    },
    "cx2-2x4": {
      "hourly": 0.0944,
      "monthly": 68.91,
      "vcpu": 2,
      "memory": 4
    },
    "mx2-2x16": {
      "hourly": 0.1312,
      "monthly": 95.78,
      "vcpu": 2,
      "memory": 16
    },
    "mx2-4x32": {
      "hourly": 0.2624,
      "monthly": 191.55,
      "vcpu": 4,
      "memory": 32
    }
  },
  "eu-de": {
    "bx2-2x8": {
      "hourly": 0.1025,
      "monthly": 74.83,
      "vcpu": 2,
      "memory": 8
    },
    "bx2-4x16": {
      "hourly": 0.205,
      "monthly": 149.65,
      "vcpu": 4,
      "memory": 16
    },
    "bx2-8x32": {
      "hourly": 0.41,
      "monthly": 299.3,
      "vcpu": 8,
      "memory": 32
    },
    "cx2-2x4": {
      "hourly": 0.097,
      "monthly": 70.81,
      "vcpu": 2,
      "memory": 4
    },
    "mx2-2x16": {
      "hourly": 0.1348,
      "monthly": 98.4,
      "vcpu": 2,
      "memory": 16
    },
    "mx2-4x32": {
      "hourly": 0.2696,
      "monthly": 196.81,
      "vcpu": 4,
      "memory": 32
    }
  }
};

// Oracle Compute Pricing
const oracleComputePricing = {
  "us-ashburn-1": {
    "VM.Standard.E3.Flex.2.8": {
      "hourly": 0.0868,
      "monthly": 63.36,
      "vcpu": 2,
      "memory": 8
    },
    "VM.Standard.E3.Flex.4.16": {
      "hourly": 0.1736,
      "monthly": 126.73,
      "vcpu": 4,
      "memory": 16
    },
    "VM.Standard.E3.Flex.8.32": {
      "hourly": 0.3472,
      "monthly": 253.46,
      "vcpu": 8,
      "memory": 32
    },
    "VM.Standard.E4.Flex.2.16": {
      "hourly": 0.1112,
      "monthly": 81.18,
      "vcpu": 2,
      "memory": 16
    },
    "VM.Optimized3.Flex.2.4": {
      "hourly": 0.092,
      "monthly": 67.16,
      "vcpu": 2,
      "memory": 4
    }
  },
  "eu-frankfurt-1": {
    "VM.Standard.E3.Flex.2.8": {
      "hourly": 0.0925,
      "monthly": 67.53,
      "vcpu": 2,
      "memory": 8
    },
    "VM.Standard.E3.Flex.4.16": {
      "hourly": 0.185,
      "monthly": 135.05,
      "vcpu": 4,
      "memory": 16
    },
    "VM.Standard.E3.Flex.8.32": {
      "hourly": 0.37,
      "monthly": 270.1,
      "vcpu": 8,
      "memory": 32
    },
    "VM.Standard.E4.Flex.2.16": {
      "hourly": 0.1185,
      "monthly": 86.51,
      "vcpu": 2,
      "memory": 16
    },
    "VM.Optimized3.Flex.2.4": {
      "hourly": 0.098,
      "monthly": 71.54,
      "vcpu": 2,
      "memory": 4
    }
  }
};

// Alibaba Compute Pricing
const alibabaComputePricing = {
  "us-west-1": {
    "ecs.g6.large": {
      "hourly": 0.0925,
      "monthly": 67.53,
      "vcpu": 2,
      "memory": 8
    },
    "ecs.g6.xlarge": {
      "hourly": 0.185,
      "monthly": 135.05,
      "vcpu": 4,
      "memory": 16
    },
    "ecs.g6.2xlarge": {
      "hourly": 0.37,
      "monthly": 270.1,
      "vcpu": 8,
      "memory": 32
    },
    "ecs.c6.large": {
      "hourly": 0.083,
      "monthly": 60.59,
      "vcpu": 2,
      "memory": 4
    },
    "ecs.r6.large": {
      "hourly": 0.116,
      "monthly": 84.68,
      "vcpu": 2,
      "memory": 16
    }
  },
  "cn-hangzhou": {
    "ecs.g6.large": {
      "hourly": 0.088,
      "monthly": 64.24,
      "vcpu": 2,
      "memory": 8
    },
    "ecs.g6.xlarge": {
      "hourly": 0.176,
      "monthly": 128.48,
      "vcpu": 4,
      "memory": 16
    },
    "ecs.g6.2xlarge": {
      "hourly": 0.352,
      "monthly": 256.96,
      "vcpu": 8,
      "memory": 32
    },
    "ecs.c6.large": {
      "hourly": 0.079,
      "monthly": 57.67,
      "vcpu": 2,
      "memory": 4
    },
    "ecs.r6.large": {
      "hourly": 0.11,
      "monthly": 80.3,
      "vcpu": 2,
      "memory": 16
    }
  }
};

// Storage Pricing
const storagePricing = {
  "aws": {
    "s3_standard": {
      "monthly_per_gb": 0.023,
      "details": {
        "min_storage_duration": "None",
        "availability": "99.99%",
        "api_requests": "$0.005 per 1,000 requests"
      }
    },
    "ebs_gp2": {
      "monthly_per_gb": 0.1,
      "details": {
        "iops_included": "3 IOPS/GB up to 16,000",
        "max_volume_size": "16 TiB",
        "burst_capability": "Yes"
      }
    }
  },
  "azure": {
    "blob_storage": {
      "monthly_per_gb": 0.0184,
      "details": {
        "min_storage_duration": "None",
        "availability": "99.99%",
        "replication": "LRS (Locally Redundant Storage)"
      }
    },
    "managed_disk_standard": {
      "monthly_per_gb": 0.0475,
      "details": {
        "max_iops": "500",
        "max_throughput": "60 MB/s",
        "max_volume_size": "32 TiB"
      }
    }
  },
  "gcp": {
    "cloud_storage_standard": {
      "monthly_per_gb": 0.02,
      "details": {
        "min_storage_duration": "None",
        "availability": "99.99%",
        "api_operations": "$0.004 per 1,000 operations"
      }
    },
    "persistent_disk_standard": {
      "monthly_per_gb": 0.04,
      "details": {
        "performance": "0.12 IOPS/GB (up to 6000 IOPS)",
        "max_volume_size": "64 TB",
        "snapshot_storage": "$0.026/GB-month"
      }
    }
  },
  "ibm": {
    "cloud_object_storage_standard": {
      "monthly_per_gb": 0.0225,
      "details": {
        "min_storage_duration": "30 days",
        "availability": "99.999%",
        "cross_region_options": true,
        "api_operations": "$0.005 per 1,000 operations"
      }
    },
    "block_storage_general": {
      "monthly_per_gb": 0.1,
      "details": {
        "iops_base": "3 IOPS/GB",
        "max_volume_size": "16 TB",
        "snapshot_support": true,
        "expansion_support": "Yes, with no downtime"
      }
    }
  },
  "oracle": {
    "object_storage_standard": {
      "monthly_per_gb": 0.0255,
      "details": {
        "free_tier": "10 GB free",
        "min_storage_duration": "None",
        "availability": "99.9%",
        "requests": "$0.0051 per 1,000 requests"
      }
    },
    "block_volume": {
      "monthly_per_gb": 0.0425,
      "details": {
        "performance_tiers": true,
        "volume_groups": true,
        "max_volume_size": "32 TB",
        "automatic_performance_tuning": "Yes"
      }
    }
  },
  "alibaba": {
    "oss_standard": {
      "monthly_per_gb": 0.019,
      "details": {
        "availability": "99.95%",
        "access_frequency": "Frequent",
        "asia_optimized": true,
        "redundancy": "3 copies across zones"
      }
    },
    "disk_standard": {
      "monthly_per_gb": 0.045,
      "details": {
        "max_iops": "500",
        "max_throughput": "80 MB/s",
        "snapshot_support": true,
        "online_resize": "Yes"
      }
    }
  }
};

// Database Pricing
const databasePricing = {
  "aws": {
    "rds_mysql_t3_small": {
      "hourly": 0.034,
      "monthly": 24.82,
      "details": {
        "vcpu": "2 vCPU",
        "memory": "2 GB",
        "storage": "20 GB included",
        "engine": "MySQL"
      }
    },
    "dynamodb": {
      "monthly_per_gb": 0.25,
      "read_capacity_unit": 0.00025,
      "write_capacity_unit": 0.00125,
      "details": {
        "consistency": "Eventually consistent by default",
        "autoscaling": "Available",
        "global_tables": "Supported"
      }
    }
  },
  "azure": {
    "mysql_b_gen5_1": {
      "hourly": 0.036,
      "monthly": 26.28,
      "details": {
        "vcpu": "1 vCore",
        "memory": "2 GB",
        "storage": "5 GB included",
        "engine": "MySQL"
      }
    },
    "cosmos_db": {
      "monthly_per_gb": 0.25,
      "request_unit": 0.008,
      "details": {
        "consistency_levels": "5 levels available",
        "global_distribution": "Automatic",
        "apis": "SQL, MongoDB, Cassandra, Gremlin, Table"
      }
    }
  },
  "gcp": {
    "cloud_sql_mysql_db_f1_micro": {
      "hourly": 0.0105,
      "monthly": 7.67,
      "details": {
        "vcpu": "0.5 vCPU",
        "memory": "0.6 GB",
        "storage": "10 GB included",
        "engine": "MySQL"
      }
    },
    "firestore": {
      "monthly_per_gb": 0.18,
      "read": 0.06,
      "write": 0.18,
      "details": {
        "document_model": "Native",
        "transactions": "ACID compliant",
        "offline_support": "Yes"
      }
    }
  },
  "ibm": {
    "db2_small": {
      "hourly": 0.0396,
      "monthly": 28.91,
      "details": {
        "cpu": "2 vCPU",
        "memory": "8 GB",
        "storage": "20 GB included",
        "engine": "Db2"
      }
    },
    "cloudant": {
      "monthly_per_gb": 0.21,
      "read": 0.00005,
      "write": 0.0001,
      "details": {
        "global_distribution": true,
        "multi_master": true,
        "search_capability": "Built-in"
      }
    }
  },
  "oracle": {
    "mysql_basic": {
      "hourly": 0.028,
      "monthly": 20.44,
      "details": {
        "cpu": "1 OCPU",
        "memory": "8 GB",
        "storage": "50 GB included",
        "engine": "MySQL"
      }
    },
    "autonomous_transaction": {
      "hourly": 0.06,
      "monthly": 43.8,
      "details": {
        "self_tuning": true,
        "self_securing": true,
        "oracle_features": "full access",
        "automatic_backups": "Included"
      }
    }
  },
  "alibaba": {
    "rds_mysql_basic": {
      "hourly": 0.025,
      "monthly": 18.25,
      "details": {
        "cpu": "2 vCPU",
        "memory": "4 GB",
        "storage": "20 GB included",
        "engine": "MySQL"
      }
    },
    "tablestore": {
      "monthly_per_gb": 0.23,
      "read_cu": 0.0002,
      "write_cu": 0.0015,
      "details": {
        "global_index": true,
        "search_capability": true,
        "time_to_live": "Configurable",
        "auto_scaling": "Supported"
      }
    }
  }
};

// Write data files
fs.writeFileSync(path.join(dataDir, 'aws-compute.json'), JSON.stringify(awsComputePricing, null, 2));
fs.writeFileSync(path.join(dataDir, 'azure-compute.json'), JSON.stringify(azureComputePricing, null, 2));
fs.writeFileSync(path.join(dataDir, 'gcp-compute.json'), JSON.stringify(gcpComputePricing, null, 2));
fs.writeFileSync(path.join(dataDir, 'ibm-compute.json'), JSON.stringify(ibmComputePricing, null, 2));
fs.writeFileSync(path.join(dataDir, 'oracle-compute.json'), JSON.stringify(oracleComputePricing, null, 2));
fs.writeFileSync(path.join(dataDir, 'alibaba-compute.json'), JSON.stringify(alibabaComputePricing, null, 2));
fs.writeFileSync(path.join(dataDir, 'storage.json'), JSON.stringify(storagePricing, null, 2));
fs.writeFileSync(path.join(dataDir, 'database.json'), JSON.stringify(databasePricing, null, 2));

console.log('Successfully generated all pricing data files in', dataDir);

// Helper function to calculate monthly from hourly
function calculateMonthly(hourly) {
  return Math.round(hourly * 730 * 100) / 100; // 730 hours in a month, rounded to 2 decimal places
}

// Usage example
console.log('\nUsage Example:');
console.log('To update a specific provider\'s pricing data:');
console.log('1. Edit the corresponding data object in this script');
console.log('2. Run: node create-data-files.js');
console.log('3. The updated JSON files will be generated in the data/pricing directory');