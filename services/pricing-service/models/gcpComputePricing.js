// Sample GCP compute pricing data
const gcpComputePricing = {
  'us-central1': {
    'e2-micro': { hourly: 0.0105, monthly: 7.67, vcpu: 0.25, memory: 1 },
    'e2-small': { hourly: 0.021, monthly: 15.33, vcpu: 0.5, memory: 2 },
    'e2-medium': { hourly: 0.042, monthly: 30.66, vcpu: 1, memory: 4 },
    'n1-standard-1': { hourly: 0.0475, monthly: 34.68, vcpu: 1, memory: 3.75 },
    'n1-standard-2': { hourly: 0.095, monthly: 69.35, vcpu: 2, memory: 7.5 },
    'c2-standard-4': { hourly: 0.2088, monthly: 152.42, vcpu: 4, memory: 16 }
  },
  'us-west1': {
    'e2-micro': { hourly: 0.0105, monthly: 7.67, vcpu: 0.25, memory: 1 },
    'e2-small': { hourly: 0.021, monthly: 15.33, vcpu: 0.5, memory: 2 },
    'e2-medium': { hourly: 0.042, monthly: 30.66, vcpu: 1, memory: 4 },
    'n1-standard-1': { hourly: 0.0475, monthly: 34.68, vcpu: 1, memory: 3.75 },
    'n1-standard-2': { hourly: 0.095, monthly: 69.35, vcpu: 2, memory: 7.5 },
    'c2-standard-4': { hourly: 0.2088, monthly: 152.42, vcpu: 4, memory: 16 }
  },
  'europe-west1': {
    'e2-micro': { hourly: 0.0115, monthly: 8.40, vcpu: 0.25, memory: 1 },
    'e2-small': { hourly: 0.023, monthly: 16.79, vcpu: 0.5, memory: 2 },
    'e2-medium': { hourly: 0.046, monthly: 33.58, vcpu: 1, memory: 4 },
    'n1-standard-1': { hourly: 0.052, monthly: 37.96, vcpu: 1, memory: 3.75 },
    'n1-standard-2': { hourly: 0.104, monthly: 75.92, vcpu: 2, memory: 7.5 },
    'c2-standard-4': { hourly: 0.2297, monthly: 167.68, vcpu: 4, memory: 16 }
  },
  'asia-east1': {
    'e2-micro': { hourly: 0.0127, monthly: 9.27, vcpu: 0.25, memory: 1 },
    'e2-small': { hourly: 0.0253, monthly: 18.47, vcpu: 0.5, memory: 2 },
    'e2-medium': { hourly: 0.0507, monthly: 37.01, vcpu: 1, memory: 4 },
    'n1-standard-1': { hourly: 0.057, monthly: 41.61, vcpu: 1, memory: 3.75 },
    'n1-standard-2': { hourly: 0.114, monthly: 83.22, vcpu: 2, memory: 7.5 },
    'c2-standard-4': { hourly: 0.2525, monthly: 184.33, vcpu: 4, memory: 16 }
  },
  'asia-south1': {
    'e2-micro': { hourly: 0.0127, monthly: 9.27, vcpu: 0.25, memory: 1 },
    'e2-small': { hourly: 0.0253, monthly: 18.47, vcpu: 0.5, memory: 2 },
    'e2-medium': { hourly: 0.0507, monthly: 37.01, vcpu: 1, memory: 4 },
    'n1-standard-1': { hourly: 0.057, monthly: 41.61, vcpu: 1, memory: 3.75 },
    'n1-standard-2': { hourly: 0.114, monthly: 83.22, vcpu: 2, memory: 7.5 },
    'c2-standard-4': { hourly: 0.2525, monthly: 184.33, vcpu: 4, memory: 16 }
  }
};

module.exports = gcpComputePricing;