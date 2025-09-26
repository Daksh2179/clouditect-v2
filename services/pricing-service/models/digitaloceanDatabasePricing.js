// services/pricing-service/models/digitaloceanDatabasePricing.js

const digitaloceanDatabasePricing = {
    "managed-mysql": {
        "db-s-1vcpu-1gb": {
            "hourly": 0.02232,
            "monthly": 15,
            "details": {
                "vcpu": 1,
                "memory": "1 GB",
                "storage": "10 GB",
                "engine": "MySQL"
            }
        }
    },
    "managed-redis": {
        "db-s-1vcpu-1gb": {
            "hourly": 0.02232,
            "monthly": 15,
            "details": {
                "vcpu": 1,
                "memory": "1 GB",
                "storage": "10 GB",
                "engine": "Redis"
            }
        }
    }
};

module.exports = digitaloceanDatabasePricing;