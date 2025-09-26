import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkload } from '../context/WorkloadContext';
import apiService from '../services/api';
import RegionSelector from '../components/RegionSelector';
import CloudProviderSelector from '../components/CloudProviderSelector';
import fallbackProviders from '../data/fallbackProviders';

const WorkloadForm = () => {
  const { 
    workload, 
    updateWorkload, 
    resetWorkload, 
    setPricing, 
    setRecommendations,
    addComputeResource,  
    addStorageResource,  
    addDatabaseResource,
    addNetworkingResource,
    addServerlessResource,
    addManagedService
  } = useWorkload();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [providers, setProviders] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("WorkloadForm mounted");
    const fetchProviderData = async () => {
      try {
        resetWorkload();
        updateWorkload({ userType: 'developer' });
        
        try {
          console.log("Fetching providers...");
          const providersResponse = await apiService.getProviders();
          console.log("Providers response:", providersResponse.data);
          setProviders(providersResponse.data);
        } catch (err) {
          console.error("Error fetching providers:", err);
          setProviders(fallbackProviders);
        }
        
      } catch (err) {
        setError('Error fetching cloud provider data');
        console.error(err);
        setProviders(fallbackProviders);
      }
    };
    
    fetchProviderData();
  }, [resetWorkload, updateWorkload]);
  
  const handleRegionChange = (provider, region) => {
    updateWorkload({
      region: {
        ...workload.region,
        [provider]: region
      }
    });
  };
  
  const handlePreferredProviderChange = (provider) => {
    updateWorkload({ preferred_provider: provider });
  };
  
  const handleTechnicalRequirementChange = (requirement, value) => {
    updateWorkload({
      technicalRequirements: {
        ...(workload.technicalRequirements || {}),
        [requirement]: value
      }
    });
  };
  
  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async (e) => {
    console.log("Form submitted", { currentStep: step });
    e.preventDefault();
    
    if (step < 4) {
      handleNextStep();
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Calculating costs for workload:", workload);
      
      if (!workload.compute || workload.compute.length === 0) {
        throw new Error('At least one compute resource is required');
      }
      
      try {
        console.log("Requesting pricing calculation...");
        const pricingResponse = await apiService.calculatePricing(workload);
        console.log("Pricing response:", pricingResponse.data);
        setPricing(pricingResponse.data);
        
        console.log("Requesting recommendations...");
        const recommendationsResponse = await apiService.getRecommendations(workload);
        console.log("Recommendations response:", recommendationsResponse.data);
        setRecommendations(recommendationsResponse.data);
      } catch (apiError) {
        console.error('API Error:', apiError);
      }
      
      console.log("Navigating to dashboard");
      navigate('/');
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.error || err.message || 'An error occurred');
      setIsLoading(false);
    }
  };
  
  const handleUpdateCompute = (index, field, value) => {
    const updatedCompute = [...(workload.compute || [])];
    if (!updatedCompute[index].provider) {
        updatedCompute[index].provider = 'aws'; 
    }
    updatedCompute[index][field] = value;
    
    updateWorkload({
      compute: updatedCompute
    });
  };
  
  const handleRemoveCompute = (index) => {
    const updatedCompute = [...(workload.compute || [])];
    updatedCompute.splice(index, 1);
    
    updateWorkload({
      compute: updatedCompute
    });
  };
  
  const handleUpdateStorage = (index, field, value) => {
    const updatedStorage = [...(workload.storage || [])];
    updatedStorage[index][field] = value;
    
    updateWorkload({
      storage: updatedStorage
    });
  };
  
  const handleRemoveStorage = (index) => {
    const updatedStorage = [...(workload.storage || [])];
    updatedStorage.splice(index, 1);
    
    updateWorkload({
      storage: updatedStorage
    });
  };
  
  const handleUpdateDatabase = (index, field, value) => {
    const updatedDatabase = [...(workload.database || [])];
    updatedDatabase[index][field] = value;
    
    updateWorkload({
      database: updatedDatabase
    });
  };
  
  const handleRemoveDatabase = (index) => {
    const updatedDatabase = [...(workload.database || [])];
    updatedDatabase.splice(index, 1);
    
    updateWorkload({
      database: updatedDatabase
    });
  };
  
  const handleUpdateNetworking = (index, field, value) => {
    const updatedNetworking = [...(workload.networking || [])];
    updatedNetworking[index][field] = value;
    
    updateWorkload({
      networking: updatedNetworking
    });
  };
  
  const handleRemoveNetworking = (index) => {
    const updatedNetworking = [...(workload.networking || [])];
    updatedNetworking.splice(index, 1);
    
    updateWorkload({
      networking: updatedNetworking
    });
  };
  
  const handleUpdateServerless = (index, field, value) => {
    const updatedServerless = [...(workload.serverless || [])];
    updatedServerless[index][field] = value;
    
    updateWorkload({
      serverless: updatedServerless
    });
  };
  
  const handleRemoveServerless = (index) => {
    const updatedServerless = [...(workload.serverless || [])];
    updatedServerless.splice(index, 1);
    
    updateWorkload({
      serverless: updatedServerless
    });
  };
  
  const handleUpdateManagedService = (index, field, value) => {
    const updatedManagedServices = [...(workload.managedServices || [])];
    updatedManagedServices[index][field] = value;
    
    updateWorkload({
      managedServices: updatedManagedServices
    });
  };
  
  const handleRemoveManagedService = (index) => {
    const updatedManagedServices = [...(workload.managedServices || [])];
    updatedManagedServices.splice(index, 1);
    
    updateWorkload({
      managedServices: updatedManagedServices
    });
  };
  
  const getResourceDescription = (resourceType) => {
    switch(resourceType) {
      case 'compute':
        return "Compute resources (servers, virtual machines) are needed to run your applications and services. They're the foundation of your cloud infrastructure.";
      case 'storage':
        return "Storage resources let you save files, application data, backups and more. Choose between object storage (like S3) for files and block storage for server disks.";
      case 'database':
        return "Database resources provide managed database services optimized for different workloads. Choose relational databases for structured data or NoSQL for flexible schemas.";
      case 'networking':
        return "Networking resources connect your cloud components and provide access to the internet. This includes load balancers, data transfer, VPNs, and more.";
      case 'serverless':
        return "Serverless resources provide event-driven, auto-scaling compute without managing servers. Pay only for the exact compute resources your code uses.";
      case 'managedServices':
        return "Managed services provide fully-managed solutions for common infrastructure needs like container orchestration, message queues, and caching.";
      default:
        return "";
    }
  };
  
  console.log("Current workload state:", workload);
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Technical Cloud Architecture</h1>
      
      <div className="mb-8">
        <div className="flex items-center">
          {[1, 2, 3, 4].map((s) => (
            <React.Fragment key={s}>
              <div 
                className={`rounded-full h-10 w-10 flex items-center justify-center ${
                  s === step ? 'bg-purple-600 text-white' : s < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s < step ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  s
                )}
              </div>
              
              {s < 4 && (
                <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div className="flex justify-between mt-2">
          <div className="text-xs font-medium text-gray-600">Provider Selection</div>
          <div className="text-xs font-medium text-gray-600">Compute Architecture</div>
          <div className="text-xs font-medium text-gray-600">Data & Networking</div>
          <div className="text-xs font-medium text-gray-600">Review & Deploy</div>
        </div>
      </div>
      
      <div className="card">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-6">Select Cloud Providers and Technical Requirements</h2>
              
              <CloudProviderSelector />
              
              <div className="mt-8 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Technical Requirements</h3>
                
                <div className="mb-6">
                  <label className="form-label">Architecture Pattern</label>
                  <select 
                    className="input-field"
                    value={workload.technicalRequirements?.architecturePattern || 'traditional'}
                    onChange={(e) => handleTechnicalRequirementChange('architecturePattern', e.target.value)}
                  >
                    <option value="traditional">Traditional (Monolithic)</option>
                    <option value="microservices">Microservices</option>
                    <option value="serverless">Serverless</option>
                    <option value="hybrid">Hybrid (Microservices + Serverless)</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    This impacts the types of services and resources recommended
                  </p>
                </div>
                
                <div className="mb-6">
                  <label className="form-label">High Availability Requirements</label>
                  <div className="grid grid-cols-1 gap-4 mt-2">
                    <label className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <input 
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-purple-600"
                        checked={workload.technicalRequirements?.highAvailability || false}
                        onChange={(e) => handleTechnicalRequirementChange('highAvailability', e.target.checked)}
                      />
                      <div>
                        <div className="font-medium">High Availability</div>
                        <div className="text-sm text-gray-500">Multi-AZ deployment for fault tolerance</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <input 
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-purple-600"
                        checked={workload.technicalRequirements?.disasterRecovery || false}
                        onChange={(e) => handleTechnicalRequirementChange('disasterRecovery', e.target.checked)}
                      />
                      <div>
                        <div className="font-medium">Disaster Recovery</div>
                        <div className="text-sm text-gray-500">Cross-region backup and recovery capabilities</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <input 
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-purple-600"
                        checked={workload.technicalRequirements?.autoscaling || false}
                        onChange={(e) => handleTechnicalRequirementChange('autoscaling', e.target.checked)}
                      />
                      <div>
                        <div className="font-medium">Auto Scaling</div>
                        <div className="text-sm text-gray-500">Dynamic resource scaling based on load</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <input 
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-purple-600"
                        checked={workload.technicalRequirements?.multiRegion || false}
                        onChange={(e) => handleTechnicalRequirementChange('multiRegion', e.target.checked)}
                      />
                      <div>
                        <div className="font-medium">Multi-Region Deployment</div>
                        <div className="text-sm text-gray-500">Deploy across multiple geographic regions</div>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="form-label">Performance Requirements</label>
                  <select 
                    className="input-field"
                    value={workload.technicalRequirements?.performanceRequirements || 'standard'}
                    onChange={(e) => handleTechnicalRequirementChange('performanceRequirements', e.target.value)}
                  >
                    <option value="standard">Standard (Average workload)</option>
                    <option value="high">High Performance (CPU optimized)</option>
                    <option value="memory">Memory Intensive</option>
                    <option value="storage">Storage Optimized</option>
                    <option value="gpu">GPU/Machine Learning</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    Helps us recommend instance types optimized for your workload
                  </p>
                </div>
                
                <div className="mb-6">
                  <label className="form-label">CI/CD Integration Needs</label>
                  <select 
                    className="input-field"
                    value={workload.technicalRequirements?.cicdRequirements || 'basic'}
                    onChange={(e) => handleTechnicalRequirementChange('cicdRequirements', e.target.value)}
                  >
                    <option value="none">None (Manual deployments)</option>
                    <option value="basic">Basic (Simple automation)</option>
                    <option value="advanced">Advanced (Full CI/CD with testing)</option>
                    <option value="gitops">GitOps (Infrastructure as Code)</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    This affects recommended developer tools and services
                  </p>
                </div>
                
                <div className="mb-6">
                  <label className="form-label">Preferred Programming Language</label>
                  <select 
                    className="input-field"
                    value={workload.technicalRequirements?.programmingLanguage || 'JavaScript/Node.js'}
                    onChange={(e) => handleTechnicalRequirementChange('programmingLanguage', e.target.value)}
                  >
                    <option value="JavaScript/Node.js">JavaScript/Node.js</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value=".NET">.NET (C#, F#, etc.)</option>
                    <option value="Go">Go</option>
                    <option value="Ruby">Ruby</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    This helps us evaluate SDK quality and developer experience
                  </p>
                </div>
              </div>
              
              <div className="mt-8 border-t border-gray-200 pt-4">
                <label className="form-label">Configure Regions</label>
                <p className="text-sm text-gray-500 mb-4">
                  Select regions for each cloud provider to calculate pricing and performance metrics
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="form-label text-sm">AWS Region</label>
                    <RegionSelector 
                      provider="aws" 
                      selectedRegion={workload.region?.aws || 'us-east-1'}
                      onChange={(region) => handleRegionChange('aws', region)}
                    />
                  </div>
                  
                  <div>
                    <label className="form-label text-sm">Azure Region</label>
                    <RegionSelector 
                      provider="azure" 
                      selectedRegion={workload.region?.azure || 'eastus'}
                      onChange={(region) => handleRegionChange('azure', region)}
                    />
                  </div>
                  
                  <div>
                    <label className="form-label text-sm">Google Cloud Region</label>
                    <RegionSelector 
                      provider="gcp" 
                      selectedRegion={workload.region?.gcp || 'us-central1'}
                      onChange={(region) => handleRegionChange('gcp', region)}
                    />
                  </div>
                  
                  {['oracle', 'ibm', 'alibaba', 'digitalocean'].includes(workload.preferred_provider) && (
                    <div>
                      {workload.preferred_provider === 'oracle' && (
                        <div>
                          <label className="form-label text-sm">Oracle Cloud Region</label>
                          <select
                            className="input-field"
                            value={workload.region?.oracle || 'us-ashburn-1'}
                            onChange={(e) => handleRegionChange('oracle', e.target.value)}
                          >
                            <option value="us-ashburn-1">US East (Ashburn)</option>
                            <option value="us-phoenix-1">US West (Phoenix)</option>
                            <option value="eu-frankfurt-1">EU (Frankfurt)</option>
                            <option value="uk-london-1">UK (London)</option>
                            <option value="ap-tokyo-1">Japan (Tokyo)</option>
                            <option value="ap-singapore-1">Asia Pacific (Singapore)</option>
                          </select>
                        </div>
                      )}
                      
                      {workload.preferred_provider === 'ibm' && (
                        <div>
                          <label className="form-label text-sm">IBM Cloud Region</label>
                          <select
                            className="input-field"
                            value={workload.region?.ibm || 'us-south'}
                            onChange={(e) => handleRegionChange('ibm', e.target.value)}
                          >
                            <option value="us-south">US South (Dallas)</option>
                            <option value="us-east">US East (Washington DC)</option>
                            <option value="eu-gb">UK (London)</option>
                            <option value="eu-de">EU (Frankfurt)</option>
                            <option value="jp-tok">Japan (Tokyo)</option>
                            <option value="au-syd">Australia (Sydney)</option>
                          </select>
                        </div>
                      )}
                      
                      {workload.preferred_provider === 'alibaba' && (
                        <div>
                          <label className="form-label text-sm">Alibaba Cloud Region</label>
                          <select
                            className="input-field"
                            value={workload.region?.alibaba || 'us-west-1'}
                            onChange={(e) => handleRegionChange('alibaba', e.target.value)}
                          >
                            <option value="us-west-1">US (Silicon Valley)</option>
                            <option value="us-east-1">US (Virginia)</option>
                            <option value="eu-central-1">Germany (Frankfurt)</option>
                            <option value="eu-west-1">UK (London)</option>
                            <option value="ap-southeast-1">Singapore</option>
                            <option value="ap-northeast-1">Japan (Tokyo)</option>
                          </select>
                        </div>
                      )}
                      {workload.preferred_provider === 'digitalocean' && (
                        <div>
                          <label className="form-label text-sm">DigitalOcean Region</label>
                          <select
                            className="input-field"
                            value={workload.region?.digitalocean || 'nyc1'}
                            onChange={(e) => handleRegionChange('digitalocean', e.target.value)}
                          >
                            <option value="nyc1">New York 1</option>
                            <option value="sfo3">San Francisco 3</option>
                            <option value="tor1">Toronto 1</option>
                            <option value="lon1">London 1</option>
                            <option value="fra1">Frankfurt 1</option>
                            <option value="ams3">Amsterdam 3</option>
                            <option value="sgp1">Singapore 1</option>
                            <option value="blr1">Bangalore 1</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Define Compute Architecture</h2>
              <p className="text-gray-600 mb-6">{getResourceDescription('compute')}</p>
              
              {(workload.compute || []).length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg mb-6">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                  </svg>
                  <p className="text-gray-500 mb-4">No compute resources defined yet</p>
                  <button 
                    type="button"
                    className="btn-developer"
                    onClick={addComputeResource}
                  >
                    Add Compute Resource
                  </button>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {(workload.compute || []).map((compute, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-700">Compute Resource #{index + 1}</h3>
                        <button 
                          type="button"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleRemoveCompute(index)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
{/* START MODIFICATION */}
                        <div>
                          <label className="form-label">Provider</label>
                          <select 
                            className="input-field"
                            value={compute.provider || 'aws'}
                            onChange={(e) => handleUpdateCompute(index, 'provider', e.target.value)}
                          >
                            {providers.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>
{/* END MODIFICATION */}
                        <div>
                          <label className="form-label">Instance Size</label>
                          <select 
                            className="input-field"
                            value={compute.size || 'medium'}
                            onChange={(e) => handleUpdateCompute(index, 'size', e.target.value)}
                          >
                            <option value="small">Small (1-2 vCPU, 2-4 GB RAM)</option>
                            <option value="medium">Medium (2-4 vCPU, 4-8 GB RAM)</option>
                            <option value="large">Large (4-8 vCPU, 16-32 GB RAM)</option>
                            <option value="xlarge">X-Large (8+ vCPU, 32+ GB RAM)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="form-label">Number of Instances</label>
                          <input 
                            type="number"
                            min="1"
                            className="input-field"
                            value={compute.quantity || 1}
                            onChange={(e) => handleUpdateCompute(index, 'quantity', parseInt(e.target.value) || 1)}
                          />
                        </div>
                        
                        <div>
                          <label className="form-label">Hours per Month</label>
                          <select 
                            className="input-field"
                            value={compute.hoursPerMonth || 730}
                            onChange={(e) => handleUpdateCompute(index, 'hoursPerMonth', parseInt(e.target.value))}
                          >
                            <option value="730">24/7 (730 hours/month)</option>
                            <option value="400">Business hours + weekends (400 hours/month)</option>
                            <option value="160">Business hours only (160 hours/month)</option>
                            <option value="80">Part-time (80 hours/month)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="form-label">Utilization (%)</label>
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            value={compute.utilization || 50}
                            onChange={(e) => handleUpdateCompute(index, 'utilization', parseInt(e.target.value))}
                          />
                          <div className="flex justify-between text-xs text-gray-600 mt-1">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="form-label">Instance Type</label>
                          <select 
                            className="input-field"
                            value={compute.instanceType || 'general'}
                            onChange={(e) => handleUpdateCompute(index, 'instanceType', e.target.value)}
                          >
                            <option value="general">General Purpose</option>
                            <option value="compute">Compute Optimized</option>
                            <option value="memory">Memory Optimized</option>
                            <option value="storage">Storage Optimized</option>
                            <option value="gpu">GPU Instances</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="form-label">Operating System</label>
                          <select 
                            className="input-field"
                            value={compute.os || 'linux'}
                            onChange={(e) => handleUpdateCompute(index, 'os', e.target.value)}
                          >
                            <option value="linux">Linux</option>
                            <option value="windows">Windows</option>
                            <option value="rhel">Red Hat Enterprise Linux</option>
                            <option value="suse">SUSE Linux</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    type="button"
                    className="btn-secondary w-full"
                    onClick={addComputeResource}
                  >
                    + Add Another Compute Resource
                  </button>
                </div>
              )}
              
              <div className="mt-8 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">Serverless Resources</h3>
                  <button 
                    type="button"
                    className="btn-secondary text-sm"
                    onClick={addServerlessResource}
                  >
                    + Add Serverless
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{getResourceDescription('serverless')}</p>
                
                {(workload.serverless || []).length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg mb-6">
                    <p className="text-gray-500">No serverless resources defined yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {(workload.serverless || []).map((serverless, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-gray-700">Serverless Function #{index + 1}</h4>
                          <button 
                            type="button"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleRemoveServerless(index)}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">Function Type</label>
                            <select 
                              className="input-field"
                              value={serverless.type || 'function'}
                              onChange={(e) => handleUpdateServerless(index, 'type', e.target.value)}
                            >
                              <option value="function">Standard Function</option>
                              <option value="container">Container Function</option>
                              <option value="edge">Edge Function</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="form-label">Memory (MB)</label>
                            <select 
                              className="input-field"
                              value={serverless.memoryMB || 128}
                              onChange={(e) => handleUpdateServerless(index, 'memoryMB', parseInt(e.target.value))}
                            >
                              <option value="128">128 MB</option>
                              <option value="256">256 MB</option>
                              <option value="512">512 MB</option>
                              <option value="1024">1024 MB</option>
                              <option value="2048">2048 MB</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="form-label">Executions per Month</label>
                            <input 
                              type="number"
                              min="1000"
                              step="1000"
                              className="input-field"
                              value={serverless.executionsPerMonth || 1000000}
                              onChange={(e) => handleUpdateServerless(index, 'executionsPerMonth', parseInt(e.target.value) || 1000000)}
                            />
                          </div>
                          
                          <div>
                            <label className="form-label">Average Duration (ms)</label>
                            <input 
                              type="number"
                              min="100"
                              className="input-field"
                              value={serverless.avgDurationMs || 500}
                              onChange={(e) => handleUpdateServerless(index, 'avgDurationMs', parseInt(e.target.value) || 500)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-8 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">Managed Services</h3>
                  <button 
                    type="button"
                    className="btn-secondary text-sm"
                    onClick={addManagedService}
                  >
                    + Add Managed Service
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{getResourceDescription('managedServices')}</p>
                
                {(workload.managedServices || []).length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg mb-6">
                    <p className="text-gray-500">No managed services defined yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {(workload.managedServices || []).map((service, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-gray-700">Managed Service #{index + 1}</h4>
                          <button 
                            type="button"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleRemoveManagedService(index)}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">Service Type</label>
                            <select 
                              className="input-field"
                              value={service.type || 'kubernetes'}
                              onChange={(e) => handleUpdateManagedService(index, 'type', e.target.value)}
                            >
                              <option value="kubernetes">Kubernetes Service</option>
                              <option value="cache">Cache Service</option>
                              <option value="queue">Message Queue</option>
                              <option value="api-gateway">API Gateway</option>
                              <option value="ci-cd">CI/CD Pipeline</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="form-label">Size</label>
                            <select 
                              className="input-field"
                              value={service.size || 'small'}
                              onChange={(e) => handleUpdateManagedService(index, 'size', e.target.value)}
                            >
                              <option value="small">Small</option>
                              <option value="medium">Medium</option>
                              <option value="large">Large</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="form-label">Quantity</label>
                            <input 
                              type="number"
                              min="1"
                              className="input-field"
                              value={service.quantity || 1}
                              onChange={(e) => handleUpdateManagedService(index, 'quantity', parseInt(e.target.value) || 1)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-6">Define Data and Networking Architecture</h2>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">Storage Resources</h3>
                  <button 
                    type="button"
                    className="btn-secondary text-sm"
                    onClick={addStorageResource}
                  >
                    + Add Storage
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{getResourceDescription('storage')}</p>
                
                {(workload.storage || []).length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg mb-6">
                    <p className="text-gray-500">No storage resources defined yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {(workload.storage || []).map((storage, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-gray-700">Storage Resource #{index + 1}</h4>
                          <button 
                            type="button"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleRemoveStorage(index)}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">Storage Type</label>
                            <select 
                              className="input-field"
                              value={storage.type}
                              onChange={(e) => handleUpdateStorage(index, 'type', e.target.value)}
                            >
                              <option value="object">Object Storage (S3, Blob Storage, Cloud Storage)</option>
                              <option value="block">Block Storage (EBS, Managed Disks, Persistent Disk)</option>
                              <option value="file">File Storage (EFS, Azure Files, Filestore)</option>
                              <option value="archive">Archive Storage (Glacier, Archive, Coldline)</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="form-label">Size (GB)</label>
                            <input 
                              type="number"
                              min="1"
                              className="input-field"
                              value={storage.sizeGB}
                              onChange={(e) => handleUpdateStorage(index, 'sizeGB', parseInt(e.target.value) || 1)}
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="form-label">Criticality</label>
                            <div className="flex space-x-4 mt-1">
                              <label className="inline-flex items-center">
                                <input 
                                  type="radio"
                                  className="form-radio"
                                  name={`storage-critical-${index}`}
                                  checked={storage.critical === true}
                                  onChange={() => handleUpdateStorage(index, 'critical', true)}
                                />
                                <span className="ml-2">Critical (High performance needed)</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input 
                                  type="radio"
                                  className="form-radio"
                                  name={`storage-critical-${index}`}
                                  checked={storage.critical === false || storage.critical === undefined}
                                  onChange={() => handleUpdateStorage(index, 'critical', false)}
                                />
                                <span className="ml-2">Standard</span>
                              </label>
                            </div>
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="form-label">Access Pattern</label>
                            <select 
                              className="input-field"
                              value={storage.accessPattern || 'general'}
                              onChange={(e) => handleUpdateStorage(index, 'accessPattern', e.target.value)}
                            >
                              <option value="general">General Purpose</option>
                              <option value="infrequent">Infrequent Access</option>
                              <option value="intensive">IO Intensive</option>
                              <option value="throughput">High Throughput</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">Database Resources</h3>
                  <button 
                    type="button"
                    className="btn-secondary text-sm"
                    onClick={addDatabaseResource}
                  >
                    + Add Database
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{getResourceDescription('database')}</p>
                
                {(workload.database || []).length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg mb-6">
                    <p className="text-gray-500">No database resources defined yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {(workload.database || []).map((database, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-gray-700">Database Resource #{index + 1}</h4>
                          <button 
                            type="button"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleRemoveDatabase(index)}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">Database Type</label>
                            <select 
                              className="input-field"
                              value={database.type}
                              onChange={(e) => handleUpdateDatabase(index, 'type', e.target.value)}
                            >
                              <option value="mysql">Relational (MySQL, PostgreSQL)</option>
                              <option value="nosql">NoSQL (DynamoDB, Cosmos DB, Firestore)</option>
                              <option value="redis">In-Memory Cache (Redis, Memcached)</option>
                              <option value="analytics">Analytics DB (Redshift, Synapse, BigQuery)</option>
                              <option value="graph">Graph DB (Neptune, Cosmos DB Gremlin)</option>
                            </select>
                          </div>
                          
                          {database.type === 'mysql' && (
                            <div>
                              <label className="form-label">Database Tier</label>
                              <select 
                                className="input-field"
                                value={database.tier || 'small'}
                                onChange={(e) => handleUpdateDatabase(index, 'tier', e.target.value)}
                              >
                                <option value="small">Small (Low performance)</option>
                                <option value="medium">Medium (Standard performance)</option>
                                <option value="large">Large (High performance)</option>
                              </select>
                            </div>
                          )}
                          
                          <div>
                            <label className="form-label">Number of Instances</label>
                            <input 
                              type="number"
                              min="1"
                              className="input-field"
                              value={database.quantity || 1}
                              onChange={(e) => handleUpdateDatabase(index, 'quantity', parseInt(e.target.value) || 1)}
                            />
                          </div>
                          
                          <div>
                            <label className="form-label">Hours per Month</label>
                            <select 
                              className="input-field"
                              value={database.hoursPerMonth || 730}
                              onChange={(e) => handleUpdateDatabase(index, 'hoursPerMonth', parseInt(e.target.value))}
                            >
                              <option value="730">24/7 (730 hours/month)</option>
                              <option value="400">Business hours + weekends (400 hours/month)</option>
                              <option value="160">Business hours only (160 hours/month)</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="form-label">Storage Size (GB)</label>
                            <input 
                              type="number"
                              min="10"
                              className="input-field"
                              value={database.storageSizeGB || 100}
                              onChange={(e) => handleUpdateDatabase(index, 'storageSizeGB', parseInt(e.target.value) || 100)}
                            />
                          </div>
                          
                          <div>
                            <label className="form-label">High Availability</label>
                            <select 
                              className="input-field"
                              value={database.highAvailability || 'none'}
                              onChange={(e) => handleUpdateDatabase(index, 'highAvailability', e.target.value)}
                            >
                              <option value="none">None (Single instance)</option>
                              <option value="standby">Standby replica</option>
                              <option value="cluster">Multi-node cluster</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">Networking Resources</h3>
                  <button 
                    type="button"
                    className="btn-secondary text-sm"
                    onClick={addNetworkingResource}
                  >
                    + Add Networking
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{getResourceDescription('networking')}</p>
                
                {(workload.networking || []).length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg mb-6">
                    <p className="text-gray-500">No networking resources defined yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {(workload.networking || []).map((networking, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-gray-700">Networking Resource #{index + 1}</h4>
                          <button 
                            type="button"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleRemoveNetworking(index)}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">Networking Type</label>
                            <select 
                              className="input-field"
                              value={networking.type || 'loadBalancer'}
                              onChange={(e) => handleUpdateNetworking(index, 'type', e.target.value)}
                            >
                              <option value="loadBalancer">Load Balancer</option>
                              <option value="dataTransfer">Data Transfer</option>
                              <option value="vpn">VPN Connection</option>
                              <option value="firewall">Firewall</option>
                              <option value="cdn">Content Delivery Network</option>
                            </select>
                          </div>
                          
                          {networking.type === 'loadBalancer' && (
                            <div>
                              <label className="form-label">Load Balancer Tier</label>
                              <select 
                                className="input-field"
                                value={networking.tier || 'standard'}
                                onChange={(e) => handleUpdateNetworking(index, 'tier', e.target.value)}
                              >
                                <option value="standard">Standard</option>
                                <option value="application">Application (Layer 7)</option>
                                <option value="network">Network (Layer 4)</option>
                              </select>
                            </div>
                          )}
                          
                          {(networking.type === 'dataTransfer' || networking.type === 'cdn') && (
                            <div>
                              <label className="form-label">Data Transfer (GB/month)</label>
                              <input 
                                type="number"
                                min="1"
                                className="input-field"
                                value={networking.dataTransferGB || 100}
                                onChange={(e) => handleUpdateNetworking(index, 'dataTransferGB', parseInt(e.target.value) || 100)}
                              />
                            </div>
                          )}
                          
                          {networking.type === 'vpn' && (
                            <div>
                              <label className="form-label">VPN Type</label>
                              <select 
                                className="input-field"
                                value={networking.vpnType || 'site-to-site'}
                                onChange={(e) => handleUpdateNetworking(index, 'vpnType', e.target.value)}
                              >
                                <option value="site-to-site">Site-to-Site</option>
                                <option value="point-to-site">Point-to-Site</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-6">Review Architecture and Calculate Costs</h2>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">Technical Configuration</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Architecture Pattern</div>
                    <div className="capitalize">{workload.technicalRequirements?.architecturePattern || 'Traditional'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Performance Requirements</div>
                    <div className="capitalize">{workload.technicalRequirements?.performanceRequirements || 'Standard'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">CI/CD Requirements</div>
                    <div className="capitalize">{workload.technicalRequirements?.cicdRequirements || 'Basic'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Preferred Language</div>
                    <div>{workload.technicalRequirements?.programmingLanguage || 'JavaScript/Node.js'}</div>
                  </div>
                </div>
                
                <div className="mt-4 mb-4">
                  <div className="text-sm font-medium text-gray-600 mb-1">Technical Features</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="font-medium">High Availability:</span> {workload.technicalRequirements?.highAvailability ? 'Yes' : 'No'}
                    </div>
                    <div>
                      <span className="font-medium">Disaster Recovery:</span> {workload.technicalRequirements?.disasterRecovery ? 'Yes' : 'No'}
                    </div>
                    <div>
                      <span className="font-medium">Auto Scaling:</span> {workload.technicalRequirements?.autoscaling ? 'Yes' : 'No'}
                    </div>
                    <div>
                      <span className="font-medium">Multi-Region:</span> {workload.technicalRequirements?.multiRegion ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-700 mb-2 mt-4">Regions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">AWS:</span> {workload.region?.aws || 'us-east-1'}
                  </div>
                  <div>
                    <span className="font-medium">Azure:</span> {workload.region?.azure || 'eastus'}
                  </div>
                  <div>
                    <span className="font-medium">GCP:</span> {workload.region?.gcp || 'us-central1'}
                  </div>
                  {workload.region?.oracle && (
                    <div>
                      <span className="font-medium">Oracle:</span> {workload.region.oracle}
                    </div>
                  )}
                  {workload.region?.ibm && (
                    <div>
                      <span className="font-medium">IBM:</span> {workload.region.ibm}
                    </div>
                  )}
                  {workload.region?.alibaba && (
                    <div>
                      <span className="font-medium">Alibaba:</span> {workload.region.alibaba}
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-700 mb-2 mt-4">Compute Resources</h3>
                {(workload.compute || []).length === 0 ? (
                  <p className="text-gray-500">No compute resources defined</p>
                ) : (
                  <div className="space-y-2">
                    {(workload.compute || []).map((compute, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">Compute #{index + 1}:</span> {compute.quantity || 1} × {compute.size || 'medium'} instances, 
                        {compute.hoursPerMonth === 730 ? ' 24/7' : 
                         compute.hoursPerMonth === 400 ? ' Business hours + weekends' : 
                         compute.hoursPerMonth === 160 ? ' Business hours only' : 
                         ` ${compute.hoursPerMonth || 730} hours/month`}, 
                        {compute.utilization || 50}% utilization
                        {compute.instanceType ? `, ${compute.instanceType} optimized` : ''}
                        {compute.os ? `, ${compute.os}` : ''}
                      </div>
                    ))}
                  </div>
                )}
                
                {(workload.serverless || []).length > 0 && (
                  <>
                    <h3 className="font-semibold text-gray-700 mb-2 mt-4">Serverless Resources</h3>
                    <div className="space-y-2">
                      {(workload.serverless || []).map((serverless, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">Function #{index + 1}:</span> {serverless.type || 'function'}, 
                          {serverless.memoryMB || 128}MB, 
                          {(serverless.executionsPerMonth || 1000000).toLocaleString()} executions/month, 
                          {serverless.avgDurationMs || 500}ms avg duration
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                <h3 className="font-semibold text-gray-700 mb-2 mt-4">Storage Resources</h3>
                {(workload.storage || []).length === 0 ? (
                  <p className="text-gray-500">No storage resources defined</p>
                ) : (
                  <div className="space-y-2">
                    {(workload.storage || []).map((storage, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">Storage #{index + 1}:</span> {storage.sizeGB || 100} GB {storage.type || 'object'} storage
                        {storage.critical ? ' (Critical)' : ' (Standard)'}
                        {storage.accessPattern ? `, ${storage.accessPattern} access` : ''}
                      </div>
                    ))}
                  </div>
                )}
                
                <h3 className="font-semibold text-gray-700 mb-2 mt-4">Database Resources</h3>
                {(workload.database || []).length === 0 ? (
                  <p className="text-gray-500">No database resources defined</p>
                ) : (
                  <div className="space-y-2">
                    {(workload.database || []).map((database, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">Database #{index + 1}:</span> {database.quantity || 1} × {database.type || 'mysql'}
                        {database.tier ? ` (${database.tier})` : ''}, 
                        {database.hoursPerMonth === 730 ? ' 24/7' : 
                         database.hoursPerMonth === 400 ? ' Business hours + weekends' : 
                         database.hoursPerMonth === 160 ? ' Business hours only' : 
                         ` ${database.hoursPerMonth || 730} hours/month`}
                        {database.storageSizeGB ? `, ${database.storageSizeGB}GB storage` : ''}
                        {database.highAvailability && database.highAvailability !== 'none' ? `, ${database.highAvailability} HA` : ''}
                      </div>
                    ))}
                  </div>
                )}
                
                {(workload.networking || []).length > 0 && (
                  <>
                    <h3 className="font-semibold text-gray-700 mb-2 mt-4">Networking Resources</h3>
                    <div className="space-y-2">
                      {(workload.networking || []).map((networking, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">Networking #{index + 1}:</span> {networking.type || 'loadBalancer'}
                          {networking.tier ? ` (${networking.tier})` : ''}
                          {networking.dataTransferGB ? `, ${networking.dataTransferGB}GB data transfer` : ''}
                          {networking.vpnType ? `, ${networking.vpnType}` : ''}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                {(workload.managedServices || []).length > 0 && (
                  <>
                    <h3 className="font-semibold text-gray-700 mb-2 mt-4">Managed Services</h3>
                    <div className="space-y-2">
                      {(workload.managedServices || []).map((service, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">Service #{index + 1}:</span> {service.quantity || 1} × {service.type || 'kubernetes'} ({service.size || 'small'})
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-purple-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className="text-sm text-purple-800 mb-1">
                      Clicking "Generate Architecture Analysis" will process your technical configuration to provide:
                    </p>
                    <ul className="text-sm text-purple-700 list-disc pl-5 space-y-1">
                      <li>Technical architecture recommendations</li>
                      <li>Service feature comparisons across providers</li>
                      <li>Developer experience evaluations</li>
                      <li>Performance benchmark analysis</li>
                      <li>Security implementation guidance</li>
                      <li>Cost breakdown for your architecture</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
            {step > 1 ? (
              <button 
                type="button"
                className="btn-secondary"
                onClick={handlePrevStep}
              >
                Back
              </button>
            ) : (
              <div></div>
            )}
            
            {step < 4 ? (
              <button 
                type="button"
                className="btn-developer"
                onClick={handleNextStep}
              >
                Continue
              </button>
            ) : (
              <button 
                type="button"
                className="btn-developer"
                disabled={isLoading}
                onClick={(e) => {
                  console.log("Calculate button clicked");
                  handleSubmit(e);
                }}
              >
                {isLoading ? 'Processing...' : 'Generate Architecture Analysis'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkloadForm;