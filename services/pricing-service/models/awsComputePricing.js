// Sample AWS compute pricing data
const awsComputePricing = {
  'us-east-1': {
    't2.micro': { hourly: 0.0116, monthly: 8.47, vcpu: 1, memory: 1 },
    't2.small': { hourly: 0.023, monthly: 16.79, vcpu: 1, memory: 2 },
    't2.medium': { hourly: 0.0464, monthly: 33.87, vcpu: 2, memory: 4 },
    't2.large': { hourly: 0.0928, monthly: 67.74, vcpu: 2, memory: 8 },
    'm5.large': { hourly: 0.096, monthly: 70.08, vcpu: 2, memory: 8 },
    'c5.large': { hourly: 0.085, monthly: 62.05, vcpu: 2, memory: 4 },
    'r5.large': { hourly: 0.126, monthly: 91.98, vcpu: 2, memory: 16 }
  },
  'us-west-2': {
    't2.micro': { hourly: 0.0116, monthly: 8.47, vcpu: 1, memory: 1 },
    't2.small': { hourly: 0.023, monthly: 16.79, vcpu: 1, memory: 2 },
    't2.medium': { hourly: 0.0464, monthly: 33.87, vcpu: 2, memory: 4 },
    't2.large': { hourly: 0.0928, monthly: 67.74, vcpu: 2, memory: 8 },
    'm5.large': { hourly: 0.096, monthly: 70.08, vcpu: 2, memory: 8 },
    'c5.large': { hourly: 0.085, monthly: 62.05, vcpu: 2, memory: 4 },
    'r5.large': { hourly: 0.126, monthly: 91.98, vcpu: 2, memory: 16 }
  },
  'eu-west-1': {
    't2.micro': { hourly: 0.0126, monthly: 9.20, vcpu: 1, memory: 1 },
    't2.small': { hourly: 0.025, monthly: 18.25, vcpu: 1, memory: 2 },
    't2.medium': { hourly: 0.050, monthly: 36.50, vcpu: 2, memory: 4 },
    't2.large': { hourly: 0.101, monthly: 73.73, vcpu: 2, memory: 8 },
    'm5.large': { hourly: 0.106, monthly: 77.38, vcpu: 2, memory: 8 },
    'c5.large': { hourly: 0.093, monthly: 67.89, vcpu: 2, memory: 4 },
    'r5.large': { hourly: 0.138, monthly: 100.74, vcpu: 2, memory: 16 }
  },
  'ap-south-1': {
    't2.micro': { hourly: 0.0127, monthly: 9.27, vcpu: 1, memory: 1 },
    't2.small': { hourly: 0.025, monthly: 18.25, vcpu: 1, memory: 2 },
    't2.medium': { hourly: 0.051, monthly: 37.23, vcpu: 2, memory: 4 },
    't2.large': { hourly: 0.101, monthly: 73.73, vcpu: 2, memory: 8 },
    'm5.large': { hourly: 0.106, monthly: 77.38, vcpu: 2, memory: 8 },
    'c5.large': { hourly: 0.093, monthly: 67.89, vcpu: 2, memory: 4 },
    'r5.large': { hourly: 0.138, monthly: 100.74, vcpu: 2, memory: 16 }
  },
  'ap-northeast-1': {
    't2.micro': { hourly: 0.0138, monthly: 10.07, vcpu: 1, memory: 1 },
    't2.small': { hourly: 0.027, monthly: 19.71, vcpu: 1, memory: 2 },
    't2.medium': { hourly: 0.055, monthly: 40.15, vcpu: 2, memory: 4 },
    't2.large': { hourly: 0.110, monthly: 80.30, vcpu: 2, memory: 8 },
    'm5.large': { hourly: 0.113, monthly: 82.49, vcpu: 2, memory: 8 },
    'c5.large': { hourly: 0.100, monthly: 73.00, vcpu: 2, memory: 4 },
    'r5.large': { hourly: 0.148, monthly: 108.04, vcpu: 2, memory: 16 }
  }
};

module.exports = awsComputePricing;