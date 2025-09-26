import React from 'react';
import { useWorkload } from '../context/WorkloadContext';

const CloudProviderSelector = ({ onSelect }) => {
  const { workload, updateWorkload } = useWorkload();
  
  const providers = [
    { id: 'aws', name: 'Amazon Web Services', color: 'text-aws' },
    { id: 'azure', name: 'Microsoft Azure', color: 'text-azure' },
    { id: 'gcp', name: 'Google Cloud Platform', color: 'text-gcp' },
    { id: 'oracle', name: 'Oracle Cloud', color: 'text-orange-500' },
    { id: 'ibm', name: 'IBM Cloud', color: 'text-blue-700' },
    { id: 'alibaba', name: 'Alibaba Cloud', color: 'text-red-600' }
  ];
  
  const handleProviderSelection = (providerId) => {
    updateWorkload({ preferred_provider: providerId });
    if (onSelect) onSelect(providerId);
  };
  
  // For existing provider selection
  const handleExistingProviderSelection = (providerId) => {
    updateWorkload({ existingProvider: providerId });
  };
  
  return (
    <div>
      {workload.userType === 'business' && (
        <div className="mb-6">
          <label className="form-label">Do you currently use cloud services?</label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <button
              type="button"
              className={`border rounded-lg p-4 text-center transition-colors ${
                workload.existingProvider !== null ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => handleExistingProviderSelection(workload.preferred_provider || 'aws')}
            >
              <div className="font-semibold text-green-600 mb-2">Yes</div>
              <div className="text-xs text-gray-500">I'm currently using cloud services</div>
            </button>
            
            <button
              type="button"
              className={`border rounded-lg p-4 text-center transition-colors ${
                workload.existingProvider === null ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => handleExistingProviderSelection(null)}
            >
              <div className="font-semibold text-blue-600 mb-2">No</div>
              <div className="text-xs text-gray-500">I'm not using cloud services yet</div>
            </button>
          </div>
        </div>
      )}
      
      {workload.existingProvider !== null && (
        <div className="mb-6">
          <label className="form-label">Which cloud provider are you currently using?</label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {providers.map(provider => (
              <div 
                key={provider.id}
                className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  workload.existingProvider === provider.id ? 
                    `border-${provider.color.split('-')[1]} bg-${provider.color.split('-')[1]}-50` : 
                    'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleExistingProviderSelection(provider.id)}
              >
                <div className={`font-semibold ${provider.color} mb-2`}>
                  {provider.id.toUpperCase()}
                </div>
                <div className="text-xs text-gray-500">{provider.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <label className="form-label">
          {workload.userType === 'business' 
            ? 'Preferred Cloud Provider for Cost Analysis' 
            : 'Target Cloud Provider for Deployment'}
        </label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {providers.map(provider => (
            <div 
              key={provider.id}
              className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                workload.preferred_provider === provider.id ? 
                  provider.id === 'aws' ? 'border-aws bg-orange-50' : 
                  provider.id === 'azure' ? 'border-azure bg-blue-50' : 
                  provider.id === 'gcp' ? 'border-gcp bg-blue-50' :
                  provider.id === 'oracle' ? 'border-orange-500 bg-orange-50' :
                  provider.id === 'ibm' ? 'border-blue-700 bg-blue-50' :
                  'border-red-600 bg-red-50' : 
                  'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => handleProviderSelection(provider.id)}
            >
              <div className={`font-semibold ${provider.color} mb-2`}>
                {provider.id.toUpperCase()}
              </div>
              <div className="text-xs text-gray-500">{provider.name}</div>
            </div>
          ))}
        </div>
        
        {workload.userType === 'business' ? (
          <p className="mt-1 text-sm text-gray-500">
            Select your preferred cloud provider for detailed cost optimization recommendations
          </p>
        ) : (
          <p className="mt-1 text-sm text-gray-500">
            Select the cloud provider you're targeting for deployment and technical optimization
          </p>
        )}
      </div>
    </div>
  );
};

export default CloudProviderSelector;