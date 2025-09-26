import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const MultiCloudCompatibility = ({ pricing, workload }) => {
  if (!pricing) return null;

  // Provider color map
  const providerColors = {
    aws: '#FF9900',
    azure: '#0089D6',
    gcp: '#4285F4',
    oracle: '#F80000',
    ibm: '#0F62FE',
    alibaba: '#FF6A00',
    digitalocean: '#0080FF'
  };

  // Provider display names
  const providerNames = {
    aws: 'AWS',
    azure: 'Azure',
    gcp: 'GCP',
    oracle: 'Oracle',
    ibm: 'IBM',
    alibaba: 'Alibaba',
    digitalocean: 'DigitalOcean'
  };

  // Multi-cloud compatibility data
  const compatibilityData = {
    aws: {
      migration_effort: 80,
      developer_hours: 70,
      scalability: 95,
      compatibility: 90
    },
    azure: {
      migration_effort: 75,
      developer_hours: 65,
      scalability: 90,
      compatibility: 85
    },
    gcp: {
      migration_effort: 70,
      developer_hours: 60,
      scalability: 92,
      compatibility: 88
    },
    oracle: {
        migration_effort: 60,
        developer_hours: 50,
        scalability: 80,
        compatibility: 70
    },
    ibm: {
        migration_effort: 65,
        developer_hours: 55,
        scalability: 85,
        compatibility: 75
    },
    alibaba: {
        migration_effort: 55,
        developer_hours: 45,
        scalability: 82,
        compatibility: 65
    },
    digitalocean: {
      migration_effort: 50,
      developer_hours: 40,
      scalability: 75,
      compatibility: 60
    }
  };

  // Prepare radar data
  const radarData = Object.keys(compatibilityData.aws).map(metric => {
    const data = { metric: metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) };
    Object.keys(pricing).forEach(provider => {
      if (pricing[provider]) {
        data[provider] = compatibilityData[provider][metric];
      }
    });
    return data;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Multi-Cloud Compatibility Hub</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Provider Compatibility Analysis</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200" style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                {Object.keys(pricing).map(provider => (
                  pricing[provider] && (
                    <Radar
                      key={provider}
                      name={providerNames[provider]}
                      dataKey={provider}
                      stroke={providerColors[provider]}
                      fill={providerColors[provider]}
                      fillOpacity={0.2}
                    />
                  )
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Migration Effort & Developer Hours</h3>
          <div className="space-y-4">
            {Object.keys(pricing).map(provider => (
              <div key={provider} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: providerColors[provider] }}></div>
                  <div className="text-sm font-medium">{providerNames[provider]}</div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Migration Effort:</span>
                  <span className="text-sm font-medium">{compatibilityData[provider].migration_effort}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Developer Hours:</span>
                  <span className="text-sm font-medium">{compatibilityData[provider].developer_hours} hours</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="font-medium text-gray-900 mb-3">Vendor Lock-in Considerations</h3>
        <p className="text-sm text-gray-600 mb-4">
          Using proprietary services can increase vendor lock-in. Below are examples of open-source alternatives to mitigate this risk.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="font-medium text-sm mb-2">Proprietary Service (AWS Lambda)</div>
            <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
              {`// AWS Lambda Function
exports.handler = async (event) => {
  console.log("Hello from Lambda!");
  return {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
};`}
            </pre>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="font-medium text-sm mb-2">Open-Source Alternative (OpenFaaS)</div>
            <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
              {`// OpenFaaS Function (handler.js)
module.exports = (context, callback) => {
  callback(undefined, {status: "done"});
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiCloudCompatibility;