import axios from 'axios';
import simulateApi from '../utils/simulateApi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const USE_SIMULATION = true; // Set to false to use real API when available

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add a longer timeout
  timeout: 10000 // 10 seconds
});

// Handle response errors
api.interceptors.response.use(
  response => response,
  error => {
    // Log and handle errors
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Generic API request function with simulation fallback
const makeRequest = async (apiMethod, simulationMethod, ...args) => {
  // Use simulation if enabled
  if (USE_SIMULATION) {
    console.log('Using simulation for:', apiMethod);
    return simulationMethod(...args);
  }
  
  // Try real API first
  try {
    return await apiMethod(...args);
  } catch (error) {
    console.error(`API call failed, using simulation fallback: ${error.message}`);
    // Fall back to simulation if real API fails
    return simulationMethod(...args);
  }
};

// API functions
const apiService = {
  // Provider Service
  getProviders: () => makeRequest(
    () => api.get('/api/providers'), 
    simulateApi.getProviders
  ),
  
  getProviderDetails: (providerId) => makeRequest(
    () => api.get(`/api/providers/${providerId}`), 
    () => simulateApi.getProviderDetails(providerId)
  ),
  
  getRegions: (providerId) => makeRequest(
    () => api.get(`/api/providers/${providerId}/regions`), 
    () => simulateApi.getRegions(providerId)
  ),
  
  getServiceMappings: () => makeRequest(
    () => api.get('/api/service-mappings'), 
    simulateApi.getServiceMappings
  ),
  
  // Pricing Service
  calculatePricing: (workload) => makeRequest(
    () => api.post('/api/pricing', workload), 
    () => simulateApi.calculatePricing(workload)
  ),
  
  getInstanceTypes: (provider, region) => makeRequest(
    () => api.get(`/api/pricing/instances?provider=${provider}${region ? `&region=${region}` : ''}`), 
    () => Promise.resolve({ data: {} }) // Simple empty fallback
  ),
  
  // Recommendation Service
  getRecommendations: (workload) => makeRequest(
    () => api.post('/api/recommendations', workload), 
    () => simulateApi.getRecommendations(workload)
  ),
};

export default apiService;