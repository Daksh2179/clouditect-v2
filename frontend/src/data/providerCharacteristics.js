// Provider technical characteristics
const providerCharacteristics = {
  // AWS characteristics
  aws: {
    business: {
      costStructure: {
        title: "Flexible Pay-as-you-go",
        description: "Granular billing with per-second charging, no minimum commitments",
        details: ["Volume discounts available", "Savings Plans for compute", "Reserved Instances for predictable workloads"]
      },
      compliance: {
        title: "Comprehensive Compliance",
        description: "Certified for all major global regulations and standards",
        certifications: ["PCI DSS", "HIPAA", "FedRAMP", "GDPR", "ISO 27001", "SOC 1/2/3"]
      },
      globalPresence: {
        title: "Extensive Global Presence",
        description: "Widest global footprint with 25+ regions and 80+ availability zones",
        regions: ["North America", "South America", "Europe", "Middle East", "Africa", "Asia Pacific"]
      },
      support: {
        title: "Tiered Support Options",
        description: "Multiple support tiers with increasing coverage and response times",
        tiers: ["Basic", "Developer", "Business", "Enterprise"]
      }
    },
    technical: {
      architecture: {
        title: "Microservices-Oriented",
        description: "Comprehensive service mesh capabilities (App Mesh, Cloud Map)",
        strength: 5
      },
      deployment: {
        title: "Granular IAM Policies",
        description: "Resource-level permissions for precise access control",
        strength: 5
      },
      developer: {
        title: "Comprehensive Infrastructure as Code",
        description: "CloudFormation and CDK with drift detection",
        strength: 5
      },
      ecosystem: {
        title: "Mature Lambda Ecosystem",
        description: "Advanced event-sourcing patterns and step functions for orchestration",
        strength: 5
      },
      performance: {
        title: "Graviton3 ARM-based Processors",
        description: "25% better compute performance at lower cost than x86",
        strength: 4
      },
      uniqueServices: ["Ground Station (satellite)", "Braket (quantum computing)", "SageMaker (ML ops)"]
    }
  },
  
  // Azure characteristics
  azure: {
    business: {
      costStructure: {
        title: "Enterprise Agreements",
        description: "Integration with existing Microsoft agreements and licenses",
        details: ["Azure Hybrid Benefit for Windows", "Reserved Instances", "Dev/Test pricing"]
      },
      compliance: {
        title: "Strong Enterprise Compliance",
        description: "Industry-leading compliance with focus on government and regulated industries",
        certifications: ["PCI DSS", "HIPAA", "FedRAMP", "GDPR", "ISO 27001", "SOC 1/2/3"]
      },
      globalPresence: {
        title: "Broad Global Presence",
        description: "60+ regions, including specialized government regions",
        regions: ["North America", "South America", "Europe", "Middle East", "Africa", "Asia Pacific"]
      },
      support: {
        title: "Enterprise-focused Support",
        description: "Integration with existing Microsoft support agreements",
        tiers: ["Basic", "Developer", "Standard", "Professional Direct", "Premier"]
      }
    },
    technical: {
      architecture: {
        title: "Hybrid-Cloud Focused",
        description: "Azure Arc for consistent management across environments",
        strength: 5
      },
      deployment: {
        title: "Active Directory Integration",
        description: "Conditional access policies for enterprise identity",
        strength: 5
      },
      developer: {
        title: ".NET and Visual Studio Integration",
        description: "Comprehensive integration with Azure DevOps pipelines",
        strength: 5
      },
      ecosystem: {
        title: "Windows Container Support",
        description: "Best-in-class Windows-Linux interoperability",
        strength: 5
      },
      performance: {
        title: "Azure Ultra Disk",
        description: "Up to 64 TB of storage with 160,000 IOPS",
        strength: 4
      },
      uniqueServices: ["Azure Synapse (unified analytics)", "Microsoft Mesh (mixed reality)", "Azure Quantum"]
    }
  },
  
  // GCP characteristics
  gcp: {
    business: {
      costStructure: {
        title: "Simplified Billing",
        description: "Automatic sustained use discounts, no upfront commitments required",
        details: ["Committed use discounts", "Per-second billing", "Automatic discounts for sustained use"]
      },
      compliance: {
        title: "Strong Security Focus",
        description: "Leverages Google's global security infrastructure",
        certifications: ["PCI DSS", "HIPAA", "FedRAMP", "GDPR", "ISO 27001", "SOC 1/2/3"]
      },
      globalPresence: {
        title: "Strategic Global Presence",
        description: "Fewer regions but with strategic locations and Google's private network",
        regions: ["North America", "South America", "Europe", "Asia Pacific"]
      },
      support: {
        title: "Technical-focused Support",
        description: "Support designed for technical organizations",
        tiers: ["Basic", "Standard", "Enhanced", "Premium"]
      }
    },
    technical: {
      architecture: {
        title: "Data Analytics-Oriented",
        description: "BigQuery, Dataflow and Pub/Sub native integration",
        strength: 5
      },
      deployment: {
        title: "Global VPC",
        description: "Single-tier networking, avoiding regional network boundaries",
        strength: 4
      },
      developer: {
        title: "Container-Native Platform",
        description: "GKE Autopilot zero-ops Kubernetes",
        strength: 5
      },
      ecosystem: {
        title: "Big Data Processing",
        description: "Most performant Spark and Hadoop integration",
        strength: 5
      },
      performance: {
        title: "Custom Machine Types",
        description: "Exact vCPU/memory specifications for workload optimization",
        strength: 4
      },
      uniqueServices: ["Spanner (globally consistent database)", "Dataflow (stream/batch processing)", "Vertex AI"]
    }
  },
  
  // IBM characteristics
  ibm: {
    business: {
      costStructure: {
        title: "Enterprise-Focused Pricing",
        description: "Volume discounts with enterprise agreements",
        details: ["Consumption-based pricing", "Reserved Virtual Servers", "Enterprise licensing options"]
      },
      compliance: {
        title: "Regulated Industry Focus",
        description: "Strong focus on finance, healthcare, and government compliance",
        certifications: ["PCI DSS", "HIPAA", "FedRAMP", "GDPR", "ISO 27001", "SOC 1/2/3", "Financial Services Framework"]
      },
      globalPresence: {
        title: "Strategic Enterprise Locations",
        description: "Regions focused on enterprise and regulated markets",
        regions: ["North America", "Europe", "Asia Pacific", "South America"]
      },
      support: {
        title: "Premium Enterprise Support",
        description: "Dedicated technical account managers and consultative services",
        tiers: ["Basic", "Advanced", "Premium"]
      }
    },
    technical: {
      architecture: {
        title: "Enterprise Modernization",
        description: "OpenShift-based containerization paths for legacy workloads",
        strength: 4
      },
      deployment: {
        title: "Bare Metal to Virtual Continuum",
        description: "Consistent management plane across deployment models",
        strength: 4
      },
      developer: {
        title: "Cloud Pak Frameworks",
        description: "Industry-specific solution development (finance, healthcare)",
        strength: 3
      },
      ecosystem: {
        title: "Watson AI Services",
        description: "Deeply integrated into application development workflow",
        strength: 5
      },
      performance: {
        title: "High-Performance Bare Metal",
        description: "Custom hardware options (GPU, FPGA)",
        strength: 4
      },
      uniqueServices: ["Code Engine (serverless Kubernetes)", "Satellite (distributed cloud)", "Cloudant (NoSQL at scale)"]
    }
  },
  
  // Oracle characteristics
  oracle: {
    business: {
      costStructure: {
        title: "License-Focused Model",
        description: "BYOL (Bring Your Own License) options for Oracle software",
        details: ["Universal Credits", "BYOL discounts", "Enterprise Agreements"]
      },
      compliance: {
        title: "Integration with Oracle Compliance",
        description: "Seamless extension of on-premises Oracle compliance controls",
        certifications: ["PCI DSS", "HIPAA", "FedRAMP", "GDPR", "ISO 27001", "SOC 1/2/3"]
      },
      globalPresence: {
        title: "Growing Global Footprint",
        description: "Expanding region presence with dedicated regions option",
        regions: ["North America", "Europe", "Middle East", "Asia Pacific", "South America"]
      },
      support: {
        title: "Oracle Support Integration",
        description: "Extension of existing Oracle support agreements",
        tiers: ["Basic", "Standard", "Premium"]
      }
    },
    technical: {
      architecture: {
        title: "Database-Centric Architecture",
        description: "RAC and Exadata Cloud Service optimization",
        strength: 5
      },
      deployment: {
        title: "Dedicated Regions",
        description: "Complete isolation option for regulated industries",
        strength: 4
      },
      developer: {
        title: "Autonomous Services",
        description: "Self-tuning, self-patching capabilities for reduced operations",
        strength: 4
      },
      ecosystem: {
        title: "Oracle Workload Optimization",
        description: "License mobility and BYOL options",
        strength: 5
      },
      performance: {
        title: "Highest I/O Performance for Databases",
        description: "Exadata Cloud Infrastructure",
        strength: 5
      },
      uniqueServices: ["Autonomous Database", "MySQL HeatWave (in-memory analytics)", "Oracle Analytics Cloud"]
    }
  },
  
  // Alibaba characteristics
  alibaba: {
    business: {
      costStructure: {
        title: "Lower Cost Structure",
        description: "Generally lower costs in Asia regions",
        details: ["Resource Package discounts", "Reserved Instances", "Storage packages"]
      },
      compliance: {
        title: "Chinese Regulatory Compliance",
        description: "Specialized for Chinese and Asian regulatory requirements",
        certifications: ["PCI DSS", "ISO 27001", "SOC 1/2", "China-specific regulations"]
      },
      globalPresence: {
        title: "Asia-Pacific Dominance",
        description: "Strong presence in China and expanding global footprint",
        regions: ["Asia Pacific", "North America", "Europe", "Middle East"]
      },
      support: {
        title: "Region-Specific Support",
        description: "Strong Chinese-language support with limited English options",
        tiers: ["Basic", "Developer", "Business", "Enterprise"]
      }
    },
    technical: {
      architecture: {
        title: "E-commerce and Web Applications",
        description: "Integrated CDN and edge services",
        strength: 4
      },
      deployment: {
        title: "Specialized Instance Types",
        description: "AI, big data, and real-time processing optimizations",
        strength: 3
      },
      developer: {
        title: "PAI (Platform for AI)",
        description: "One-stop ML development and deployment",
        strength: 4
      },
      ecosystem: {
        title: "Chinese Digital Ecosystem Integration",
        description: "Seamless integration with WeChat, Alipay",
        strength: 5
      },
      performance: {
        title: "Leading Network Performance in Asia",
        description: "Optimized China connectivity",
        strength: 5
      },
      uniqueServices: ["DataWorks (data integration)", "MaxCompute (big data processing)", "AnalyticDB (real-time analytics)"]
    }
  },
  digitalocean: {
    business: {
      costStructure: {
        title: "Simple, Predictable Pricing",
        description: "Flat monthly pricing with hourly billing available.",
        details: ["Free bandwidth included", "No hidden fees", "Per-second billing for droplets"]
      },
      compliance: {
        title: "Developer-Focused Compliance",
        description: "Certified for basic global regulations and standards.",
        certifications: ["SOC 2 Type II", "ISO/IEC 27001", "PCI-DSS"]
      },
      globalPresence: {
        title: "Strategic Global Presence",
        description: "14 data centers in key markets worldwide.",
        regions: ["North America", "Europe", "Asia"]
      },
      support: {
        title: "Community-Driven Support",
        description: "Extensive tutorials, Q&A, and community support.",
        tiers: ["Free", "Business"]
      }
    },
    technical: {
      architecture: {
        title: "Developer-Friendly",
        description: "Simple API and control panel for easy management.",
        strength: 4
      },
      deployment: {
        title: "Fast SSD Droplets",
        description: "Fast-booting virtual machines with SSD storage.",
        strength: 4
      },
      developer: {
        title: "Kubernetes-Native Platform",
        description: "Managed Kubernetes service for easy container orchestration.",
        strength: 4
      },
      ecosystem: {
        title: "Marketplace and Integrations",
        description: "One-click apps and integrations with popular developer tools.",
        strength: 3
      },
      performance: {
        title: "Premium Droplets",
        description: "Faster vCPUs and NVMe SSDs for high-performance workloads.",
        strength: 3
      },
      uniqueServices: ["App Platform (PaaS)", "Managed Databases", "Spaces Object Storage"]
    }
  }

};

export default providerCharacteristics;