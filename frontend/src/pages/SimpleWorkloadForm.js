import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkload } from '../context/WorkloadContext';
import apiService from '../services/api';
import RegionSelector from '../components/RegionSelector';
import CloudProviderSelector from '../components/CloudProviderSelector';
import BusinessRequirementsForm from '../components/BusinessRequirementsForm';
import DeveloperRequirementsForm from '../components/DeveloperRequirementsForm';
import fallbackRegions from '../data/fallbackRegions';

const SimpleWorkloadForm = () => {
  const { 
    templates, 
    applyTemplate, 
    updateWorkload, 
    resetWorkload,
    setPricing, 
    setRecommendations, 
    workload 
  } = useWorkload();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [scale, setScale] = useState('medium');
  const [preferredProvider, setPreferredProvider] = useState('aws');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const navigate = useNavigate();

  // Initialize workload on component mount
  useEffect(() => {
    resetWorkload(); // Start with a clean workload
  }, [resetWorkload]);

  // Scale factors for different workload sizes
  const scaleFactor = {
    small: 0.5,
    medium: 1,
    large: 2,
    xlarge: 5
  };

  // Handle scale change
  const handleScaleChange = (value) => {
    setScale(value);
  };

  // Handle provider preference
  const handleProviderChange = (provider) => {
    setPreferredProvider(provider);
  };

  // Apply template and adjust based on scale
  const handleTemplateChange = (e) => {
    const templateName = e.target.value;
    setSelectedTemplate(templateName);
    if (templateName) {
      applyTemplate(templateName);
    }
  };

  // Toggle advanced options
  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log("Calculate button clicked");

    try {
      if (!selectedTemplate) {
        throw new Error('Please select a template');
      }

      // Get the base template
      const baseTemplate = templates[selectedTemplate];
      
      // Apply scale factor to resources
      const scaledWorkload = {
        ...baseTemplate,
        name: `${baseTemplate.name} (${scale} scale)`,
        preferred_provider: preferredProvider,
        deploymentStrategy: workload.deploymentStrategy,
        compute: baseTemplate.compute.map(vm => ({
          ...vm,
          quantity: Math.max(1, Math.round(vm.quantity * scaleFactor[scale]))
        })),
        storage: baseTemplate.storage.map(storage => ({
          ...storage,
          sizeGB: Math.round(storage.sizeGB * scaleFactor[scale])
        })),
        database: baseTemplate.database.map(db => ({
          ...db,
          quantity: Math.max(1, Math.round(db.quantity * scaleFactor[scale]))
        })),
        // Include networking if present in template
        networking: baseTemplate.networking 
          ? baseTemplate.networking.map(net => ({
              ...net,
              dataTransferGB: Math.round(net.dataTransferGB * scaleFactor[scale])
            }))
          : [],
        // Include serverless if present in template
        serverless: baseTemplate.serverless 
          ? baseTemplate.serverless.map(fn => ({
              ...fn,
              executionsPerMonth: Math.round(fn.executionsPerMonth * scaleFactor[scale])
            }))
          : [],
        // Include managed services if present in template
        managedServices: baseTemplate.managedServices 
          ? baseTemplate.managedServices.map(svc => ({
              ...svc,
              quantity: Math.max(1, Math.round(svc.quantity * scaleFactor[scale]))
            }))
          : [],
        // Include region
        region: {
          aws: workload.region?.aws || 'us-east-1',
          azure: workload.region?.azure || 'eastus',
          gcp: workload.region?.gcp || 'us-central1',
          oracle: workload.region?.oracle || 'us-ashburn-1',
          ibm: workload.region?.ibm || 'us-south',
          alibaba: workload.region?.alibaba || 'us-west-1',
          digitalocean: workload.region?.digitalocean || 'nyc1'
        }
      };
      
      console.log('Final workload configuration:', scaledWorkload);
      
      // Update workload in context
      updateWorkload(scaledWorkload);
      
      try {
        console.log('Calculating pricing...');
        // Calculate pricing
        const pricingResponse = await apiService.calculatePricing(scaledWorkload);
        console.log('Pricing response:', pricingResponse.data);
        setPricing(pricingResponse.data);
        
        console.log('Getting recommendations...');
        // Get recommendations
        const recommendationsResponse = await apiService.getRecommendations(scaledWorkload);
        console.log('Recommendations response:', recommendationsResponse.data);
        setRecommendations(recommendationsResponse.data);
      } catch (apiError) {
        console.error('API Error:', apiError);
        // Even with API errors, we'll continue and navigate to dashboard
      }
      
      // Navigate to dashboard
      console.log('Navigating to dashboard...');
      navigate('/');
    } catch (err) {
      console.error('Form error:', err);
      setError(err.response?.data?.error || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to explain templates
  const getTemplateDescription = (templateName) => {
    if (!templateName) return "";
    
    const descriptions = {
      small_website: "Ideal for personal websites, small blogs, or landing pages with low traffic. Includes basic compute, storage, and database resources.",
      ecommerce: "Suitable for online stores with moderate traffic. Includes more compute resources, increased storage, and database capacity for product catalogs.",
      data_analytics: "Designed for processing and analyzing large datasets. Features powerful compute instances and substantial storage capacity.",
      microservices: "Containerized application with multiple services. Includes container orchestration and service mesh infrastructure.",
      serverless_app: "Event-driven architecture using serverless functions. Minimal infrastructure with focus on function execution."
    };
    
    return descriptions[templateName] || "";
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Business Cloud Strategy</h1>
      
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Create a business-focused cloud strategy</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="form-label">Select Workload Template</label>
            <select 
              className="input-field"
              value={selectedTemplate}
              onChange={handleTemplateChange}
              required
            >
              <option value="">Select a template...</option>
              <option value="small_website">Small Website</option>
              <option value="ecommerce">E-commerce Application</option>
              <option value="data_analytics">Data Analytics Platform</option>
              <option value="microservices">Microservices Architecture</option>
              <option value="serverless_app">Serverless Application</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {getTemplateDescription(selectedTemplate) || "Choose a predefined workload that best matches your needs"}
            </p>
          </div>
          
          {selectedTemplate && (
            <>
              <div className="mb-6">
                <label className="form-label">Scale</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="3" 
                    value={['small', 'medium', 'large', 'xlarge'].indexOf(scale)}
                    onChange={(e) => handleScaleChange(['small', 'medium', 'large', 'xlarge'][e.target.value])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                  <span>X-Large</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {scale === 'small' && 'Small: For minimal workloads with low traffic'}
                  {scale === 'medium' && 'Medium: For standard workloads with moderate traffic'}
                  {scale === 'large' && 'Large: For higher traffic workloads with increased resource needs'}
                  {scale === 'xlarge' && 'X-Large: For intensive workloads with significant resource requirements'}
                </p>
              </div>

{/* START MODIFICATION */}
              <div className="mb-6">
                <label className="form-label">Deployment Strategy</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deploymentStrategy"
                      value="single-cloud"
                      checked={workload.deploymentStrategy === 'single-cloud'}
                      onChange={(e) => updateWorkload({ deploymentStrategy: e.target.value })}
                      className="form-radio"
                    />
                    <span className="ml-2">Single Cloud</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deploymentStrategy"
                      value="multi-cloud"
                      checked={workload.deploymentStrategy === 'multi-cloud'}
                      onChange={(e) => updateWorkload({ deploymentStrategy: e.target.value })}
                      className="form-radio"
                    />
                    <span className="ml-2">Multi-Cloud</span>
                  </label>
                </div>
              </div>
{/* END MODIFICATION */}
              
{/* Business Type Selection */}
<div className="mb-6">
  <label className="form-label">Business Type</label>
  <select 
    className="input-field"
    value={workload.businessType || 'general'}
    onChange={(e) => updateWorkload({ businessType: e.target.value })}
  >
    <option value="general">General Business</option>
    <option value="ecommerce">E-commerce / Retail</option>
    <option value="finance">Financial Services</option>
    <option value="healthcare">Healthcare</option>
    <option value="media">Media & Entertainment</option>
    <option value="manufacturing">Manufacturing</option>
    <option value="education">Education</option>
    <option value="government">Government / Public Sector</option>
  </select>
  <p className="mt-1 text-sm text-gray-500">
    This helps us provide industry-specific recommendations
  </p>
</div>

{/* Compliance Requirements */}
<div className="mb-6">
  <label className="form-label">Compliance Requirements</label>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-2">
    {['GDPR', 'HIPAA', 'PCI DSS', 'SOC2', 'ISO 27001', 'FedRAMP'].map(compliance => {
      const isSelected = (workload.complianceRequirements || []).includes(compliance);
      return (
        <button
          key={compliance}
          type="button"
          className={`px-3 py-2 text-sm font-medium rounded border ${
            isSelected 
              ? 'bg-blue-50 border-blue-300 text-blue-700' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => {
            const current = [...(workload.complianceRequirements || [])];
            if (isSelected) {
              updateWorkload({ 
                complianceRequirements: current.filter(c => c !== compliance) 
              });
            } else {
              updateWorkload({ 
                complianceRequirements: [...current, compliance] 
              });
            }
          }}
        >
          {compliance}
        </button>
      );
    })}
  </div>
  <p className="mt-1 text-sm text-gray-500">
    Select any compliance standards that your cloud infrastructure must adhere to
  </p>
</div>

{/* Business Metrics */}
<div className="mb-6">
  <label className="form-label">Business Growth Projection</label>
  <select 
    className="input-field"
    value={workload.businessMetrics?.expectedGrowth || 'moderate'}
    onChange={(e) => updateWorkload({
      businessMetrics: {
        ...(workload.businessMetrics || {}),
        expectedGrowth: e.target.value
      }
    })}
  >
    <option value="low">Low Growth (0-20% yearly)</option>
    <option value="moderate">Moderate Growth (20-50% yearly)</option>
    <option value="high">High Growth (50-100% yearly)</option>
    <option value="rapid">Rapid Growth (100%+ yearly)</option>
  </select>
  <p className="mt-1 text-sm text-gray-500">
    This helps us forecast future costs and recommend the right scaling strategy
  </p>
</div>

<div className="mb-6">
  <label className="form-label">Monthly Budget Constraint (USD)</label>
  <input 
    type="number"
    min="0"
    placeholder="Enter your monthly budget limit"
    className="input-field"
    value={workload.businessMetrics?.budgetConstraint || ''}
    onChange={(e) => updateWorkload({
      businessMetrics: {
        ...(workload.businessMetrics || {}),
        budgetConstraint: e.target.value ? parseFloat(e.target.value) : ''
      }
    })}
  />
  <p className="mt-1 text-sm text-gray-500">
    Optional: Helps us provide recommendations within your budget
  </p>
</div>

<div className="mb-6">
  <label className="form-label">Monthly Active Users</label>
  <input 
    type="number"
    min="0"
    placeholder="Enter expected number of users"
    className="input-field"
    value={workload.businessMetrics?.userTraffic || ''}
    onChange={(e) => updateWorkload({
      businessMetrics: {
        ...(workload.businessMetrics || {}),
        userTraffic: e.target.value ? parseInt(e.target.value) : ''
      }
    })}
  />
  <p className="mt-1 text-sm text-gray-500">
    Helps us calculate per-user costs and recommend appropriate sizing
  </p>
</div>
              {/* Cloud Provider Selector */}
              <CloudProviderSelector onSelect={handleProviderChange} />
              
              {/* Advanced Options Toggle */}
              <div className="mb-6">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                  onClick={toggleAdvancedOptions}
                >
                  <svg className={`w-5 h-5 transform transition-transform ${showAdvancedOptions ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  <span className="ml-1">Advanced Options</span>
                </button>
              </div>
              
              {/* Conditional rendering of advanced options */}
              {showAdvancedOptions && (
                <div className="mb-6 border-l-4 border-blue-200 pl-4">
                  {workload.userType === 'business' ? (
                    <BusinessRequirementsForm />
                  ) : (
                    <DeveloperRequirementsForm />
                  )}
                </div>
              )}
              
              <div className="mb-6">
                <label className="form-label">Preferred Cloud Region</label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="form-label text-sm">AWS Region</label>
                      <RegionSelector 
                        provider="aws" 
                        selectedRegion={workload.region?.aws || 'us-east-1'}
                        onChange={(region) => updateWorkload({
                          region: { ...(workload.region || {}), aws: region }
                        })}
                        fallbackRegions={fallbackRegions}
                      />
                    </div>
                    <div>
                      <label className="form-label text-sm">Azure Region</label>
                      <RegionSelector 
                        provider="azure" 
                        selectedRegion={workload.region?.azure || 'eastus'}
                        onChange={(region) => updateWorkload({
                          region: { ...(workload.region || {}), azure: region }
                        })}
                        fallbackRegions={fallbackRegions}
                      />
                    </div>
                    <div>
                      <label className="form-label text-sm">GCP Region</label>
                      <RegionSelector 
                        provider="gcp" 
                        selectedRegion={workload.region?.gcp || 'us-central1'}
                        onChange={(region) => updateWorkload({
                          region: { ...(workload.region || {}), gcp: region }
                        })}
                        fallbackRegions={fallbackRegions}
                      />
                    </div>
                    
                    {(preferredProvider === 'oracle' || preferredProvider === 'ibm' || preferredProvider === 'alibaba' || preferredProvider === 'digitalocean') && (
                      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                        {preferredProvider === 'oracle' && (
                          <div>
                            <label className="form-label text-sm">Oracle Cloud Region</label>
                            <select
                              className="input-field"
                              value={workload.region?.oracle || 'us-ashburn-1'}
                              onChange={(e) => updateWorkload({
                                region: { ...(workload.region || {}), oracle: e.target.value }
                              })}
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
                        
                        {preferredProvider === 'ibm' && (
                          <div>
                            <label className="form-label text-sm">IBM Cloud Region</label>
                            <select
                              className="input-field"
                              value={workload.region?.ibm || 'us-south'}
                              onChange={(e) => updateWorkload({
                                region: { ...(workload.region || {}), ibm: e.target.value }
                              })}
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
                        
                        {preferredProvider === 'alibaba' && (
                          <div>
                            <label className="form-label text-sm">Alibaba Cloud Region</label>
                            <select
                              className="input-field"
                              value={workload.region?.alibaba || 'us-west-1'}
                              onChange={(e) => updateWorkload({
                                region: { ...(workload.region || {}), alibaba: e.target.value }
                              })}
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
// START MODIFICATION
                        {preferredProvider === 'digitalocean' && (
                            <div>
                                <label className="form-label text-sm">DigitalOcean Region</label>
                                <select
                                    className="input-field"
                                    value={workload.region?.digitalocean || 'nyc1'}
                                    onChange={(e) => updateWorkload({
                                        region: { ...(workload.region || {}), digitalocean: e.target.value }
                                    })}
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
// END MODIFICATION
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Select regions to compare pricing across different geographical locations
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <button 
                  type="submit" 
                  className="btn-primary w-full"
                  disabled={isLoading}
                  onClick={(e) => {
                    console.log("Submit button clicked");
                    handleSubmit(e);
                  }}
                >
                  {isLoading ? 'Calculating...' : 'Calculate Costs'}
                </button>
              </div>
            </>
          )}
        </form>
        
        {selectedTemplate && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Template Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold">{templates[selectedTemplate].name}</h4>
              <p className="text-gray-600 text-sm mb-3">{templates[selectedTemplate].description}</p>
              
              <div className="space-y-2">
                {templates[selectedTemplate].compute && templates[selectedTemplate].compute.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Compute:</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {templates[selectedTemplate].compute.map((vm, i) => (
                        `${Math.round(vm.quantity * scaleFactor[scale])} × ${vm.size} instances${i < templates[selectedTemplate].compute.length - 1 ? ', ' : ''}`
                      ))}
                    </span>
                  </div>
                )}
                
                {templates[selectedTemplate].storage && templates[selectedTemplate].storage.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Storage:</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {templates[selectedTemplate].storage.map((storage, i) => (
                        `${Math.round(storage.sizeGB * scaleFactor[scale])} GB ${storage.type}${i < templates[selectedTemplate].storage.length - 1 ? ', ' : ''}`
                      ))}
                    </span>
                  </div>
                )}
                
                {templates[selectedTemplate].database && templates[selectedTemplate].database.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Database:</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {templates[selectedTemplate].database.map((db, i) => (
                        `${Math.round(db.quantity * scaleFactor[scale])} × ${db.type}${db.tier ? ` (${db.tier})` : ''}${i < templates[selectedTemplate].database.length - 1 ? ', ' : ''}`
                      ))}
                    </span>
                  </div>
                )}
                
                {templates[selectedTemplate].networking && templates[selectedTemplate].networking.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Networking:</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {templates[selectedTemplate].networking.map((net, i) => (
                        `${net.type}${net.tier ? ` (${net.tier})` : ''}, ${Math.round(net.dataTransferGB * scaleFactor[scale])} GB transfer${i < templates[selectedTemplate].networking.length - 1 ? ', ' : ''}`
                      ))}
                    </span>
                  </div>
                )}
                
                {templates[selectedTemplate].serverless && templates[selectedTemplate].serverless.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Serverless:</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {templates[selectedTemplate].serverless.map((fn, i) => (
                        `${fn.type}, ${Math.round(fn.executionsPerMonth * scaleFactor[scale])} executions/month${i < templates[selectedTemplate].serverless.length - 1 ? ', ' : ''}`
                      ))}
                    </span>
                  </div>
                )}
                
                {templates[selectedTemplate].managedServices && templates[selectedTemplate].managedServices.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Managed Services:</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {templates[selectedTemplate].managedServices.map((svc, i) => (
                        `${Math.round(svc.quantity * scaleFactor[scale])} × ${svc.type} (${svc.size})${i < templates[selectedTemplate].managedServices.length - 1 ? ', ' : ''}`
                      ))}
                    </span>
                  </div>
                )}
              </div>
              
              {/* User-specific estimation note */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-sm text-gray-600">
                    {workload.userType === 'business' 
                      ? 'This estimate includes TCO calculations and compliance-related costs for your business needs.' 
                      : 'This estimate includes technical overhead for CI/CD, monitoring, and infrastructure management.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleWorkloadForm;