import React from 'react';
import { useWorkload } from '../context/WorkloadContext';
import providerCharacteristics from '../data/providerCharacteristics';

const ProviderCharacteristics = ({ provider, viewType }) => {
  const { workload } = useWorkload();
  
  if (!provider || !providerCharacteristics[provider]) {
    return null;
  }
  
  const characteristics = providerCharacteristics[provider];
  const view = viewType || workload.userType || 'business';
  
  // Provider color map
  const providerColors = {
    aws: 'text-yellow-600',
    azure: 'text-blue-600',
    gcp: 'text-blue-500',
    oracle: 'text-red-600',
    ibm: 'text-blue-800',
    alibaba: 'text-orange-600'
  };
  
  // Provider display names
  const providerNames = {
    aws: 'AWS',
    azure: 'Azure',
    gcp: 'GCP',
    oracle: 'Oracle Cloud',
    ibm: 'IBM Cloud',
    alibaba: 'Alibaba Cloud'
  };
  
  // Render business view
  if (view === 'business') {
    const businessData = characteristics.business;
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className={`text-xl font-semibold mb-4 ${providerColors[provider]}`}>
          {providerNames[provider]} Business Characteristics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="font-medium text-gray-800 mb-2">{businessData.costStructure.title}</div>
            <p className="text-gray-600 text-sm mb-3">{businessData.costStructure.description}</p>
            <ul className="text-sm text-gray-600">
              {businessData.costStructure.details.map((detail, idx) => (
                <li key={idx} className="flex items-start mb-1">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="font-medium text-gray-800 mb-2">{businessData.compliance.title}</div>
            <p className="text-gray-600 text-sm mb-3">{businessData.compliance.description}</p>
            <div className="flex flex-wrap gap-2">
              {businessData.compliance.certifications.map((cert, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {cert}
                </span>
              ))}
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="font-medium text-gray-800 mb-2">{businessData.globalPresence.title}</div>
            <p className="text-gray-600 text-sm mb-3">{businessData.globalPresence.description}</p>
            <div className="flex flex-wrap gap-2">
              {businessData.globalPresence.regions.map((region, idx) => (
                <span key={idx} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                  {region}
                </span>
              ))}
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="font-medium text-gray-800 mb-2">{businessData.support.title}</div>
            <p className="text-gray-600 text-sm mb-3">{businessData.support.description}</p>
            <div className="flex items-center space-x-1">
              {businessData.support.tiers.map((tier, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-full h-1 bg-gray-200 mb-1">
                    <div className="h-full bg-blue-500" style={{ width: `${(idx + 1) * 100 / businessData.support.tiers.length}%` }}></div>
                  </div>
                  <span className="text-xs text-gray-600">{tier}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render technical view
  const technicalData = characteristics.technical;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className={`text-xl font-semibold mb-4 ${providerColors[provider]}`}>
        {providerNames[provider]} Technical Characteristics
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="font-medium text-gray-800 mb-2">{technicalData.architecture.title}</div>
          <p className="text-gray-600 text-sm mb-3">{technicalData.architecture.description}</p>
          <div className="flex items-center">
            <div className="text-sm text-gray-500 mr-2">Architecture Strength:</div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <svg 
                  key={star} 
                  className={`h-4 w-4 ${star <= technicalData.architecture.strength ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="font-medium text-gray-800 mb-2">{technicalData.deployment.title}</div>
          <p className="text-gray-600 text-sm mb-3">{technicalData.deployment.description}</p>
          <div className="flex items-center">
            <div className="text-sm text-gray-500 mr-2">Deployment Strength:</div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <svg 
                  key={star} 
                  className={`h-4 w-4 ${star <= technicalData.deployment.strength ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="font-medium text-gray-800 mb-2">{technicalData.developer.title}</div>
          <p className="text-gray-600 text-sm mb-3">{technicalData.developer.description}</p>
          <div className="flex items-center">
            <div className="text-sm text-gray-500 mr-2">Developer Experience:</div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <svg 
                  key={star} 
                  className={`h-4 w-4 ${star <= technicalData.developer.strength ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="font-medium text-gray-800 mb-2">{technicalData.performance.title}</div>
          <p className="text-gray-600 text-sm mb-3">{technicalData.performance.description}</p>
          <div className="flex items-center">
            <div className="text-sm text-gray-500 mr-2">Performance Rating:</div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <svg 
                  key={star} 
                  className={`h-4 w-4 ${star <= technicalData.performance.strength ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2 border border-gray-200 rounded-lg p-4">
          <div className="font-medium text-gray-800 mb-2">Unique Services</div>
          <div className="flex flex-wrap gap-2">
            {technicalData.uniqueServices.map((service, idx) => (
              <span key={idx} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCharacteristics;