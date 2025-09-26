import React from 'react';

const ResourceDetailsModal = ({ isOpen, onClose, resourceType, provider, details }) => {
  if (!isOpen || !details) return null;
  
  const formatTitle = () => {
    const formattedProvider = provider === 'aws' ? 'AWS' : 
                             provider === 'azure' ? 'Azure' : 
                             provider === 'gcp' ? 'Google Cloud' : provider;
    
    const formattedType = resourceType === 'compute' ? 'Compute' :
                         resourceType === 'storage' ? 'Storage' :
                         resourceType === 'database' ? 'Database' : resourceType;
    
    return `${formattedProvider} ${formattedType} Details`;
  };
  
  const renderComputeDetails = () => {
    if (!details.specs) return <p>No detailed information available</p>;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-500">vCPUs</div>
            <div className="font-semibold">{details.specs.vcpu}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-500">Memory</div>
            <div className="font-semibold">{details.specs.memory} GB</div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm font-medium text-gray-500">Instance Type</div>
          <div className="font-semibold">{details.instanceType}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-500">Hourly Cost</div>
            <div className="font-semibold">${details.hourlyCost.toFixed(4)}/hour</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-500">Monthly Cost</div>
            <div className="font-semibold">${details.monthlyCost.toFixed(2)}/month</div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderStorageDetails = () => {
    if (!details.details) return <p>No detailed information available</p>;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-500">Storage Type</div>
            <div className="font-semibold">{details.type}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-500">Size</div>
            <div className="font-semibold">{details.sizeGB} GB</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-500">Cost per GB</div>
            <div className="font-semibold">${details.costPerGBPerMonth.toFixed(4)}/GB-month</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-500">Monthly Cost</div>
            <div className="font-semibold">${details.monthlyCost.toFixed(2)}/month</div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm font-medium text-gray-500">Durability</div>
          <div className="font-semibold">{details.details.durability || 'N/A'}</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm font-medium text-gray-500">Availability</div>
          <div className="font-semibold">{details.details.availability || 'N/A'}</div>
        </div>
        
        {details.details.min_storage_duration && (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-500">Minimum Storage Duration</div>
            <div className="font-semibold">{details.details.min_storage_duration}</div>
          </div>
        )}
        
        {details.details.data_transfer_out && (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-500">Data Transfer Out Cost</div>
            <div className="font-semibold">{details.details.data_transfer_out}</div>
          </div>
        )}
        
        {details.details.lifecycle_policies !== undefined && (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-500">Lifecycle Policies Support</div>
            <div className="font-semibold">{details.details.lifecycle_policies ? 'Yes' : 'No'}</div>
          </div>
        )}
        
        {details.type === 'block' && (
          <>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm font-medium text-gray-500">Volume Type</div>
              <div className="font-semibold">{details.details.volume_type || 'N/A'}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm font-medium text-gray-500">IOPS</div>
              <div className="font-semibold">{details.details.iops || 'N/A'}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm font-medium text-gray-500">Throughput</div>
              <div className="font-semibold">{details.details.throughput || 'N/A'}</div>
            </div>
          </>
        )}
      </div>
    );
  };
  
  const renderDatabaseDetails = () => {
    if (!details.details) return <p>No detailed information available</p>;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-500">Database Type</div>
            <div className="font-semibold">{details.type}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-500">Monthly Cost</div>
            <div className="font-semibold">${details.monthlyCost.toFixed(2)}/month</div>
          </div>
        </div>
        
        {details.details.vcpu && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm font-medium text-gray-500">vCPUs</div>
              <div className="font-semibold">{details.details.vcpu}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm font-medium text-gray-500">Memory</div>
              <div className="font-semibold">{details.details.memory}</div>
            </div>
          </div>
        )}
        
        {details.details.storage && (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-500">Included Storage</div>
            <div className="font-semibold">{details.details.storage}</div>
          </div>
        )}
        
        {details.details.backups && (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-500">Backup Policy</div>
            <div className="font-semibold">{details.details.backups}</div>
          </div>
        )}
        
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm font-medium text-gray-500">Dormancy Policy</div>
          <div className="font-semibold">{details.details.dormancy_policy || 'N/A'}</div>
          <div className="text-xs text-gray-500 mt-1">
            What happens when database is not actively used
          </div>
        </div>
        
        {details.details.auto_scaling !== undefined && (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-500">Auto-scaling Support</div>
            <div className="font-semibold">{details.details.auto_scaling ? 'Yes' : 'No'}</div>
          </div>
        )}
        
        {details.type === 'nosql' && (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium text-gray-500">Consistency Model</div>
            <div className="font-semibold">{details.details.consistency || 'N/A'}</div>
          </div>
        )}
      </div>
    );
  };
  
  const renderContent = () => {
    switch (resourceType) {
      case 'compute':
        return renderComputeDetails();
      case 'storage':
        return renderStorageDetails();
      case 'database':
        return renderDatabaseDetails();
      default:
        return <p>No details available</p>;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{formatTitle()}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {renderContent()}
        </div>
        
        <div className="px-6 py-3 bg-gray-50 rounded-b-lg text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailsModal;