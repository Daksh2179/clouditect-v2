// Enhanced WorkloadContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';

// Create context
const WorkloadContext = createContext();

// Initial workload state with enhancements
const initialWorkload = {
  compute: [],
  storage: [],
  database: [],
  networking: [], // New resource type
  serverless: [], // New resource type
  managedServices: [], // New resource type
  region: {
    aws: 'us-east-1',
    azure: 'eastus',
    gcp: 'us-central1',
    oracle: 'us-ashburn-1', // Added Oracle Cloud
    ibm: 'us-south', // Added IBM Cloud
    alibaba: 'us-west-1', // Added Alibaba Cloud
    digitalocean: 'nyc1' // Added DigitalOcean
  },
  preferred_provider: 'aws',
  userType: 'business', // New field for user type (business or developer)
  deploymentStrategy: 'single-cloud',
  existingProvider: null, // New field to track if user already has cloud services
  complianceRequirements: [], // New field for compliance requirements
  businessMetrics: {
    expectedGrowth: 'moderate',
    budgetConstraint: null,
    userTraffic: null
  },
  technicalRequirements: {
    highAvailability: false,
    disasterRecovery: false,
    autoscaling: false,
    multiRegion: false
  }
};

// Context provider component
export const WorkloadProvider = ({ children }) => {
  const [workload, setWorkload] = useState(initialWorkload);
  const [pricing, setPricing] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  
  // Function to update workload - using useCallback to prevent unnecessary rerenders
  const updateWorkload = useCallback((newWorkloadData) => {
    setWorkload(prev => {
      // Log the update for debugging
      console.log('Updating workload:', { 
        current: prev,
        updates: newWorkloadData,
        result: {...prev, ...newWorkloadData}
      });
      
      return {...prev, ...newWorkloadData};
    });
  }, []);
  
  // Function to reset workload
  const resetWorkload = useCallback(() => {
    console.log('Resetting workload to initial state');
    setWorkload(initialWorkload);
    setPricing(null);
    setRecommendations(null);
  }, []);
  
  // Function to set user type
  const setUserType = useCallback((type) => {
    if (type !== 'business' && type !== 'developer') {
      console.error('Invalid user type:', type);
      return;
    }
    
    updateWorkload({ userType: type });
  }, [updateWorkload]);
  
  // Function to set existing provider
  const setExistingProvider = useCallback((provider) => {
    updateWorkload({ existingProvider: provider });
  }, [updateWorkload]);
  
  // Original resource adding methods
  const addComputeResource = useCallback(() => {
    const newCompute = {
      size: 'medium',
      quantity: 1,
      hoursPerMonth: 730, // 24/7 by default
      utilization: 50
    };
    
    setWorkload(prev => {
      const updatedCompute = [...(prev.compute || []), newCompute];
      console.log('Adding compute resource:', { 
        prevCompute: prev.compute,
        newCompute,
        updatedCompute
      });
      
      return {
        ...prev,
        compute: updatedCompute
      };
    });
  }, []);
  
  const addStorageResource = useCallback(() => {
    const newStorage = {
      type: 'object',
      sizeGB: 100,
      utilization: 50
    };
    
    setWorkload(prev => {
      return {
        ...prev,
        storage: [...(prev.storage || []), newStorage]
      };
    });
  }, []);
  
  const addDatabaseResource = useCallback(() => {
    const newDatabase = {
      type: 'mysql',
      tier: 'small',
      quantity: 1,
      hoursPerMonth: 730 // 24/7 by default
    };
    
    setWorkload(prev => {
      return {
        ...prev,
        database: [...(prev.database || []), newDatabase]
      };
    });
  }, []);
  
  // New resource type methods
  const addNetworkingResource = useCallback(() => {
    const newNetworking = {
      type: 'loadBalancer',
      tier: 'standard',
      dataTransferGB: 100
    };
    
    setWorkload(prev => {
      return {
        ...prev,
        networking: [...(prev.networking || []), newNetworking]
      };
    });
  }, []);
  
  const addServerlessResource = useCallback(() => {
    const newServerless = {
      type: 'function',
      executionsPerMonth: 1000000,
      memoryMB: 128,
      avgDurationMs: 500
    };
    
    setWorkload(prev => {
      return {
        ...prev,
        serverless: [...(prev.serverless || []), newServerless]
      };
    });
  }, []);
  
  const addManagedService = useCallback(() => {
    const newService = {
      type: 'kubernetes',
      size: 'small',
      quantity: 1
    };
    
    setWorkload(prev => {
      return {
        ...prev,
        managedServices: [...(prev.managedServices || []), newService]
      };
    });
  }, []);
  
  // Enhanced templates with more comprehensive resource definitions
  const templates = {
    small_website: {
      name: 'Small Website',
      description: 'Basic website with low traffic',
      compute: [
        { size: 'small', quantity: 2, hoursPerMonth: 730 }
      ],
      storage: [
        { type: 'object', sizeGB: 50 },
        { type: 'block', sizeGB: 100 }
      ],
      database: [
        { type: 'mysql', tier: 'small', quantity: 1 }
      ]
    },
    ecommerce: {
      name: 'E-commerce Application',
      description: 'Medium-sized e-commerce platform',
      compute: [
        { size: 'medium', quantity: 4, hoursPerMonth: 730 },
        { size: 'small', quantity: 2, hoursPerMonth: 730 }
      ],
      storage: [
        { type: 'object', sizeGB: 500 },
        { type: 'block', sizeGB: 1000 }
      ],
      database: [
        { type: 'mysql', tier: 'medium', quantity: 1 },
        { type: 'nosql', quantity: 1 }
      ],
      networking: [
        { type: 'loadBalancer', tier: 'standard', dataTransferGB: 500 }
      ]
    },
    data_analytics: {
      name: 'Data Analytics Platform',
      description: 'Large data processing application',
      compute: [
        { size: 'large', quantity: 2, hoursPerMonth: 730 },
        { size: 'medium', quantity: 4, hoursPerMonth: 730 }
      ],
      storage: [
        { type: 'object', sizeGB: 5000 },
        { type: 'block', sizeGB: 2000 }
      ],
      database: [
        { type: 'mysql', tier: 'large', quantity: 1 },
        { type: 'nosql', quantity: 2 }
      ]
    },
    microservices: {
      name: 'Microservices Architecture',
      description: 'Containerized application with multiple services',
      compute: [
        { size: 'medium', quantity: 6, hoursPerMonth: 730 }
      ],
      storage: [
        { type: 'object', sizeGB: 200 },
        { type: 'block', sizeGB: 500 }
      ],
      database: [
        { type: 'mysql', tier: 'medium', quantity: 1 },
        { type: 'nosql', quantity: 3 }
      ],
      managedServices: [
        { type: 'kubernetes', size: 'medium', quantity: 1 }
      ],
      networking: [
        { type: 'loadBalancer', tier: 'standard', dataTransferGB: 1000 }
      ]
    },
    serverless_app: {
      name: 'Serverless Application',
      description: 'Event-driven architecture using serverless functions',
      serverless: [
        { type: 'function', executionsPerMonth: 5000000, memoryMB: 256, avgDurationMs: 800 }
      ],
      storage: [
        { type: 'object', sizeGB: 100 }
      ],
      database: [
        { type: 'nosql', quantity: 1 }
      ]
    }
  };
  
  // Apply template to workload
  const applyTemplate = useCallback((templateName) => {
    if (templates[templateName]) {
      setWorkload({
        ...initialWorkload,
        ...templates[templateName]
      });
    }
  }, []);
  
  return (
    <WorkloadContext.Provider 
      value={{ 
        workload, 
        updateWorkload, 
        resetWorkload,
        setUserType,
        setExistingProvider,
        addComputeResource,
        addStorageResource,
        addDatabaseResource,
        addNetworkingResource,
        addServerlessResource,
        addManagedService,
        pricing,
        setPricing,
        recommendations,
        setRecommendations,
        templates,
        applyTemplate
      }}
    >
      {children}
    </WorkloadContext.Provider>
  );
};

// Custom hook to use the workload context
export const useWorkload = () => {
  const context = useContext(WorkloadContext);
  if (!context) {
    throw new Error('useWorkload must be used within a WorkloadProvider');
  }
  return context;
};

export default WorkloadContext;