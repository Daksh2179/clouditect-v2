// frontend/src/components/business/StrategicRecommendations.js
import React, { useState } from 'react';

const StrategicRecommendations = ({ recommendations, pricing, workload }) => {
  const [expandedSection, setExpandedSection] = useState('optimizations');
  
  if (!recommendations || !pricing) return null;
  
  const existingProvider = workload.existingProvider;
  
  const providerColors = {
    aws: '#FF9900',
    azure: '#0089D6',
    gcp: '#4285F4',
    oracle: '#F80000',
    ibm: '#0F62FE',
    alibaba: '#FF6A00'
  };
  
  const providerNames = {
    aws: 'AWS',
    azure: 'Azure',
    gcp: 'GCP',
    oracle: 'Oracle',
    ibm: 'IBM Cloud',
    alibaba: 'Alibaba'
  };
  
  let cheapestProvider = null;
  let lowestCost = Infinity;
  
  Object.keys(pricing).forEach(provider => {
    if (pricing[provider].total < lowestCost) {
      lowestCost = pricing[provider].total;
      cheapestProvider = provider;
    }
  });
  
  let savingsVsCurrent = 0;
  if (existingProvider && pricing[existingProvider]) {
    savingsVsCurrent = pricing[existingProvider].total - lowestCost;
  }
  
  const implementationSteps = [
    {
      title: 'Resource Assessment',
      timeframe: 'Week 1-2',
      description: 'Inventory current resources and identify migration candidates',
      tasks: [
        'Document current infrastructure',
        'Identify dependencies',
        'Prioritize workloads for migration'
      ]
    },
    {
      title: 'Architecture Design',
      timeframe: 'Week 3-4',
      description: 'Design target architecture on recommended provider',
      tasks: [
        'Create infrastructure diagrams',
        'Define networking architecture',
        'Establish security controls'
      ]
    },
    {
      title: 'Pilot Migration',
      timeframe: 'Week 5-8',
      description: 'Migrate non-critical workloads as proof of concept',
      tasks: [
        'Set up basic infrastructure',
        'Migrate test/dev environment',
        'Validate functionality'
      ]
    },
    {
      title: 'Full Migration',
      timeframe: 'Week 9-16',
      description: 'Progressive migration of production workloads',
      tasks: [
        'Implement production infrastructure',
        'Migrate databases with minimal downtime',
        'Transition application components'
      ]
    },
    {
      title: 'Optimization',
      timeframe: 'Ongoing',
      description: 'Continuous improvement and cost optimization',
      tasks: [
        'Implement automated scaling',
        'Optimize resource utilization',
        'Implement reserved instances/savings plans'
      ]
    }
  ];
  
  const competitorAnalysis = {
    ecommerce: [
      { name: 'Amazon.com', provider: 'aws', notes: 'Heavy use of custom services and proprietary technologies' },
      { name: 'Shopify', provider: 'gcp', notes: 'Leverages Google Cloud for analytics and ML capabilities' },
      { name: 'Wayfair', provider: 'gcp', notes: 'Uses Google Cloud for flexible container deployments' },
      { name: 'Walmart', provider: 'azure', notes: 'Strategic partnership with Microsoft to compete with Amazon' },
      { name: 'Etsy', provider: 'gcp', notes: 'Migrated from self-hosted to Google Cloud for scalability' }
    ],
    finance: [
      { name: 'Capital One', provider: 'aws', notes: 'One of the first major banks to go all-in on public cloud' },
      { name: 'HSBC', provider: 'gcp', notes: 'Uses Google Cloud for analytics and risk assessment' },
      { name: 'JPMorgan Chase', provider: 'aws', notes: 'Building cloud-native applications on AWS' },
      { name: 'Goldman Sachs', provider: 'aws', notes: 'Uses AWS for financial modeling and analytics' },
      { name: 'Bank of America', provider: 'ibm', notes: 'Strategic partnership with IBM Cloud for compliance' }
    ],
    healthcare: [
      { name: 'Kaiser Permanente', provider: 'azure', notes: 'Leverages Microsoft ecosystem for healthcare systems' },
      { name: 'Cleveland Clinic', provider: 'aws', notes: 'Uses AWS for secure patient data storage' },
      { name: 'Cigna', provider: 'gcp', notes: 'Uses Google Cloud for healthcare analytics' },
      { name: 'Johnson & Johnson', provider: 'azure', notes: 'Multi-cloud approach with focus on Azure' },
      { name: 'Pfizer', provider: 'aws', notes: 'Uses AWS for scientific computing and research' }
    ],
    general: [
      { name: 'Netflix', provider: 'aws', notes: 'Heavy AWS usage for streaming infrastructure' },
      { name: 'Spotify', provider: 'gcp', notes: 'Migrated to Google Cloud for big data processing' },
      { name: 'Airbnb', provider: 'aws', notes: 'Uses AWS extensively for their platform' },
      { name: 'Adobe', provider: 'azure', notes: 'Strategic partnership with Microsoft' },
      { name: 'Snap Inc.', provider: 'gcp', notes: 'Uses Google Cloud for their social media platform' }
    ]
  };
  
  const businessType = workload.businessType || 'general';
  
  const competitors = competitorAnalysis[businessType] || competitorAnalysis.general;
  
  const migrationRisks = [
    { 
      type: 'Downtime Risk', 
      level: 'Medium', 
      description: 'Potential service interruptions during migration',
      mitigation: 'Implement blue-green deployment approach'
    },
    { 
      type: 'Data Transfer', 
      level: 'Medium-High', 
      description: 'Large data volumes may increase migration time and costs',
      mitigation: 'Use incremental data sync and dedicated transfer appliances'
    },
    { 
      type: 'Vendor Lock-in', 
      level: 'Medium', 
      description: 'Reliance on provider-specific services may increase switching costs',
      mitigation: 'Use container-based approach and avoid proprietary services where possible'
    },
    { 
      type: 'Skill Gap', 
      level: 'Low-Medium', 
      description: 'Team may need training on new cloud technologies',
      mitigation: 'Invest in training and consider managed services initially'
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Strategic Recommendations</h2>
      
      <div className="mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-800">
                Recommendation: {existingProvider ? "Migrate to" : "Deploy on"} {providerNames[cheapestProvider]}
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                {existingProvider ? (
                  <p>
                    Based on your requirements, migrating from {providerNames[existingProvider]} to {providerNames[cheapestProvider]} could 
                    save approximately ${savingsVsCurrent.toFixed(2)}/month (${(savingsVsCurrent * 12).toFixed(2)}/year).
                  </p>
                ) : (
                  <p>
                    {providerNames[cheapestProvider]} provides the best balance of cost and capabilities for your specific business needs.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                expandedSection === 'optimizations' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setExpandedSection('optimizations')}
            >
              Cost Optimizations
            </button>
            <button
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                expandedSection === 'implementation' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setExpandedSection('implementation')}
            >
              Implementation Plan
            </button>
            <button
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                expandedSection === 'risks' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setExpandedSection('risks')}
            >
              Risk Assessment
            </button>
            <button
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                expandedSection === 'competitors' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setExpandedSection('competitors')}
            >
              Competitor Analysis
            </button>
          </div>
          
          <div className="py-4">
            {expandedSection === 'optimizations' && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Cost Optimization Opportunities</h3>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-green-800">Potential Monthly Savings</span>
                    <span className="text-lg font-bold text-green-700">${recommendations.summary.estimated_monthly_savings}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${recommendations.summary.savings_percentage}%` }}></div>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Current: ${recommendations.summary.current_monthly_cost}/mo</span>
                    <span className="text-green-600">Optimized: ${(recommendations.summary.current_monthly_cost - recommendations.summary.estimated_monthly_savings).toFixed(2)}/mo</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {recommendations.recommendations.map((rec, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800">{rec.description}</h4>
                          <p className="text-sm text-gray-600 mt-1">{rec.details}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">{rec.saving_potential} savings</div>
                          <div className="text-xs text-gray-500">Effort: {rec.action === 'resize' ? 'Low' : rec.action === 'reserved_instance' ? 'Medium' : 'High'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {expandedSection === 'implementation' && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Implementation Roadmap</h3>
                <div className="space-y-4">
                  {implementationSteps.map((step, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-medium">{index + 1}</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="border-b border-gray-200 pb-2 mb-2">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-900">{step.title}</h4>
                            <span className="text-sm text-blue-600">{step.timeframe}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2 text-sm">{step.description}</p>
                        <ul className="space-y-1">
                          {step.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="text-sm text-gray-600 flex items-start">
                              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {expandedSection === 'risks' && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Migration Risk Assessment</h3>
                <div className="overflow-hidden border-b border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Risk Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Risk Level
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mitigation Strategy
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {migrationRisks.map((risk, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {risk.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              risk.level.includes('High') 
                                ? 'bg-red-100 text-red-800' 
                                : risk.level.includes('Medium')
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                            }`}>
                              {risk.level}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {risk.description}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {risk.mitigation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {expandedSection === 'competitors' && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Competitor Cloud Strategy Analysis</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Analysis of cloud providers used by leading companies in your industry.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {competitors.map((competitor, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: providerColors[competitor.provider] }}></div>
                        <h4 className="font-medium text-gray-800">{competitor.name}</h4>
                      </div>
                      <div className="flex justify-between mb-2">
                        <div className="text-sm text-gray-600">Cloud Provider:</div>
                        <div className="text-sm font-medium">{providerNames[competitor.provider]}</div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{competitor.notes}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 bg-yellow-50 p-3 rounded border border-yellow-100">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Note: Competitor analysis is based on publicly available information and may not reflect recent changes in their cloud strategy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicRecommendations;