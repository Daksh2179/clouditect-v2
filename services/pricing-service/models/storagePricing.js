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

module.exports = storagePricing;