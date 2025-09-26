const axios = require('axios');
const winston = require('winston');
const Redis = require('ioredis');
const fs = require('fs');
const path = require('path');

// Local pricing models (fallback)
const localComputePricing = {
  aws: require('../models/awsComputePricing'),
  azure: require('../models/azureComputePricing'),
  gcp: require('../models/gcpComputePricing'),
  ibm: require('../models/ibmComputePricing'),
  oracle: require('../models/oracleComputePricing'),
  alibaba: require('../models/alibabaComputePricing'),
  // START MODIFICATION
  digitalocean: require('../models/digitaloceanComputePricing')
  // END MODIFICATION
};
// START MODIFICATION
const localStoragePricing = {
  aws: require('../models/storagePricing').aws,
  azure: require('../models/storagePricing').azure,
  gcp: require('../models/storagePricing').gcp,
  ibm: require('../models/storagePricing').ibm,
  oracle: require('../models/storagePricing').oracle,
  alibaba: require('../models/storagePricing').alibaba,
  digitalocean: require('../models/digitaloceanStoragePricing')
};
const localDatabasePricing = {
    aws: require('../models/databasePricing').aws,
    azure: require('../models/databasePricing').azure,
    gcp: require('../models/databasePricing').gcp,
    ibm: require('../models/databasePricing').ibm,
    oracle: require('../models/databasePricing').oracle,
    alibaba: require('../models/databasePricing').alibaba,
    digitalocean: require('../models/digitaloceanDatabasePricing')
};
// END MODIFICATION

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'cloud-pricing-client.log' })
  ]
});

// Initialize Redis client
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(REDIS_URL);

class CloudPricingClient {
  constructor() {
    this.apiKeys = {
      aws: process.env.AWS_PRICING_API_KEY || null,
      azure: process.env.AZURE_PRICING_API_KEY || null,
      gcp: process.env.GCP_PRICING_API_KEY || null,
      ibm: process.env.IBM_PRICING_API_KEY || null,
      oracle: process.env.ORACLE_PRICING_API_KEY || null,
      alibaba: process.env.ALIBABA_PRICING_API_KEY || null,
      // START MODIFICATION
      digitalocean: process.env.DIGITALOCEAN_PRICING_API_KEY || null
      // END MODIFICATION
    };
    
    this.apiUrls = {
      aws: 'https://pricing.us-east-1.amazonaws.com',
      azure: 'https://prices.azure.com/api/retail/prices',
      gcp: 'https://cloudbilling.googleapis.com/v1',
      ibm: 'https://api.ibm.cloud/v1/pricing',
      oracle: 'https://itra.oraclecloud.com/itas/.anon/myservices/api/v1/products',
      alibaba: 'https://business.aliyuncs.com/?Action=DescribePrice',
      // START MODIFICATION
      digitalocean: 'https://api.digitalocean.com/v2/sizes'
      // END MODIFICATION
    };
    
    // No API keys needed for AWS and Azure public endpoints
    this.useRealApis = process.env.USE_REAL_PRICING_APIS === 'true' || true; // Default to true since no auth needed
    this.fallbackToLocal = process.env.FALLBACK_TO_LOCAL_PRICING === 'true' || true;
    this.cacheTtl = parseInt(process.env.PRICING_CACHE_TTL || '86400'); // 24 hours default
  }
  
  /**
   * Get compute pricing for a specific provider and region
   */
  async getComputePricing(provider, region) {
    const cacheKey = `compute:${provider}:${region}`;
    
    try {
      // Try to get from cache first
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        logger.info(`Retrieved compute pricing from cache for ${provider} in ${region}`);
        return JSON.parse(cachedData);
      }
      
      // If real APIs are enabled and we have an API key, try to fetch from API
      if (this.useRealApis && this.apiKeys[provider]) {
        try {
          const apiData = await this._fetchComputePricingFromApi(provider, region);
          
          // Cache the result
          await redis.set(cacheKey, JSON.stringify(apiData), 'EX', this.cacheTtl);
          
          logger.info(`Retrieved compute pricing from API for ${provider} in ${region}`);
          return apiData;
        } catch (apiError) {
          logger.error(`Error fetching compute pricing from API: ${apiError.message}`);
          
          if (!this.fallbackToLocal) {
            throw apiError;
          }
          
          logger.info(`Falling back to local data for ${provider} compute pricing`);
        }
      }
      
      // Fallback to local data
      const localData = localComputePricing[provider]?.[region] || {};
      
      // Cache the local data too for faster retrieval
      await redis.set(cacheKey, JSON.stringify(localData), 'EX', this.cacheTtl);
      
      logger.info(`Using local compute pricing data for ${provider} in ${region}`);
      return localData;
    } catch (error) {
      logger.error(`Error in getComputePricing: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Get storage pricing for a specific provider
   */
  async getStoragePricing(provider) {
    const cacheKey = `storage:${provider}`;
    
    try {
      // Try to get from cache first
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        logger.info(`Retrieved storage pricing from cache for ${provider}`);
        return JSON.parse(cachedData);
      }
      
      // If real APIs are enabled and we have an API key, try to fetch from API
      if (this.useRealApis && this.apiKeys[provider]) {
        try {
          const apiData = await this._fetchStoragePricingFromApi(provider);
          
          // Cache the result
          await redis.set(cacheKey, JSON.stringify(apiData), 'EX', this.cacheTtl);
          
          logger.info(`Retrieved storage pricing from API for ${provider}`);
          return apiData;
        } catch (apiError) {
          logger.error(`Error fetching storage pricing from API: ${apiError.message}`);
          
          if (!this.fallbackToLocal) {
            throw apiError;
          }
          
          logger.info(`Falling back to local data for ${provider} storage pricing`);
        }
      }
      
      // Fallback to local data
      const localData = localStoragePricing[provider] || {};
      
      // Cache the local data too for faster retrieval
      await redis.set(cacheKey, JSON.stringify(localData), 'EX', this.cacheTtl);
      
      logger.info(`Using local storage pricing data for ${provider}`);
      return localData;
    } catch (error) {
      logger.error(`Error in getStoragePricing: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Get database pricing for a specific provider
   */
  async getDatabasePricing(provider) {
    const cacheKey = `database:${provider}`;
    
    try {
      // Try to get from cache first
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        logger.info(`Retrieved database pricing from cache for ${provider}`);
        return JSON.parse(cachedData);
      }
      
      // If real APIs are enabled and we have an API key, try to fetch from API
      if (this.useRealApis && this.apiKeys[provider]) {
        try {
          const apiData = await this._fetchDatabasePricingFromApi(provider);
          
          // Cache the result
          await redis.set(cacheKey, JSON.stringify(apiData), 'EX', this.cacheTtl);
          
          logger.info(`Retrieved database pricing from API for ${provider}`);
          return apiData;
        } catch (apiError) {
          logger.error(`Error fetching database pricing from API: ${apiError.message}`);
          
          if (!this.fallbackToLocal) {
            throw apiError;
          }
          
          logger.info(`Falling back to local data for ${provider} database pricing`);
        }
      }
      
      // Fallback to local data
      const localData = localDatabasePricing[provider] || {};
      
      // Cache the local data too for faster retrieval
      await redis.set(cacheKey, JSON.stringify(localData), 'EX', this.cacheTtl);
      
      logger.info(`Using local database pricing data for ${provider}`);
      return localData;
    } catch (error) {
      logger.error(`Error in getDatabasePricing: ${error.message}`);
      throw error;
    }
  }
  
  // Private method to fetch compute pricing from API
  async _fetchComputePricingFromApi(provider, region) {
    if (provider === 'aws') {
      return this._fetchAwsComputePricing(region);
    } else if (provider === 'azure') {
      return this._fetchAzureComputePricing(region);
    } else if (provider === 'gcp') {
      return this._fetchGcpComputePricing(region);
    } else if (provider === 'ibm') {
      return this._fetchIbmComputePricing(region);
    } else if (provider === 'oracle') {
      return this._fetchOracleComputePricing(region);
    } else if (provider === 'alibaba') {
      return this._fetchAlibabaComputePricing(region);
    }
// START MODIFICATION
    else if (provider === 'digitalocean') {
      return this._fetchDigitalOceanComputePricing(region);
    }
// END MODIFICATION
    
    throw new Error(`Unsupported provider: ${provider}`);
  }
  
  // Private method to fetch storage pricing from API
  async _fetchStoragePricingFromApi(provider) {
    if (provider === 'aws') {
      return this._fetchAwsStoragePricing();
    } else if (provider === 'azure') {
      return this._fetchAzureStoragePricing();
    } else if (provider === 'gcp') {
      return this._fetchGcpStoragePricing();
    } else if (provider === 'ibm') {
      return this._fetchIbmStoragePricing();
    } else if (provider === 'oracle') {
      return this._fetchOracleStoragePricing();
    } else if (provider === 'alibaba') {
      return this._fetchAlibabaStoragePricing();
    }
// START MODIFICATION
    else if (provider === 'digitalocean') {
        return this._fetchDigitalOceanStoragePricing();
    }
// END MODIFICATION
    
    throw new Error(`Unsupported provider: ${provider}`);
  }
  
  // Private method to fetch database pricing from API
  async _fetchDatabasePricingFromApi(provider) {
    if (provider === 'aws') {
      return this._fetchAwsDatabasePricing();
    } else if (provider === 'azure') {
      return this._fetchAzureDatabasePricing();
    } else if (provider === 'gcp') {
      return this._fetchGcpDatabasePricing();
    } else if (provider === 'ibm') {
      return this._fetchIbmDatabasePricing();
    } else if (provider === 'oracle') {
      return this._fetchOracleDatabasePricing();
    } else if (provider === 'alibaba') {
      return this._fetchAlibabaDatabasePricing();
    }
// START MODIFICATION
    else if (provider === 'digitalocean') {
        return this._fetchDigitalOceanDatabasePricing();
    }
// END MODIFICATION
    
    throw new Error(`Unsupported provider: ${provider}`);
  }
  
  // ... (existing provider-specific API calls)

// START MODIFICATION
  // DigitalOcean-specific API calls
    async _fetchDigitalOceanComputePricing(region) {
        try {
        logger.info(`Using fallback data for DigitalOcean compute pricing in ${region}`);
        return localComputePricing.digitalocean[region] || {};
        } catch (error) {
        logger.error(`Error fetching DigitalOcean compute pricing: ${error.message}`);
        throw error;
        }
    }
    
    async _fetchDigitalOceanStoragePricing() {
        return localStoragePricing.digitalocean;
    }
    
    async _fetchDigitalOceanDatabasePricing() {
        return localDatabasePricing.digitalocean;
    }
// END MODIFICATION
}

module.exports = new CloudPricingClient();