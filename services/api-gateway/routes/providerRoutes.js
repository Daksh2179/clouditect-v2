const express = require('express');
const axios = require('axios');
const router = express.Router();

// Provider service URL from environment variables
const PROVIDER_SERVICE_URL = process.env.PROVIDER_SERVICE_URL || 'http://localhost:4003';

// List all providers
router.get('/', async (req, res, next) => {
  try {
    const response = await axios.get(`${PROVIDER_SERVICE_URL}/list`);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

// Get provider details
router.get('/:id', async (req, res, next) => {
  try {
    const providerId = req.params.id;
    
    // Validate provider ID
    if (!['aws', 'azure', 'gcp', 'ibm', 'oracle', 'alibaba'].includes(providerId)) {
      return res.status(400).json({ error: 'Invalid provider ID' });
    }
    
    const response = await axios.get(`${PROVIDER_SERVICE_URL}/provider/${providerId}`);
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    next(error);
  }
});

// Get provider regions
router.get('/:id/regions', async (req, res, next) => {
  try {
    const providerId = req.params.id;
    
    // Validate provider ID
    if (!['aws', 'azure', 'gcp', 'ibm', 'oracle', 'alibaba'].includes(providerId)) {
      return res.status(400).json({ error: 'Invalid provider ID' });
    }
    
    const response = await axios.get(`${PROVIDER_SERVICE_URL}/provider/${providerId}/regions`);
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Provider or regions not found' });
    }
    next(error);
  }
});

// Get service mappings
router.get('/service-mappings', async (req, res, next) => {
  try {
    const response = await axios.get(`${PROVIDER_SERVICE_URL}/service-mappings`);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

// Get specific service mapping
router.get('/service-mappings/:service', async (req, res, next) => {
  try {
    const serviceType = req.params.service;
    const response = await axios.get(`${PROVIDER_SERVICE_URL}/equivalent-services/${serviceType}`);
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Service mapping not found' });
    }
    next(error);
  }
});

// Get instance mappings
router.get('/instance-mappings', async (req, res, next) => {
  try {
    const response = await axios.get(`${PROVIDER_SERVICE_URL}/instance-mappings`);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

// Get specific instance size mapping
router.get('/instance-mappings/:size', async (req, res, next) => {
  try {
    const size = req.params.size;
    const response = await axios.get(`${PROVIDER_SERVICE_URL}/equivalent-instances/${size}`);
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Instance size mapping not found' });
    }
    next(error);
  }
});

// Get provider characteristics
router.get('/:id/characteristics', async (req, res, next) => {
  try {
    const providerId = req.params.id;
    
    // Validate provider ID
    if (!['aws', 'azure', 'gcp', 'ibm', 'oracle', 'alibaba'].includes(providerId)) {
      return res.status(400).json({ error: 'Invalid provider ID' });
    }
    
    const response = await axios.get(`${PROVIDER_SERVICE_URL}/provider/${providerId}/characteristics`);
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Provider characteristics not found' });
    }
    next(error);
  }
});

// Compare providers for a specific feature
router.get('/compare/:feature', async (req, res, next) => {
  try {
    const feature = req.params.feature;
    const providers = req.query.providers ? req.query.providers.split(',') : ['aws', 'azure', 'gcp', 'ibm', 'oracle', 'alibaba'];
    
    // Validate providers
    const invalidProviders = providers.filter(p => !['aws', 'azure', 'gcp', 'ibm', 'oracle', 'alibaba'].includes(p));
    if (invalidProviders.length > 0) {
      return res.status(400).json({ error: `Invalid provider IDs: ${invalidProviders.join(', ')}` });
    }
    
    const response = await axios.get(`${PROVIDER_SERVICE_URL}/compare/${feature}?providers=${providers.join(',')}`);
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Feature comparison not found' });
    }
    next(error);
  }
});

module.exports = router;