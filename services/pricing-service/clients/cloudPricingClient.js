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
  digitalocean: require('../models/digitaloceanComputePricing')
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

const memoryCache = {};
const redis = {
  get: async (key) => memoryCache[key] || null,
  set: async (key, value) => {
    memoryCache[key] = value;
    return 'OK';
  },
};

class CloudPricingClient {
  constructor() {
    this.apiKeys = {
      aws: process.env.AWS_PRICING_API_KEY || null,
      azure: process.env.AZURE_PRICING_API_KEY || null,
      gcp: process.env.GCP_PRICING_API_KEY || null,
      ibm: process.env.IBM_PRICING_API_KEY || null,
      oracle: process.env.ORACLE_PRICING_API_KEY || null,
      alibaba: process.env.ALIBABA_PRICING_API_KEY || null,
      digitalocean: process.env.DIGITALOCEAN_PRICING_API_KEY || null
    };
    
    this.apiUrls = {
      aws: 'https://pricing.us-east-1.amazonaws.com',
      azure: 'https://prices.azure.com/api/retail/prices',
      gcp: 'https://cloudbilling.googleapis.com/v1',
      ibm: 'https://api.ibm.cloud/v1/pricing',
      oracle: 'https://itra.oraclecloud.com/itas/.anon/myservices/api/v1/products',
      alibaba: 'https://business.aliyuncs.com/?Action=DescribePrice',
      digitalocean: 'https://api.digitalocean.com/v2/sizes'
    };
    
    this.useRealApis = process.env.USE_REAL_PRICING_APIS === 'true' || true;
    this.fallbackToLocal = process.env.FALLBACK_TO_LOCAL_PRICING === 'true' || true;
    this.cacheTtl = parseInt(process.env.PRICING_CACHE_TTL || '86400');
  }
  
  /**
   * Get compute pricing for a specific provider and region
   */
  async getComputePricing(provider, region) {
    const cacheKey = `compute:${provider}:${region}`;
    
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        logger.info(`Retrieved compute pricing from cache for ${provider} in ${region}`);
        return JSON.parse(cachedData);
      }
      
      if (this.useRealApis && this.apiKeys[provider]) {
        try {
          const apiData = await this._fetchComputePricingFromApi(provider, region);
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
      
      const localData = localComputePricing[provider]?.[region] || {};
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
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        logger.info(`Retrieved storage pricing from cache for ${provider}`);
        return JSON.parse(cachedData);
      }
      
      if (this.useRealApis && this.apiKeys[provider]) {
        try {
          const apiData = await this._fetchStoragePricingFromApi(provider);
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
      
      const localData = localStoragePricing[provider] || {};
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
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        logger.info(`Retrieved database pricing from cache for ${provider}`);
        return JSON.parse(cachedData);
      }
      
      if (this.useRealApis && this.apiKeys[provider]) {
        try {
          const apiData = await this._fetchDatabasePricingFromApi(provider);
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
      
      const localData = localDatabasePricing[provider] || {};
      await redis.set(cacheKey, JSON.stringify(localData), 'EX', this.cacheTtl);
      logger.info(`Using local database pricing data for ${provider}`);
      return localData;
    } catch (error) {
      logger.error(`Error in getDatabasePricing: ${error.message}`);
      throw error;
    }
  }
  
  async _fetchComputePricingFromApi(provider, region) {
    if (provider === 'digitalocean') {
      return this._fetchDigitalOceanComputePricing(region);
    }
    throw new Error(`Unsupported provider: ${provider}`);
  }
  
  async _fetchStoragePricingFromApi(provider) {
    if (provider === 'digitalocean') {
        return this._fetchDigitalOceanStoragePricing();
    }
    throw new Error(`Unsupported provider: ${provider}`);
  }
  
  async _fetchDatabasePricingFromApi(provider) {
    if (provider === 'digitalocean') {
        return this._fetchDigitalOceanDatabasePricing();
    }
    throw new Error(`Unsupported provider: ${provider}`);
  }

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
}

module.exports = new CloudPricingClient();