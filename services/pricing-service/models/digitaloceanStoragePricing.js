// services/pricing-service/models/digitaloceanStoragePricing.js

const digitaloceanStoragePricing = {
    "spaces": {
        "monthly_per_gb": 0.02,
        "details": {
            "min_storage_duration": "None",
            "availability": "99.99%",
            "api_requests": "Free"
        }
    },
    "volumes": {
        "monthly_per_gb": 0.10,
        "details": {
            "iops_included": "Dependent on size",
            "max_volume_size": "16 TiB",
            "burst_capability": "No"
        }
    }
};

module.exports = digitaloceanStoragePricing;