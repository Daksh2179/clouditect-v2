// Updated src/components/business/ComplianceRegionAnalysis.js (without map)
import React, { useState } from 'react';
// Removed react-leaflet and leaflet imports

const ComplianceRegionAnalysis = ({ pricing, workload }) => {
  const [activeComplianceTab, setActiveComplianceTab] = useState('coverage');
  
  if (!pricing) return null;
  
  // Provider color map
  const providerColors = {
    aws: '#FF9900',
    azure: '#0089D6',
    gcp: '#4285F4',
    oracle: '#F80000',
    ibm: '#0F62FE',
    alibaba: '#FF6A00'
  };
  
  // Provider display names
  const providerNames = {
    aws: 'AWS',
    azure: 'Azure',
    gcp: 'GCP',
    oracle: 'Oracle',
    ibm: 'IBM Cloud',
    alibaba: 'Alibaba'
  };
  
  // Selected regions
  const selectedRegions = workload.region || {};
  
  // Compliance frameworks data
  const complianceData = {
    aws: {
      GDPR: { compliant: true, details: 'AWS offers GDPR-compliant services and provides tools for customers to maintain compliance.' },
      HIPAA: { compliant: true, details: 'AWS offers a HIPAA-eligible services program for secure handling of PHI.' },
      PCI_DSS: { compliant: true, details: 'AWS is PCI DSS Level 1 compliant as a service provider.' },
      SOC: { compliant: true, details: 'AWS provides SOC 1, 2, and 3 reports.' },
      ISO_27001: { compliant: true, details: 'AWS is certified for ISO/IEC 27001:2013.' },
      FedRAMP: { compliant: true, details: 'AWS offers services approved at FedRAMP High and Moderate impact levels.' }
    },
    azure: {
      GDPR: { compliant: true, details: 'Azure provides tools and resources to help customers comply with GDPR.' },
      HIPAA: { compliant: true, details: 'Azure offers HIPAA-compliant services and will sign Business Associate Agreements.' },
      PCI_DSS: { compliant: true, details: 'Azure is PCI DSS Level 1 compliant as a service provider.' },
      SOC: { compliant: true, details: 'Azure provides SOC 1, 2, and 3 reports.' },
      ISO_27001: { compliant: true, details: 'Azure is certified for ISO/IEC 27001:2013.' },
      FedRAMP: { compliant: true, details: 'Azure Government is FedRAMP High authorized.' }
    },
    gcp: {
      GDPR: { compliant: true, details: 'GCP offers capabilities to help customers meet their GDPR obligations.' },
      HIPAA: { compliant: true, details: 'GCP will sign Business Associate Agreements and offers HIPAA-eligible services.' },
      PCI_DSS: { compliant: true, details: 'GCP is PCI DSS Level 1 compliant as a service provider.' },
      SOC: { compliant: true, details: 'GCP provides SOC 1, 2, and 3 reports.' },
      ISO_27001: { compliant: true, details: 'GCP is certified for ISO/IEC 27001:2013.' },
      FedRAMP: { compliant: true, details: 'GCP offers services with FedRAMP High and Moderate authorizations.' }
    },
    oracle: {
      GDPR: { compliant: true, details: 'Oracle Cloud Infrastructure provides features to help customers meet GDPR requirements.' },
      HIPAA: { compliant: true, details: 'Oracle will sign Business Associate Agreements for HIPAA compliance.' },
      PCI_DSS: { compliant: true, details: 'Oracle Cloud Infrastructure is PCI DSS compliant.' },
      SOC: { compliant: true, details: 'Oracle provides SOC 1, 2, and 3 reports.' },
      ISO_27001: { compliant: true, details: 'Oracle Cloud Infrastructure is ISO 27001 certified.' },
      FedRAMP: { compliant: true, details: 'Oracle Cloud has received FedRAMP High authorization.' }
    },
    ibm: {
      GDPR: { compliant: true, details: 'IBM Cloud offers capabilities to help customers meet their GDPR obligations.' },
      HIPAA: { compliant: true, details: 'IBM Cloud will sign Business Associate Agreements and has HIPAA-ready services.' },
      PCI_DSS: { compliant: true, details: 'IBM Cloud is PCI DSS compliant.' },
      SOC: { compliant: true, details: 'IBM Cloud provides SOC 1, 2, and 3 reports.' },
      ISO_27001: { compliant: true, details: 'IBM Cloud is ISO 27001 certified.' },
      FedRAMP: { compliant: true, details: 'IBM Cloud has FedRAMP High and Moderate authorizations.' }
    },
    alibaba: {
      GDPR: { compliant: true, details: 'Alibaba Cloud provides services to help customers comply with GDPR.' },
      HIPAA: { compliant: false, details: 'Alibaba Cloud does not currently offer specific HIPAA compliance.' },
      PCI_DSS: { compliant: true, details: 'Alibaba Cloud is PCI DSS Level 1 compliant.' },
      SOC: { compliant: true, details: 'Alibaba Cloud provides SOC 1 and 2 reports.' },
      ISO_27001: { compliant: true, details: 'Alibaba Cloud is ISO 27001 certified.' },
      FedRAMP: { compliant: false, details: 'Alibaba Cloud does not currently have FedRAMP authorization.' }
    }
  };
  
  // Data residency information
  const dataResidency = {
    aws: 'AWS offers data residency controls through region selection. Data stored in a region stays in that region unless explicitly transferred.',
    azure: 'Azure provides data residency guarantees through region selection and additional services like Azure Policy.',
    gcp: 'GCP provides data residency through region selection and resource location policies.',
    oracle: 'Oracle Cloud Infrastructure offers data residency controls through region selection.',
    ibm: 'IBM Cloud provides data residency through region selection and data sovereignty controls.',
    alibaba: 'Alibaba Cloud provides data residency through region selection, with additional controls in certain regions.'
  };
  
  // SLA comparison
  const slaComparison = {
    aws: {
      compute: '99.99% for multi-AZ deployments',
      storage: '99.999999999% durability, 99.99% availability for S3 Standard',
      database: '99.95% for Multi-AZ RDS'
    },
    azure: {
      compute: '99.99% for availability sets, 99.9% for single instances',
      storage: '99.999999999% durability, 99.99% availability for Blob Storage',
      database: '99.99% for Business Critical tier SQL Database'
    },
    gcp: {
      compute: '99.99% for regional MIGs, 99.9% for zonal resources',
      storage: '99.999999999% durability, 99.95% availability for Standard Storage',
      database: '99.95% for regional Cloud SQL'
    },
    oracle: {
      compute: '99.95% for multi-AD deployments',
      storage: '99.999999999% durability, 99.9% availability for Standard Storage',
      database: '99.95% for Oracle Database Cloud Service'
    },
    ibm: {
      compute: '99.9% for single instances, 99.99% for multi-zone',
      storage: '99.999999999% durability, 99.9% availability for Cloud Object Storage',
      database: '99.95% for Database for PostgreSQL'
    },
    alibaba: {
      compute: '99.95% for ECS instances',
      storage: '99.9999999999% durability, 99.95% availability for OSS',
      database: '99.95% for RDS instances'
    }
  };
  
  // Get user compliance requirements if any
  const complianceRequirements = workload.complianceRequirements || [];
  
  // Check provider compliance with requirements
  const getComplianceStatus = (provider) => {
    if (complianceRequirements.length === 0) {
      return { status: 'unknown', message: 'No specific compliance requirements provided' };
    }
    
    const providerCompliance = complianceData[provider];
    const nonCompliantFrameworks = complianceRequirements.filter(req => {
      const normalized = req.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
      return !providerCompliance[normalized]?.compliant;
    });
    
    if (nonCompliantFrameworks.length === 0) {
      return { 
        status: 'compliant', 
        message: 'Meets all specified compliance requirements' 
      };
    } else {
      return { 
        status: 'non-compliant', 
        message: `Does not meet these requirements: ${nonCompliantFrameworks.join(', ')}` 
      };
    }
  };
  
  // Get region distribution information (simplified without map)
  const getRegionDistribution = () => {
    const regionInfo = {};
    Object.keys(pricing).forEach(provider => {
      const region = selectedRegions[provider] || '';
      if (!regionInfo[region]) {
        regionInfo[region] = [];
      }
      regionInfo[region].push(provider);
    });
    return regionInfo;
  };
  
  const regionDistribution = getRegionDistribution();
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Compliance & Region Analysis</h2>
      
      <div className="mb-6">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">Select a tab</label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            onChange={(e) => setActiveComplianceTab(e.target.value)}
            value={activeComplianceTab}
          >
            <option value="coverage">Compliance Coverage</option>
            <option value="residency">Data Residency</option>
            <option value="sla">Service Level Agreements</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                className={`${
                  activeComplianceTab === 'coverage'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveComplianceTab('coverage')}
              >
                Compliance Coverage
              </button>
              <button
                className={`${
                  activeComplianceTab === 'residency'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveComplianceTab('residency')}
              >
                Data Residency
              </button>
              <button
                className={`${
                  activeComplianceTab === 'sla'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveComplianceTab('sla')}
              >
                Service Level Agreements
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Compliance Coverage Tab */}
      {activeComplianceTab === 'coverage' && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">Compliance Framework Coverage</h3>
            <p className="mt-1 text-sm text-gray-500">
              Compare how each provider supports required compliance frameworks.
            </p>
          </div>
          
          {complianceRequirements.length > 0 ? (
            <div className="mb-4 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <h4 className="font-medium text-yellow-800">Your Compliance Requirements</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {complianceRequirements.map((req, idx) => (
                  <span key={idx} className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                    {req}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                No specific compliance requirements have been specified. The table below shows general compliance capabilities of each provider.
              </p>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GDPR
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HIPAA
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PCI DSS
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SOC 2
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ISO 27001
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    FedRAMP
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.keys(pricing).map(provider => {
                  const compliance = getComplianceStatus(provider);
                  return (
                    <tr key={provider}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: providerColors[provider] }}></div>
                          <div className="font-medium text-gray-900">{providerNames[provider]}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          compliance.status === 'compliant' 
                            ? 'bg-green-100 text-green-800' 
                            : compliance.status === 'non-compliant'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {compliance.status === 'compliant' ? 'Compliant' : 
                           compliance.status === 'non-compliant' ? 'Non-Compliant' : 'Unspecified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          complianceData[provider].GDPR.compliant 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {complianceData[provider].GDPR.compliant ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          complianceData[provider].HIPAA.compliant 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {complianceData[provider].HIPAA.compliant ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          complianceData[provider].PCI_DSS.compliant 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {complianceData[provider].PCI_DSS.compliant ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          complianceData[provider].SOC.compliant 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {complianceData[provider].SOC.compliant ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          complianceData[provider].ISO_27001.compliant 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {complianceData[provider].ISO_27001.compliant ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          complianceData[provider].FedRAMP.compliant 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {complianceData[provider].FedRAMP.compliant ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Data Residency Tab */}
      {activeComplianceTab === 'residency' && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">Data Residency Implications</h3>
            <p className="mt-1 text-sm text-gray-500">
              Understand the data residency capabilities and implications of each cloud provider.
            </p>
          </div>
          
          <div className="space-y-4 mb-6">
            {Object.keys(pricing).map(provider => (
              <div key={provider} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="px-4 py-3 flex justify-between items-center" 
                  style={{ backgroundColor: `${providerColors[provider]}15` }}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: providerColors[provider] }}></div>
                    <h4 className="font-medium" style={{ color: providerColors[provider] }}>{providerNames[provider]}</h4>
                  </div>
                  <div className="text-sm">
                    Selected Region: <span className="font-medium">{selectedRegions[provider]}</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700">{dataResidency[provider]}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Region Selection Visualization (non-map version) */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-800 mb-3">Selected Region Distribution</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="space-y-3">
                {Object.entries(regionDistribution).map(([region, providers], idx) => (
                  <div key={idx} className="flex flex-wrap items-center">
                    <div className="font-medium text-gray-700 w-48 truncate">{region || 'Unspecified'}</div>
                    <div className="flex flex-wrap gap-2 ml-4">
                      {providers.map(provider => (
                        <div 
                          key={provider} 
                          className="px-2 py-1 rounded-full text-xs font-medium" 
                          style={{ backgroundColor: `${providerColors[provider]}20`, color: providerColors[provider] }}
                        >
                          {providerNames[provider]}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6">
            <h4 className="font-medium text-blue-800 mb-2">Data Residency Considerations</h4>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-1.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Different countries and regions have specific data sovereignty laws that may require data to be stored within their borders.
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-1.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Consider using providers with regions in countries where your customers are located to improve performance and meet regulatory requirements.
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-1.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Be aware of cross-border data transfer restrictions, particularly for personal data under regulations like GDPR.
              </li>
            </ul>
          </div>
        </div>
      )}
      
      {/* SLA Comparison Tab */}
      {activeComplianceTab === 'sla' && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">Service Level Agreement Comparison</h3>
            <p className="mt-1 text-sm text-gray-500">
              Compare the SLAs offered by each provider for key services.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compute Services
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Storage Services
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Database Services
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.keys(pricing).map(provider => (
                  <tr key={provider}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: providerColors[provider] }}></div>
                        <div className="font-medium text-gray-900">{providerNames[provider]}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {slaComparison[provider].compute}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {slaComparison[provider].storage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {slaComparison[provider].database}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">SLA Impact Analysis</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <span className="font-medium">Availability impact:</span> For a business application with 1,000 active users per day, 
                the difference between 99.9% and 99.99% uptime is approximately 8.8 hours vs. 53 minutes of downtime per year.
              </p>
              <p>
                <span className="font-medium">Financial impact:</span> Assuming an average revenue of $1,000/hour, 
                this represents a potential revenue difference of $8,800 vs. $880 in annual downtime cost.
              </p>
              <p>
                <span className="font-medium">Reputation impact:</span> Higher availability typically results in 
                better customer satisfaction and reduced reputation risk from service interruptions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceRegionAnalysis;