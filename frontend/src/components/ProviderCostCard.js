import React, { useState } from 'react';
import ResourceDetailsModal from './ResourceDetailsModal';

const ProviderCostCard = ({ provider, data, color }) => {
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    resourceType: null,
    details: null
  });
  
  const formatProviderName = () => {
    switch (provider) {
      case 'aws':
        return 'AWS';
      case 'azure':
        return 'Azure';
      case 'gcp':
        return 'Google Cloud';
      default:
        return provider;
    }
  };
  
  const showResourceDetails = (resourceType) => {
    let details = null;
    
    if (data.details && data.details[resourceType]?.[0]) {
      details = data.details[resourceType][0];
    }
    
    setDetailsModal({
      isOpen: true,
      resourceType,
      provider,
      details
    });
  };
  
  const closeModal = () => {
    setDetailsModal({
      isOpen: false,
      resourceType: null,
      details: null
    });
  };
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className={`flex items-center mb-3 text-${color}`}>
        <div className={`w-3 h-3 rounded-full bg-${color} mr-2`}></div>
        <h3 className="text-lg font-semibold">{formatProviderName()}</h3>
      </div>
      
      <div className="text-3xl font-bold mb-4">${data.total}/mo</div>
      
      <div className="space-y-2">
        <div 
          className="flex justify-between py-1 border-b border-gray-100 cursor-pointer hover:bg-gray-50 px-2 rounded"
          onClick={() => showResourceDetails('compute')}
        >
          <span className="text-sm text-gray-600">Compute:</span>
          <span className="text-sm font-medium">${data.compute}/mo</span>
          <span className="text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </span>
        </div>
        
        <div 
          className="flex justify-between py-1 border-b border-gray-100 cursor-pointer hover:bg-gray-50 px-2 rounded"
          onClick={() => showResourceDetails('storage')}
        >
          <span className="text-sm text-gray-600">Storage:</span>
          <span className="text-sm font-medium">${data.storage}/mo</span>
          <span className="text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </span>
        </div>
        
        <div 
          className="flex justify-between py-1 cursor-pointer hover:bg-gray-50 px-2 rounded"
          onClick={() => showResourceDetails('database')}
        >
          <span className="text-sm text-gray-600">Database:</span>
          <span className="text-sm font-medium">${data.database}/mo</span>
          <span className="text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </span>
        </div>
      </div>
      
      <ResourceDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={closeModal}
        resourceType={detailsModal.resourceType}
        provider={detailsModal.provider}
        details={detailsModal.details}
      />
    </div>
  );
};

export default ProviderCostCard;