// Oracle Cloud compute pricing model
module.exports = {
  'us-ashburn-1': {
    "VM.Standard.E3.Flex.2.8": {
      "hourly": 0.0868,
      "monthly": 63.36,
      "vcpu": 2,
      "memory": 8
    },
    "VM.Standard.E3.Flex.4.16": {
      "hourly": 0.1736,
      "monthly": 126.73,
      "vcpu": 4,
      "memory": 16
    },
    "VM.Standard.E3.Flex.8.32": {
      "hourly": 0.3472,
      "monthly": 253.46,
      "vcpu": 8,
      "memory": 32
    },
    "VM.Standard.E4.Flex.2.16": {
      "hourly": 0.1112,
      "monthly": 81.18,
      "vcpu": 2,
      "memory": 16
    },
    "VM.Optimized3.Flex.2.4": {
      "hourly": 0.092,
      "monthly": 67.16,
      "vcpu": 2,
      "memory": 4
    }
  }
};