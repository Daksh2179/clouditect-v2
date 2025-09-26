// Sample Azure compute pricing data
const azureComputePricing = {
  'eastus': {
    'B1S': { hourly: 0.0104, monthly: 7.59, vcpu: 1, memory: 1 },
    'B2S': { hourly: 0.0416, monthly: 30.37, vcpu: 2, memory: 4 },
    'D2s_v3': { hourly: 0.096, monthly: 70.08, vcpu: 2, memory: 8 },
    'F2s_v2': { hourly: 0.085, monthly: 62.05, vcpu: 2, memory: 4 },
    'E2s_v3': { hourly: 0.126, monthly: 91.98, vcpu: 2, memory: 16 }
  },
  'westus2': {
    'B1S': { hourly: 0.0104, monthly: 7.59, vcpu: 1, memory: 1 },
    'B2S': { hourly: 0.0416, monthly: 30.37, vcpu: 2, memory: 4 },
    'D2s_v3': { hourly: 0.096, monthly: 70.08, vcpu: 2, memory: 8 },
    'F2s_v2': { hourly: 0.085, monthly: 62.05, vcpu: 2, memory: 4 },
    'E2s_v3': { hourly: 0.126, monthly: 91.98, vcpu: 2, memory: 16 }
  },
  'westeurope': {
    'B1S': { hourly: 0.0113, monthly: 8.25, vcpu: 1, memory: 1 },
    'B2S': { hourly: 0.0453, monthly: 33.07, vcpu: 2, memory: 4 },
    'D2s_v3': { hourly: 0.110, monthly: 80.30, vcpu: 2, memory: 8 },
    'F2s_v2': { hourly: 0.0977, monthly: 71.32, vcpu: 2, memory: 4 },
    'E2s_v3': { hourly: 0.146, monthly: 106.58, vcpu: 2, memory: 16 }
  },
  'southeastasia': {
    'B1S': { hourly: 0.0113, monthly: 8.25, vcpu: 1, memory: 1 },
    'B2S': { hourly: 0.0453, monthly: 33.07, vcpu: 2, memory: 4 },
    'D2s_v3': { hourly: 0.110, monthly: 80.30, vcpu: 2, memory: 8 },
    'F2s_v2': { hourly: 0.0977, monthly: 71.32, vcpu: 2, memory: 4 },
    'E2s_v3': { hourly: 0.146, monthly: 106.58, vcpu: 2, memory: 16 }
  },
  'centralindia': {
    'B1S': { hourly: 0.0110, monthly: 8.03, vcpu: 1, memory: 1 },
    'B2S': { hourly: 0.0440, monthly: 32.12, vcpu: 2, memory: 4 },
    'D2s_v3': { hourly: 0.106, monthly: 77.38, vcpu: 2, memory: 8 },
    'F2s_v2': { hourly: 0.0943, monthly: 68.84, vcpu: 2, memory: 4 },
    'E2s_v3': { hourly: 0.141, monthly: 102.93, vcpu: 2, memory: 16 }
  }
};

module.exports = azureComputePricing;