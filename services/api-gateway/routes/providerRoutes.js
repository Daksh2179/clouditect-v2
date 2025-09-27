const express = require('express');
const router = express.Router();
const axios = require('axios');

const PROVIDER_SERVICE_URL = process.env.PROVIDER_SERVICE_URL || 'http://localhost:4003';

/**
 * @swagger
 * /api/providers:
 *   get:
 *     summary: Get all cloud providers
 *     tags: [Providers]
 *     responses:
 *       200:
 *         description: List of providers
 */
router.get('/', async (req, res) => {
  try {
    // If provider service is available, forward the request
    try {
      const response = await axios.get(`${PROVIDER_SERVICE_URL}/providers`, {
        headers: { 'X-Request-ID': req.requestId },
        timeout: 5000
      });
      res.json(response.data);
    } catch (serviceError) {
      // Fallback if provider service is not available
      res.json({
        providers: ['aws', 'azure', 'gcp'],
        message: 'Using fallback data',
        requestId: req.requestId
      });
    }
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch providers',
      requestId: req.requestId 
    });
  }
});

/**
 * @swagger
 * /api/providers/{provider}/regions:
 *   get:
 *     summary: Get regions for a provider
 *     tags: [Providers]
 */
router.get('/:provider/regions', async (req, res) => {
  const { provider } = req.params;
  
  try {
    try {
      const response = await axios.get(`${PROVIDER_SERVICE_URL}/providers/${provider}/regions`, {
        headers: { 'X-Request-ID': req.requestId },
        timeout: 5000
      });
      res.json(response.data);
    } catch (serviceError) {
      // Fallback regions
      const fallbackRegions = {
        aws: ['us-east-1', 'us-west-2', 'eu-west-1'],
        azure: ['East US', 'West US', 'North Europe'],
        gcp: ['us-central1', 'us-west1', 'europe-west1']
      };
      
      res.json({
        provider,
        regions: fallbackRegions[provider] || [],
        message: 'Using fallback data',
        requestId: req.requestId
      });
    }
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch regions',
      requestId: req.requestId 
    });
  }
});

module.exports = router;