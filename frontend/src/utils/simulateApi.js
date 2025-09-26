// This module simulates API responses when backend connectivity is not available
import fallbackRegions from '../data/fallbackRegions';
import fallbackProviders from '../data/fallbackProviders';

// Sample pricing response data
const generatePricingData = (workload) => {
  // Generate realistic pricing based on the workload
  const computeMultiplier = {
    small: 0.5,
    medium: 1,
    large: 3,
    xlarge: 8
  };
  
  // Calculate total VM cost based on size and quantity
  const calculateVMCost = (vms, provider) => {
    return vms.reduce((total, vm) => {
      const baseRate = provider === 'aws' ? 35 : 
                       provider === 'azure' ? 32 : 
                       provider === 'gcp' ? 28 :
                       provider === 'oracle' ? 36 : 
                       provider === 'ibm' ? 34 : 
                       25; // alibaba (lowest)
      const sizeMult = computeMultiplier[vm.size] || 1;
      const hours = vm.hoursPerMonth || 730;
      // Include utilization to make the calculation more realistic
      const utilization = vm.utilization !== undefined ? vm.utilization / 100 : 1;
      // Include OS type if specified
      const osMult = (vm.os === 'windows' || vm.os === 'rhel' || vm.os === 'suse') ? 1.3 : 1;
      // Include instance type optimization
      const typeMult = (vm.instanceType === 'compute' || vm.instanceType === 'memory' || 
                        vm.instanceType === 'storage' || vm.instanceType === 'gpu') ? 1.2 : 1;
      
      return total + (baseRate * sizeMult * (vm.quantity || 1) * (hours / 730) * utilization * osMult * typeMult);
    }, 0);
  };
  
  // Calculate storage cost
  const calculateStorageCost = (storage, provider) => {
    return storage.reduce((total, s) => {
      const baseRate = provider === 'aws' ? 0.023 : 
                       provider === 'azure' ? 0.018 : 
                       provider === 'gcp' ? 0.02 :
                       provider === 'oracle' ? 0.025 : 
                       provider === 'ibm' ? 0.022 : 
                       0.015; // alibaba
      
      let typeMult;
      if (s.type === 'object') {
        typeMult = 1;
      } else if (s.type === 'block') {
        typeMult = 1.8;
      } else if (s.type === 'file') {
        typeMult = 2.2;
      } else if (s.type === 'archive') {
        typeMult = 0.4;
      } else {
        typeMult = 1;
      }
      
      // Factor in criticality
      const criticalMult = s.critical ? 1.5 : 1;
      
      // Factor in access pattern if specified
      const accessMult = s.accessPattern === 'infrequent' ? 0.6 : 
                         s.accessPattern === 'intensive' ? 1.4 : 
                         s.accessPattern === 'throughput' ? 1.3 : 1;
      
      return total + (baseRate * typeMult * (s.sizeGB || 100) * criticalMult * accessMult);
    }, 0);
  };
  
  // Calculate database cost
  const calculateDBCost = (dbs, provider) => {
    return dbs.reduce((total, db) => {
      let baseRate;
      if (db.type === 'mysql') {
        baseRate = provider === 'aws' ? 25 : 
                  provider === 'azure' ? 26 : 
                  provider === 'gcp' ? 22 :
                  provider === 'oracle' ? 30 : 
                  provider === 'ibm' ? 28 : 
                  20; // alibaba
        
        // Apply tier multiplier
        if (db.tier === 'medium') baseRate *= 2;
        if (db.tier === 'large') baseRate *= 4;
      } else if (db.type === 'nosql') {
        // NoSQL
        baseRate = provider === 'aws' ? 20 : 
                  provider === 'azure' ? 22 : 
                  provider === 'gcp' ? 18 :
                  provider === 'oracle' ? 23 : 
                  provider === 'ibm' ? 21 : 
                  16; // alibaba
      } else if (db.type === 'redis') {
        // In-Memory Cache
        baseRate = provider === 'aws' ? 35 : 
                  provider === 'azure' ? 33 : 
                  provider === 'gcp' ? 30 :
                  provider === 'oracle' ? 38 : 
                  provider === 'ibm' ? 36 : 
                  28; // alibaba
      } else if (db.type === 'analytics') {
        // Analytics
        baseRate = provider === 'aws' ? 80 : 
                  provider === 'azure' ? 75 : 
                  provider === 'gcp' ? 70 :
                  provider === 'oracle' ? 85 : 
                  provider === 'ibm' ? 82 : 
                  65; // alibaba
      } else if (db.type === 'graph') {
        // Graph
        baseRate = provider === 'aws' ? 90 : 
                  provider === 'azure' ? 85 : 
                  provider === 'gcp' ? 0 : // GCP doesn't have a dedicated graph DB
                  provider === 'oracle' ? 0 : // Oracle doesn't have a dedicated graph DB
                  provider === 'ibm' ? 0 : // IBM doesn't have a dedicated graph DB
                  0; // alibaba doesn't have a dedicated graph DB
      } else {
        // Default case
        baseRate = provider === 'aws' ? 25 : 
                  provider === 'azure' ? 26 : 
                  provider === 'gcp' ? 22 :
                  provider === 'oracle' ? 30 : 
                  provider === 'ibm' ? 28 : 
                  20; // alibaba
      }
      
      const hours = db.hoursPerMonth || 730;
      
      // Apply high availability multiplier
      const haMult = db.highAvailability === 'standby' ? 1.7 : 
                     db.highAvailability === 'cluster' ? 2.5 : 1;
      
      // Apply storage size multiplier
      const storageMult = db.storageSizeGB ? (1 + db.storageSizeGB / 1000) : 1;
      
      return total + (baseRate * (db.quantity || 1) * (hours / 730) * haMult * storageMult);
    }, 0);
  };
  
  // Calculate networking cost
  const calculateNetworkingCost = (networking, provider) => {
    return (networking || []).reduce((total, net) => {
      const baseRate = provider === 'aws' ? 0.08 : 
                      provider === 'azure' ? 0.07 : 
                      provider === 'gcp' ? 0.075 :
                      provider === 'oracle' ? 0.065 :
                      provider === 'ibm' ? 0.09 :
                      0.085; // alibaba
                      
      const typeMult = net.type === 'loadBalancer' ? 1 : 
                      net.type === 'dataTransfer' ? 0.8 : 
                      net.type === 'vpn' ? 0.7 : 
                      net.type === 'firewall' ? 0.5 : 0.9; // cdn
                      
      const dataTransfer = net.dataTransferGB || 100;
      
      // Additional factors for VPN types
      const vpnMult = net.vpnType === 'site-to-site' ? 1.2 : 
                      net.vpnType === 'point-to-site' ? 0.9 : 1;
      
      return total + (baseRate * typeMult * dataTransfer * vpnMult);
    }, 0);
  };
  
  // Calculate serverless cost
  const calculateServerlessCost = (serverless, provider) => {
    return (serverless || []).reduce((total, fn) => {
      const baseRate = provider === 'aws' ? 0.0000002 : 
                      provider === 'azure' ? 0.0000002 : 
                      provider === 'gcp' ? 0.0000004 :
                      provider === 'oracle' ? 0.0000005 :
                      provider === 'ibm' ? 0.0000003 :
                      0.0000004; // alibaba
                      
      const executions = fn.executionsPerMonth || 1000000;
      const memory = fn.memoryMB || 128;
      const duration = fn.avgDurationMs || 500;
      
      // Different calculation based on function type
      const typeMult = fn.type === 'container' ? 1.5 : 
                       fn.type === 'edge' ? 1.8 : 1;
      
      // Convert to GB-seconds
      const gbSeconds = (executions * duration / 1000) * (memory / 1024);
      
      return total + (baseRate * gbSeconds * typeMult);
    }, 0);
  };
  
  // Calculate managed services cost
  const calculateManagedServicesCost = (services, provider) => {
    return (services || []).reduce((total, svc) => {
      let baseRate;
      
      switch (svc.type) {
        case 'kubernetes':
          baseRate = provider === 'aws' ? 73 : 
                    provider === 'azure' ? 77 : 
                    provider === 'gcp' ? 70 :
                    provider === 'oracle' ? 65 :
                    provider === 'ibm' ? 80 :
                    75; // alibaba
          break;
        case 'cache':
          baseRate = provider === 'aws' ? 60 : 
                    provider === 'azure' ? 55 : 
                    provider === 'gcp' ? 65 :
                    provider === 'oracle' ? 70 :
                    provider === 'ibm' ? 50 :
                    60; // alibaba
          break;
        case 'queue':
          baseRate = provider === 'aws' ? 40 : 
                    provider === 'azure' ? 35 : 
                    provider === 'gcp' ? 30 :
                    provider === 'oracle' ? 45 :
                    provider === 'ibm' ? 38 :
                    35; // alibaba
          break;
        case 'api-gateway':
          baseRate = provider === 'aws' ? 45 : 
                    provider === 'azure' ? 42 : 
                    provider === 'gcp' ? 38 :
                    provider === 'oracle' ? 50 :
                    provider === 'ibm' ? 48 :
                    40; // alibaba
          break;
        case 'ci-cd':
          baseRate = provider === 'aws' ? 55 : 
                    provider === 'azure' ? 60 : 
                    provider === 'gcp' ? 52 :
                    provider === 'oracle' ? 65 :
                    provider === 'ibm' ? 58 :
                    50; // alibaba
          break;
        default:
          baseRate = provider === 'aws' ? 50 : 
                    provider === 'azure' ? 45 : 
                    provider === 'gcp' ? 48 :
                    provider === 'oracle' ? 40 :
                    provider === 'ibm' ? 55 :
                    52; // alibaba
      }
      
      // Apply size multiplier
      const sizeMult = svc.size === 'small' ? 1 : 
                      svc.size === 'medium' ? 2 : 3;
      
      return total + (baseRate * sizeMult * (svc.quantity || 1));
    }, 0);
  };
  
  // Generate pricing for each provider including additional ones
  const compute = workload.compute || [];
  const storage = workload.storage || [];
  const database = workload.database || [];
  const networking = workload.networking || [];
  const serverless = workload.serverless || [];
  const managedServices = workload.managedServices || [];
  
  // Original providers
  const awsCompute = calculateVMCost(compute, 'aws');
  const azureCompute = calculateVMCost(compute, 'azure');
  const gcpCompute = calculateVMCost(compute, 'gcp');
  
  const awsStorage = calculateStorageCost(storage, 'aws');
  const azureStorage = calculateStorageCost(storage, 'azure');
  const gcpStorage = calculateStorageCost(storage, 'gcp');
  
  const awsDB = calculateDBCost(database, 'aws');
  const azureDB = calculateDBCost(database, 'azure');
  const gcpDB = calculateDBCost(database, 'gcp');
  
  // New resource types for original providers
  const awsNetworking = calculateNetworkingCost(networking, 'aws');
  const azureNetworking = calculateNetworkingCost(networking, 'azure');
  const gcpNetworking = calculateNetworkingCost(networking, 'gcp');
  
  const awsServerless = calculateServerlessCost(serverless, 'aws');
  const azureServerless = calculateServerlessCost(serverless, 'azure');
  const gcpServerless = calculateServerlessCost(serverless, 'gcp');
  
  const awsManagedServices = calculateManagedServicesCost(managedServices, 'aws');
  const azureManagedServices = calculateManagedServicesCost(managedServices, 'azure');
  const gcpManagedServices = calculateManagedServicesCost(managedServices, 'gcp');
  
  // Additional providers
  const oracleCompute = calculateVMCost(compute, 'oracle');
  const oracleStorage = calculateStorageCost(storage, 'oracle');
  const oracleDB = calculateDBCost(database, 'oracle');
  const oracleNetworking = calculateNetworkingCost(networking, 'oracle');
  const oracleServerless = calculateServerlessCost(serverless, 'oracle');
  const oracleManagedServices = calculateManagedServicesCost(managedServices, 'oracle');
  
  const ibmCompute = calculateVMCost(compute, 'ibm');
  const ibmStorage = calculateStorageCost(storage, 'ibm');
  const ibmDB = calculateDBCost(database, 'ibm');
  const ibmNetworking = calculateNetworkingCost(networking, 'ibm');
  const ibmServerless = calculateServerlessCost(serverless, 'ibm');
  const ibmManagedServices = calculateManagedServicesCost(managedServices, 'ibm');
  
  const alibabaCompute = calculateVMCost(compute, 'alibaba');
  const alibabaStorage = calculateStorageCost(storage, 'alibaba');
  const alibabaDB = calculateDBCost(database, 'alibaba');
  const alibabaNetworking = calculateNetworkingCost(networking, 'alibaba');
  const alibabaServerless = calculateServerlessCost(serverless, 'alibaba');
  const alibabaManagedServices = calculateManagedServicesCost(managedServices, 'alibaba');
  
  // Round values to 2 decimal places
  const round = (num) => Math.round(num * 100) / 100;
  
  // Build the pricing data object with original details
  const result = {
    aws: {
      compute: round(awsCompute),
      storage: round(awsStorage),
      database: round(awsDB),
      networking: round(awsNetworking),
      serverless: round(awsServerless),
      managedServices: round(awsManagedServices),
      total: round(awsCompute + awsStorage + awsDB + awsNetworking + awsServerless + awsManagedServices),
      details: {
        compute: compute.map(c => ({
          provider: 'aws',
          instanceType: c.size === 'small' ? 't2.small' :
                        c.size === 'medium' ? 't2.medium' :
                        c.size === 'large' ? 'm5.large' : 'm5.2xlarge',
          quantity: c.quantity || 1,
          hoursPerMonth: c.hoursPerMonth || 730,
          hourlyCost: round((computeMultiplier[c.size] || 1) * 0.05),
          monthlyCost: round((computeMultiplier[c.size] || 1) * 0.05 * (c.hoursPerMonth || 730) * (c.quantity || 1)),
          specs: {
            vcpu: c.size === 'small' ? 1 :
                  c.size === 'medium' ? 2 :
                  c.size === 'large' ? 2 : 8,
            memory: c.size === 'small' ? 2 :
                    c.size === 'medium' ? 4 :
                    c.size === 'large' ? 8 : 32
          }
        })),
        storage: storage.map(s => ({
          provider: 'aws',
          type: s.type === 'object' ? 's3_standard' : 'ebs_gp2',
          sizeGB: s.sizeGB || 100,
          costPerGBPerMonth: s.type === 'object' ? 0.023 : 0.10,
          monthlyCost: round((s.type === 'object' ? 0.023 : 0.10) * (s.sizeGB || 100)),
          details: {
            durability: "99.999999999%",
            availability: "99.99%",
            min_storage_duration: "No minimum"
          }
        }))
      }
    },
    azure: {
      compute: round(azureCompute),
      storage: round(azureStorage),
      database: round(azureDB),
      networking: round(azureNetworking),
      serverless: round(azureServerless),
      managedServices: round(azureManagedServices),
      total: round(azureCompute + azureStorage + azureDB + azureNetworking + azureServerless + azureManagedServices),
      details: {
        compute: compute.map(c => ({
          provider: 'azure',
          instanceType: c.size === 'small' ? 'B1S' :
                        c.size === 'medium' ? 'B2S' :
                        c.size === 'large' ? 'D2s_v3' : 'D4s_v3',
          quantity: c.quantity || 1,
          hoursPerMonth: c.hoursPerMonth || 730,
          hourlyCost: round((computeMultiplier[c.size] || 1) * 0.045),
          monthlyCost: round((computeMultiplier[c.size] || 1) * 0.045 * (c.hoursPerMonth || 730) * (c.quantity || 1)),
          specs: {
            vcpu: c.size === 'small' ? 1 :
                  c.size === 'medium' ? 2 :
                  c.size === 'large' ? 2 : 8,
            memory: c.size === 'small' ? 2 :
                    c.size === 'medium' ? 4 :
                    c.size === 'large' ? 8 : 32
          }
        }))
      }
    },
    gcp: {
      compute: round(gcpCompute),
      storage: round(gcpStorage),
      database: round(gcpDB),
      networking: round(gcpNetworking),
      serverless: round(gcpServerless),
      managedServices: round(gcpManagedServices),
      total: round(gcpCompute + gcpStorage + gcpDB + gcpNetworking + gcpServerless + gcpManagedServices),
      details: {}
    }
  };
  
  // Add additional providers if they are preferred or existing
  if (workload.preferred_provider === 'oracle' || workload.existingProvider === 'oracle') {
    result.oracle = {
      compute: round(oracleCompute),
      storage: round(oracleStorage),
      database: round(oracleDB),
      networking: round(oracleNetworking),
      serverless: round(oracleServerless),
      managedServices: round(oracleManagedServices),
      total: round(oracleCompute + oracleStorage + oracleDB + oracleNetworking + oracleServerless + oracleManagedServices),
      details: {
        compute: compute.map(c => ({
          provider: 'oracle',
          instanceType: c.size === 'small' ? 'VM.Standard.E2.1' :
                        c.size === 'medium' ? 'VM.Standard.E2.2' :
                        c.size === 'large' ? 'VM.Standard.E3.Flex' : 'VM.Standard.E4.Flex',
          quantity: c.quantity || 1,
          hoursPerMonth: c.hoursPerMonth || 730,
          hourlyCost: round((computeMultiplier[c.size] || 1) * 0.06),
          monthlyCost: round((computeMultiplier[c.size] || 1) * 0.06 * (c.hoursPerMonth || 730) * (c.quantity || 1))
        }))
      }
    };
  }
  
  if (workload.preferred_provider === 'ibm' || workload.existingProvider === 'ibm') {
    result.ibm = {
      compute: round(ibmCompute),
      storage: round(ibmStorage),
      database: round(ibmDB),
      networking: round(ibmNetworking),
      serverless: round(ibmServerless),
      managedServices: round(ibmManagedServices),
      total: round(ibmCompute + ibmStorage + ibmDB + ibmNetworking + ibmServerless + ibmManagedServices),
      details: {
        compute: compute.map(c => ({
          provider: 'ibm',
          instanceType: c.size === 'small' ? 'cx2.2x4' :
                        c.size === 'medium' ? 'cx2.4x8' :
                        c.size === 'large' ? 'cx2.8x16' : 'cx2.16x32',
          quantity: c.quantity || 1,
          hoursPerMonth: c.hoursPerMonth || 730,
          hourlyCost: round((computeMultiplier[c.size] || 1) * 0.055),
          monthlyCost: round((computeMultiplier[c.size] || 1) * 0.055 * (c.hoursPerMonth || 730) * (c.quantity || 1))
        }))
      }
    };
  }
  
  if (workload.preferred_provider === 'alibaba' || workload.existingProvider === 'alibaba') {
    result.alibaba = {
      compute: round(alibabaCompute),
      storage: round(alibabaStorage),
      database: round(alibabaDB),
      networking: round(alibabaNetworking),
      serverless: round(alibabaServerless),
      managedServices: round(alibabaManagedServices),
      total: round(alibabaCompute + alibabaStorage + alibabaDB + alibabaNetworking + alibabaServerless + alibabaManagedServices),
      details: {
        compute: compute.map(c => ({
          provider: 'alibaba',
          instanceType: c.size === 'small' ? 'ecs.g6.large' :
                        c.size === 'medium' ? 'ecs.g6.xlarge' :
                        c.size === 'large' ? 'ecs.g6.2xlarge' : 'ecs.g6.4xlarge',
          quantity: c.quantity || 1,
          hoursPerMonth: c.hoursPerMonth || 730,
          hourlyCost: round((computeMultiplier[c.size] || 1) * 0.04),
          monthlyCost: round((computeMultiplier[c.size] || 1) * 0.04 * (c.hoursPerMonth || 730) * (c.quantity || 1))
        }))
      }
    };
  }
  
  return result;
};

// Sample recommendations response data
const generateRecommendations = (workload, pricing) => {
  // Get user type
  const userType = workload.userType || 'business';
  
  // Define basic recommendations
  const baseRecommendations = [];
  
  // Use preferred provider or default to AWS
  const provider = workload.preferred_provider || 'aws';
  
  // Add recommendations based on compute resources
  const largeInstances = (workload.compute || []).filter(vm => 
    vm.size === 'large' && (vm.utilization || 50) < 50);
  
  if (largeInstances.length > 0) {
    baseRecommendations.push({
      type: 'compute',
      severity: 'high',
      description: 'Consider downsizing large instances with low utilization',
      saving_potential: '20-30%',
      resource: `large instance (${largeInstances.length} units)`,
      recommendation: 'Downsize to medium instances',
      action: 'resize',
      details: 'Large instances with less than 50% utilization are candidates for downsizing.'
    });
  }
  
  // Add a reserved instance recommendation if instances are running 24/7
  const fullTimeInstances = (workload.compute || []).filter(vm => 
    (vm.hoursPerMonth || 730) >= 700);
  
  if (fullTimeInstances.length > 0) {
    baseRecommendations.push({
      type: 'compute',
      severity: 'high',
      description: 'Consider reserved instances for 24/7 workloads',
      saving_potential: '30-60%',
      resource: `24/7 instances (${fullTimeInstances.length} units)`,
      recommendation: 'Purchase 1-year or 3-year reserved instances',
      action: 'reserved_instance',
      details: 'Instances running 24/7 can benefit significantly from reserved instance pricing.'
    });
  }
  
  // Add a storage recommendation if there's significant object storage
  const largeStorage = (workload.storage || []).filter(s => 
    s.type === 'object' && (s.sizeGB || 0) > 1000);
  
  if (largeStorage.length > 0) {
    baseRecommendations.push({
      type: 'storage',
      severity: 'medium',
      description: 'Implement storage lifecycle policies',
      saving_potential: '10-30%',
      resource: `Object storage (${largeStorage.reduce((sum, s) => sum + (s.sizeGB || 0), 0)} GB)`,
      recommendation: 'Implement lifecycle policies to move older data to cheaper storage tiers',
      action: 'lifecycle_policy',
      details: 'Large object storage can benefit from lifecycle policies that move older data to cheaper storage classes.'
    });
  }
  
  // Add user-specific recommendations
  let recommendations = [...baseRecommendations];
  
  if (userType === 'business') {
    // Business-specific recommendations
    
    // Add a licensing recommendation
    if ((workload.compute || []).length > 0) {
      recommendations.push({
        type: 'licensing',
        severity: 'medium',
        description: 'Optimize software licensing costs',
        saving_potential: '15-25%',
        resource: 'Licensed software',
        recommendation: 'Consolidate licenses or move to BYOL model',
        action: 'license_optimization',
        details: 'Bringing your own licenses (BYOL) can reduce costs significantly compared to license-included instances.'
      });
    }
    
    // Add a business continuity recommendation
    if (workload.businessMetrics?.budgetConstraint) {
      recommendations.push({
        type: 'general',
        severity: 'low',
        description: 'Implement budget alerts and guardrails',
        saving_potential: '5-10%',
        resource: 'All resources',
        recommendation: 'Set up budget alerts and automated shutdown policies',
        action: 'budget_control',
        details: 'Implementing budget controls can prevent unexpected costs from resource sprawl or misconfiguration.'
      });
    }
    
    // Add compliance recommendation if needed
    if (workload.complianceRequirements?.length > 0) {
      recommendations.push({
        type: 'general',
        severity: 'medium',
        description: 'Optimize compliance-related infrastructure',
        saving_potential: '8-15%',
        resource: 'Compliance infrastructure',
        recommendation: 'Consolidate logging and monitoring resources',
        action: 'consolidate_logging',
        details: 'Centralized logging and monitoring can reduce duplicate resources required for compliance while maintaining audit capabilities.'
      });
    }
    
    // Add growth-related recommendation
    if (workload.businessMetrics?.expectedGrowth === 'high' || workload.businessMetrics?.expectedGrowth === 'rapid') {
      recommendations.push({
        type: 'reserved_instances',
        severity: 'high',
        description: 'Pre-purchase capacity for planned growth',
        saving_potential: '25-40%',
        resource: 'Future compute resources',
        recommendation: 'Use Savings Plans or Reserved Instances with planned growth',
        action: 'savings_plan',
        details: 'For high-growth scenarios, pre-purchasing capacity with flexible Savings Plans can provide significant discounts on future usage.'
      });
    }
    
    // Add multi-cloud recommendation if they have an existing provider
    if (workload.existingProvider && workload.existingProvider !== workload.preferred_provider) {
      recommendations.push({
        type: 'general',
        severity: 'medium',
        description: 'Optimize multi-cloud strategy',
        saving_potential: '10-20%',
        resource: 'Cross-cloud resources',
        recommendation: 'Implement centralized cloud management platform',
        action: 'multi_cloud_management',
        details: 'When operating across multiple cloud providers, a unified management platform can reduce operational overhead and improve cost visibility.'
      });
    }
  } else {
    // Developer-specific recommendations
    
    // Add container optimization if using managed services
    if ((workload.managedServices || []).some(s => s.type === 'kubernetes')) {
      recommendations.push({
        type: 'managedServices',
        severity: 'medium',
        description: 'Optimize Kubernetes cluster configuration',
        saving_potential: '20-35%',
        resource: 'Kubernetes clusters',
        recommendation: 'Implement cluster autoscaling and node rightsizing',
        action: 'cluster_optimization',
        details: 'Kubernetes clusters often have idle capacity. Implementing autoscaling and selecting appropriate node sizes can significantly reduce costs.'
      });
    }
    
    // Add networking optimization
    if ((workload.networking || []).length > 0) {
      recommendations.push({
        type: 'networking',
        severity: 'medium',
        description: 'Optimize data transfer patterns',
        saving_potential: '15-30%',
        resource: 'Data transfer',
        recommendation: 'Implement CDN and review cross-region traffic',
        action: 'optimize_data_transfer',
        details: 'Data transfer, especially between regions, can incur significant costs. Using CDNs and keeping traffic within regions can reduce these costs.'
      });
    }
    
    // Add serverless recommendation
    if ((workload.serverless || []).length > 0) {
      recommendations.push({
        type: 'serverless',
        severity: 'high',
        description: 'Optimize serverless function configuration',
        saving_potential: '25-40%',
        resource: 'Serverless functions',
        recommendation: 'Reduce memory allocation and optimize code execution time',
        action: 'optimize_serverless',
        details: 'Serverless functions are often over-provisioned. Reducing memory allocation and optimizing code can significantly reduce costs.'
      });
    }
    
    // Add architecture pattern recommendation
    if (workload.technicalRequirements?.architecturePattern === 'traditional') {
      recommendations.push({
        type: 'architecture',
        severity: 'high',
        description: 'Consider modernizing architecture',
        saving_potential: '30-50%',
        resource: 'Application architecture',
        recommendation: 'Evaluate serverless or container-based architecture',
        action: 'modernize_architecture',
        details: 'Modern architectures can significantly reduce costs by allowing for more granular scaling and pay-per-use pricing models.'
      });
    }
    
    // Add high availability recommendation
    if (workload.technicalRequirements?.highAvailability) {
      recommendations.push({
        type: 'architecture',
        severity: 'medium',
        description: 'Optimize high availability configuration',
        saving_potential: '15-25%',
        resource: 'Multi-AZ deployments',
        recommendation: 'Use managed services with built-in HA instead of custom solutions',
        action: 'use_managed_ha',
        details: 'Custom high availability solutions often result in over-provisioning. Many managed services offer built-in HA at a lower cost.'
      });
    }
    
    // Add performance recommendation
    if (workload.technicalRequirements?.performanceRequirements === 'high') {
      recommendations.push({
        type: 'compute',
        severity: 'medium',
        description: 'Use compute-optimized instances for high performance workloads',
        saving_potential: '10-20%',
        resource: 'Compute instances',
        recommendation: 'Switch to compute-optimized instance families',
        action: 'use_compute_optimized',
        details: 'For high-performance workloads, compute-optimized instances offer better price-performance ratio than general-purpose instances.'
      });
    }
  }
  
  // Calculate potential savings
  let totalCost = 0;
  let potentialSavings = 0;
  
  if (pricing && pricing[provider]) {
    totalCost = pricing[provider].total;
    
    // Estimate savings from recommendations
    for (const rec of recommendations) {
      const savingRange = rec.saving_potential.replace('%', '').split('-');
      const avgSavingPercentage = (parseInt(savingRange[0]) + parseInt(savingRange[1])) / 200;
      
      let affectedCost = 0;
      if (rec.type === 'compute') {
        affectedCost = pricing[provider].compute * 0.5; // Assume recommendation affects 50% of compute
      } else if (rec.type === 'storage') {
        affectedCost = pricing[provider].storage * 0.7; // Assume recommendation affects 70% of storage
      } else if (rec.type === 'database') {
        affectedCost = pricing[provider].database * 0.6;
      } else if (rec.type === 'networking') {
        affectedCost = pricing[provider].networking * 0.8;
      } else if (rec.type === 'serverless') {
        affectedCost = pricing[provider].serverless * 0.9;
      } else if (rec.type === 'managedServices') {
        affectedCost = pricing[provider].managedServices * 0.7;
      } else {
        affectedCost = pricing[provider].total * 0.2; // Default to 20% of total
      }
      
      potentialSavings += affectedCost * avgSavingPercentage;
    }
  }
  
  return {
    recommendations: recommendations,
    summary: {
      total_recommendations: recommendations.length,
      high_priority: recommendations.filter(r => r.severity === 'high').length,
      medium_priority: recommendations.filter(r => r.severity === 'medium').length,
      low_priority: recommendations.filter(r => r.severity === 'low').length,
      estimated_monthly_savings: Math.round(potentialSavings * 100) / 100,
      current_monthly_cost: Math.round(totalCost * 100) / 100,
      savings_percentage: totalCost > 0 ? Math.round((potentialSavings / totalCost) * 100) : 0
    }
  };
};

// Simulate API responses
const simulateApi = {
  // Provider Service
  getProviders: () => {
    // Add the additional providers to the fallback providers
    const enhancedProviders = [...fallbackProviders];
    
    // Check if we need to add Oracle Cloud
    if (!enhancedProviders.some(p => p.id === 'oracle')) {
      enhancedProviders.push({
        id: 'oracle',
        name: 'Oracle Cloud',
        logoUrl: 'https://www.oracle.com/a/ocom/img/cloud-light.svg',
        description: 'Oracle Cloud Infrastructure (OCI) offers high-performance computing services.'
      });
    }
    
    // Check if we need to add IBM Cloud
    if (!enhancedProviders.some(p => p.id === 'ibm')) {
      enhancedProviders.push({
        id: 'ibm',
        name: 'IBM Cloud',
        logoUrl: 'https://www.ibm.com/cloud/architecture/images/ibm-cloud-logo.svg',
        description: 'IBM Cloud offers a wide range of services including AI, data, and enterprise applications.'
      });
    }
    
    // Check if we need to add Alibaba Cloud
    if (!enhancedProviders.some(p => p.id === 'alibaba')) {
      enhancedProviders.push({
        id: 'alibaba',
        name: 'Alibaba Cloud',
        logoUrl: 'https://img.alicdn.com/tfs/TB1Ly5oS3HqK1RjSZFPXXcwapXa-238-54.png',
        description: 'Alibaba Cloud provides a suite of cloud computing services to businesses worldwide.'
      });
    }
    
    return Promise.resolve({ data: enhancedProviders });
  },
  
  getProviderDetails: (providerId) => {
    // Handle additional providers
    if (providerId === 'oracle' && !fallbackProviders.find(p => p.id === 'oracle')) {
      return Promise.resolve({
        data: {
          id: 'oracle',
          name: 'Oracle Cloud',
          logoUrl: 'https://www.oracle.com/a/ocom/img/cloud-light.svg',
          description: 'Oracle Cloud Infrastructure (OCI) offers high-performance computing services.',
          services: {
            compute: 'Compute',
            storage: 'Storage',
            database: 'Database',
            networking: 'Networking',
            serverless: 'Functions',
            managedServices: 'Managed Services'
          }
        }
      });
    }
    
    if (providerId === 'ibm' && !fallbackProviders.find(p => p.id === 'ibm')) {
      return Promise.resolve({
        data: {
          id: 'ibm',
          name: 'IBM Cloud',
          logoUrl: 'https://www.ibm.com/cloud/architecture/images/ibm-cloud-logo.svg',
          description: 'IBM Cloud offers a wide range of services including AI, data, and enterprise applications.',
          services: {
            compute: 'Virtual Servers',
            storage: 'Storage',
            database: 'Databases',
            networking: 'Networking',
            serverless: 'Functions',
            managedServices: 'Managed Services'
          }
        }
      });
    }
    
    if (providerId === 'alibaba' && !fallbackProviders.find(p => p.id === 'alibaba')) {
      return Promise.resolve({
        data: {
          id: 'alibaba',
          name: 'Alibaba Cloud',
          logoUrl: 'https://img.alicdn.com/tfs/TB1Ly5oS3HqK1RjSZFPXXcwapXa-238-54.png',
          description: 'Alibaba Cloud provides a suite of cloud computing services to businesses worldwide.',
          services: {
            compute: 'Elastic Compute Service',
            storage: 'Object Storage Service',
            database: 'Database Services',
            networking: 'Networking',
            serverless: 'Function Compute',
            managedServices: 'Managed Services'
          }
        }
      });
    }
    
    const provider = fallbackProviders.find(p => p.id === providerId);
    return Promise.resolve({ data: provider });
  },
  
  getRegions: (providerId) => {
    // Add regions for additional providers
    if (providerId === 'oracle' && (!fallbackRegions[providerId] || fallbackRegions[providerId].length === 0)) {
      return Promise.resolve({
        data: [
          { id: 'us-ashburn-1', name: 'US East (Ashburn)', continent: 'North America', location: 'Virginia, USA' },
          { id: 'us-phoenix-1', name: 'US West (Phoenix)', continent: 'North America', location: 'Arizona, USA' },
          { id: 'eu-frankfurt-1', name: 'EU (Frankfurt)', continent: 'Europe', location: 'Frankfurt, Germany' },
          { id: 'uk-london-1', name: 'UK (London)', continent: 'Europe', location: 'London, UK' },
          { id: 'ap-tokyo-1', name: 'Japan (Tokyo)', continent: 'Asia', location: 'Tokyo, Japan' },
          { id: 'ap-singapore-1', name: 'Asia Pacific (Singapore)', continent: 'Asia', location: 'Singapore' }
        ]
      });
    }
    
    if (providerId === 'ibm' && (!fallbackRegions[providerId] || fallbackRegions[providerId].length === 0)) {
      return Promise.resolve({
        data: [
          { id: 'us-south', name: 'US South', continent: 'North America', location: 'Dallas, TX' },
          { id: 'us-east', name: 'US East', continent: 'North America', location: 'Washington DC' },
          { id: 'eu-gb', name: 'United Kingdom', continent: 'Europe', location: 'London' },
          { id: 'eu-de', name: 'EU Germany', continent: 'Europe', location: 'Frankfurt' },
          { id: 'jp-tok', name: 'Japan', continent: 'Asia', location: 'Tokyo' },
          { id: 'au-syd', name: 'Australia', continent: 'Oceania', location: 'Sydney' }
        ]
      });
    }
    
    if (providerId === 'alibaba' && (!fallbackRegions[providerId] || fallbackRegions[providerId].length === 0)) {
      return Promise.resolve({
        data: [
          { id: 'us-west-1', name: 'US (Silicon Valley)', continent: 'North America', location: 'Silicon Valley' },
          { id: 'us-east-1', name: 'US (Virginia)', continent: 'North America', location: 'Virginia' },
          { id: 'eu-central-1', name: 'Germany (Frankfurt)', continent: 'Europe', location: 'Frankfurt' },
          { id: 'eu-west-1', name: 'UK (London)', continent: 'Europe', location: 'London' },
          { id: 'ap-southeast-1', name: 'Singapore', continent: 'Asia', location: 'Singapore' },
          { id: 'ap-northeast-1', name: 'Japan (Tokyo)', continent: 'Asia', location: 'Tokyo' }
        ]
      });
    }
    
    return Promise.resolve({ data: fallbackRegions[providerId] || [] });
  },
  
  getServiceMappings: () => {
    return Promise.resolve({ 
      data: {
        compute: {
          aws: 'EC2',
          azure: 'Virtual Machines',
          gcp: 'Compute Engine',
          oracle: 'Compute',
          ibm: 'Virtual Servers',
          alibaba: 'ECS'
        },
        storage: {
          aws: 'S3/EBS',
          azure: 'Blob Storage/Managed Disks',
          gcp: 'Cloud Storage/Persistent Disk',
          oracle: 'Object Storage/Block Volumes',
          ibm: 'Cloud Object Storage/Block Storage',
          alibaba: 'OSS/Disk'
        },
        database: {
          aws: 'RDS/DynamoDB',
          azure: 'Azure SQL/Cosmos DB',
          gcp: 'Cloud SQL/Firestore',
          oracle: 'Database/NoSQL',
          ibm: 'Db2/Cloudant',
          alibaba: 'RDS/MongoDB'
        },
        networking: {
          aws: 'VPC/Direct Connect',
          azure: 'VNet/ExpressRoute',
          gcp: 'VPC/Cloud Interconnect',
          oracle: 'VCN/FastConnect',
          ibm: 'VPC/Direct Link',
          alibaba: 'VPC/Express Connect'
        },
        serverless: {
          aws: 'Lambda',
          azure: 'Functions',
          gcp: 'Cloud Functions',
          oracle: 'Functions',
          ibm: 'Cloud Functions',
          alibaba: 'Function Compute'
        },
        managedServices: {
          aws: 'EKS/ECS',
          azure: 'AKS',
          gcp: 'GKE',
          oracle: 'OKE',
          ibm: 'IKS',
          alibaba: 'ACK'
        }
      } 
    });
  },
  
  // Pricing Service
  calculatePricing: (workload) => {
    const pricing = generatePricingData(workload);
    return Promise.resolve({ data: pricing });
  },
  
  // Recommendation Service
  getRecommendations: (workload) => {
  const pricing = generatePricingData(workload);
  const recommendations = generateRecommendations(workload, pricing);

  return Promise.resolve({ data: recommendations });
}
};

export default simulateApi;