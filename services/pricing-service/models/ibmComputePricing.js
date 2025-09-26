// IBM Cloud compute pricing model
module.exports = {
  'us-south': {
    "bx2-2x8": {
      "hourly": 0.0996,
      "monthly": 72.71,
      "vcpu": 2,
      "memory": 8
    },
    "bx2-4x16": {
      "hourly": 0.1992,
      "monthly": 145.42,
      "vcpu": 4,
      "memory": 16
    },
    "bx2-8x32": {
      "hourly": 0.3984,
      "monthly": 290.83,
      "vcpu": 8,
      "memory": 32
    },
    "cx2-2x4": {
      "hourly": 0.0944,
      "monthly": 68.91,
      "vcpu": 2,
      "memory": 4
    },
    "mx2-2x16": {
      "hourly": 0.1312,
      "monthly": 95.78,
      "vcpu": 2,
      "memory": 16
    },
    "mx2-4x32": {
      "hourly": 0.2624,
      "monthly": 191.55,
      "vcpu": 4,
      "memory": 32
    }
  }
};