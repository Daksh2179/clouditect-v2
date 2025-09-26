import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const BusinessFitAnalysis = ({ pricing, workload }) => {
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
  
  // Get business type
  const businessType = workload.businessType || 'general';
  
  // Industry-specific provider strengths (simplified example)
  const industryStrengths = {
    ecommerce: {
      aws: { score: 90, strengths: ['Proven scalability for peak sales events', 'Extensive e-commerce reference architectures'] },
      azure: { score: 80, strengths: ['Strong integration with Microsoft sales tools', 'Good B2B e-commerce capabilities'] },
      gcp: { score: 85, strengths: ['Superior analytics for customer behavior', 'Excellent recommendation engine capabilities'] },
      oracle: { score: 70, strengths: ['Strong integration with Oracle commerce suite', 'Good transaction processing'] },
      ibm: { score: 65, strengths: ['Enterprise-grade security', 'Good inventory management integration'] },
      alibaba: { score: 75, strengths: ['Best performance in Asian markets', 'Specialized e-commerce services'] }
    },
    finance: {
      aws: { score: 85, strengths: ['Comprehensive compliance certifications', 'Strong financial services partners'] },
      azure: { score: 87, strengths: ['Strong compliance framework', 'Excellent identity management'] },
      gcp: { score: 75, strengths: ['Superior data analytics', 'Strong machine learning for fraud detection'] },
      oracle: { score: 80, strengths: ['Deep financial services integration', 'Excellent database performance'] },
      ibm: { score: 90, strengths: ['Built-in financial services compliance', 'Industry-leading security features'] },
      alibaba: { score: 65, strengths: ['Good payment processing in Asia', 'Cost-effective scaling'] }
    },
    healthcare: {
      aws: { score: 88, strengths: ['HIPAA-eligible services', 'Strong healthcare partners ecosystem'] },
      azure: { score: 90, strengths: ['Strong healthcare APIs', 'Excellent compliance tooling'] },
      gcp: { score: 80, strengths: ['Healthcare-specific AI/ML capabilities', 'Good imaging and analytics'] },
      oracle: { score: 75, strengths: ['Strong database performance for patient records', 'Good healthcare analytics'] },
      ibm: { score: 85, strengths: ['Watson healthcare integration', 'Strong security for patient data'] },
      alibaba: { score: 60, strengths: ['Cost-effective infrastructure', 'Growing healthcare focus'] }
    },
    general: {
      aws: { score: 85, strengths: ['Broadest service catalog', 'Extensive global presence'] },
      azure: { score: 85, strengths: ['Strong enterprise integration', 'Excellent Microsoft ecosystem'] },
      gcp: { score: 80, strengths: ['Superior data analytics', 'Strong container services'] },
      oracle: { score: 75, strengths: ['Excellent database services', 'Good enterprise applications'] },
      ibm: { score: 75, strengths: ['Strong enterprise support', 'Good hybrid cloud options'] },
      alibaba: { score: 70, strengths: ['Cost-effective pricing', 'Strong presence in Asia'] }
    }
  };
  
  // Use general if the business type isn't available
  const strengths = industryStrengths[businessType] || industryStrengths.general;
  
  // Radar chart data structure
  const radarData = [
    { category: 'Market Maturity', aws: 90, azure: 85, gcp: 80, oracle: 75, ibm: 85, alibaba: 65 },
    { category: 'Global Presence', aws: 95, azure: 90, gcp: 85, oracle: 70, ibm: 75, alibaba: 60 },
    { category: 'Service Breadth', aws: 95, azure: 90, gcp: 85, oracle: 70, ibm: 75, alibaba: 65 },
    { category: 'Integration Ease', aws: 80, azure: 90, gcp: 75, oracle: 75, ibm: 70, alibaba: 60 },
    { category: 'Enterprise Support', aws: 85, azure: 90, gcp: 80, oracle: 85, ibm: 90, alibaba: 70 },
    { category: 'Business Analytics', aws: 85, azure: 80, gcp: 95, oracle: 80, ibm: 85, alibaba: 70 },
  ];

  // Service analysis data structure
  const serviceAnalysis = {
    aws: {
      strengths: ['Broadest service catalog', 'Most mature infrastructure services', 'Extensive partner ecosystem'],
      limitations: ['Complex pricing', 'Steeper learning curve', 'Premium support is expensive']
    },
    azure: {
      strengths: ['Deep Microsoft integration', 'Strong hybrid capabilities', 'Good enterprise agreements'],
      limitations: ['Occasional service reliability issues', 'Regional availability varies', 'Platform changes frequently']
    },
    gcp: {
      strengths: ['Best-in-class data analytics', 'Strong container services', 'Excellent network performance'],
      limitations: ['Smaller service catalog', 'Fewer enterprise agreements', 'Smaller global footprint']
    },
    oracle: {
      strengths: ['Superior Oracle workload performance', 'Consistent pricing', 'Strong database services'],
      limitations: ['Limited global regions', 'Smaller developer community', 'Fewer third-party integrations']
    },
    ibm: {
      strengths: ['Industry-leading support', 'Strong enterprise focus', 'Good compliance frameworks'],
      limitations: ['Higher overall pricing', 'More complex architecture', 'Fewer consumer-focused services']
    },
    alibaba: {
      strengths: ['Cost-effective pricing', 'Strong Asian presence', 'Growing service catalog'],
      limitations: ['Limited global regions', 'Less mature documentation', 'Smaller western support team']
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Fit Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Provider Match for {businessType.charAt(0).toUpperCase() + businessType.slice(1)} Business</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(strengths).map(provider => (
              <div 
                key={provider}
                className="border rounded-lg p-4 relative"
                style={{ borderColor: providerColors[provider] }}
              >
                <div className="absolute top-0 right-0 px-2 py-1 text-xs font-bold text-white rounded-bl-lg rounded-tr-lg" style={{ backgroundColor: providerColors[provider] }}>
                  {strengths[provider].score}%
                </div>
                <h4 className="font-medium mb-2" style={{ color: providerColors[provider] }}>
                  {providerNames[provider]}
                </h4>
                <ul className="text-sm space-y-1 mt-4">
                  {strengths[provider].strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Capability Comparison</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200" style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                {Object.keys(pricing).map(provider => (
                  <Radar
                    key={provider}
                    name={providerNames[provider]}
                    dataKey={provider}
                    stroke={providerColors[provider]}
                    fill={providerColors[provider]}
                    fillOpacity={0.2}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Service Analysis */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Service Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Strengths
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Limitations
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.keys(pricing).map(provider => (
                <tr key={provider}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: providerColors[provider] }}></div>
                      <div className="font-medium text-gray-900">{providerNames[provider]}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="text-sm text-gray-600 space-y-1">
                      {serviceAnalysis[provider].strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="text-sm text-gray-600 space-y-1">
                      {serviceAnalysis[provider].limitations.map((limitation, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BusinessFitAnalysis;