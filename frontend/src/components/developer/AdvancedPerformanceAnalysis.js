// frontend/src/components/developer/AdvancedPerformanceAnalysis.js
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdvancedPerformanceAnalysis = ({ pricing, workload }) => {
  const [metricType, setMetricType] = useState('compute');
  
  if (!pricing) return null;
  
  const providerColors = {
    aws: '#FF9900',
    azure: '#0089D6',
    gcp: '#4285F4',
    oracle: '#F80000',
    ibm: '#0F62FE',
    alibaba: '#FF6A00',
    digitalocean: '#0080FF'
  };
  
  const providerNames = {
    aws: 'AWS',
    azure: 'Azure',
    gcp: 'GCP',
    oracle: 'Oracle',
    ibm: 'IBM',
    alibaba: 'Alibaba',
    digitalocean: 'DigitalOcean'
  };
  
  const performanceBenchmarks = {
    compute: {
      'CPU Performance (higher is better)': {
        aws: 95,
        azure: 92,
        gcp: 100,
        oracle: 90,
        ibm: 88,
        alibaba: 85,
        digitalocean: 90
      },
      'Memory Bandwidth (higher is better)': {
        aws: 90,
        azure: 94,
        gcp: 92,
        oracle: 95,
        ibm: 88,
        alibaba: 85,
        digitalocean: 88
      },
      'Network Performance (higher is better)': {
        aws: 92,
        azure: 90,
        gcp: 100,
        oracle: 88,
        ibm: 85,
        alibaba: 82,
        digitalocean: 85
      }
    },
    storage: {
      'Read IOPS (higher is better)': {
        aws: 93,
        azure: 90,
        gcp: 95,
        oracle: 97,
        ibm: 88,
        alibaba: 85,
        digitalocean: 90
      },
      'Write IOPS (higher is better)': {
        aws: 94,
        azure: 92,
        gcp: 93,
        oracle: 96,
        ibm: 90,
        alibaba: 87,
        digitalocean: 88
      },
      'Read Latency (lower is better)': {
        aws: 12,
        azure: 14,
        gcp: 11,
        oracle: 10,
        ibm: 15,
        alibaba: 16,
        digitalocean: 13
      },
      'Write Latency (lower is better)': {
        aws: 15,
        azure: 16,
        gcp: 14,
        oracle: 13,
        ibm: 17,
        alibaba: 18,
        digitalocean: 15
      }
    },
    database: {
      'Read Throughput (higher is better)': {
        aws: 95,
        azure: 93,
        gcp: 90,
        oracle: 100,
        ibm: 88,
        alibaba: 85,
        digitalocean: 85
      },
      'Write Throughput (higher is better)': {
        aws: 92,
        azure: 90,
        gcp: 88,
        oracle: 100,
        ibm: 85,
        alibaba: 83,
        digitalocean: 82
      },
      'Query Performance (higher is better)': {
        aws: 90,
        azure: 92,
        gcp: 94,
        oracle: 100,
        ibm: 88,
        alibaba: 85,
        digitalocean: 88
      }
    },
    network: {
      'Inter-Region Latency (lower is better)': {
        aws: 15,
        azure: 18,
        gcp: 12,
        oracle: 20,
        ibm: 22,
        alibaba: 25,
        digitalocean: 18
      },
      'Global Network Performance (higher is better)': {
        aws: 95,
        azure: 93,
        gcp: 100,
        oracle: 85,
        ibm: 88,
        alibaba: 80,
        digitalocean: 85
      },
      'CDN Performance (higher is better)': {
        aws: 97,
        azure: 95,
        gcp: 96,
        oracle: 85,
        ibm: 88,
        alibaba: 90,
        digitalocean: 92
      }
    }
  };
  
  const latencyData = {
    'US East to US West': {
      aws: 60,
      azure: 62,
      gcp: 55,
      oracle: 65,
      ibm: 68,
      alibaba: 72,
      digitalocean: 60
    },
    'US to Europe': {
      aws: 85,
      azure: 80,
      gcp: 78,
      oracle: 90,
      ibm: 92,
      alibaba: 95,
      digitalocean: 82
    },
    'US to Asia': {
      aws: 170,
      azure: 165,
      gcp: 160,
      oracle: 180,
      ibm: 185,
      alibaba: 155,
      digitalocean: 170
    },
    'Europe to Asia': {
      aws: 145,
      azure: 140,
      gcp: 138,
      oracle: 150,
      ibm: 155,
      alibaba: 135,
      digitalocean: 145
    }
  };
  
  const calculateCostPerformanceRatio = () => {
    const result = {};
    
    Object.keys(pricing).forEach(provider => {
      if (!pricing[provider]) return;
      
      let performanceSum = 0;
      let metricCount = 0;
      
      Object.values(performanceBenchmarks).forEach(category => {
        Object.entries(category).forEach(([metric, values]) => {
          if (!metric.includes('Latency')) {
            performanceSum += values[provider];
            metricCount++;
          }
        });
      });
      
      const avgPerformance = performanceSum / metricCount;
      result[provider] = {
        performance: avgPerformance,
        cost: pricing[provider].total,
        ratio: avgPerformance / pricing[provider].total
      };
    });
    
    return result;
  };
  
  const costPerformanceRatio = calculateCostPerformanceRatio();
  
  const prepareBarData = (metricType) => {
    return Object.entries(performanceBenchmarks[metricType]).map(([metric, values]) => {
      const data = { name: metric };
      
      Object.keys(pricing).forEach(provider => {
        if (pricing[provider]) {
          data[providerNames[provider]] = values[provider];
        }
      });
      
      return data;
    });
  };
  
  const barData = prepareBarData(metricType);
  
  const prepareLatencyData = () => {
    return Object.entries(latencyData).map(([route, values]) => {
      const data = { name: route };
      
      Object.keys(pricing).forEach(provider => {
        if (pricing[provider]) {
          data[providerNames[provider]] = values[provider];
        }
      });
      
      return data;
    });
  };
  
  const latencyChartData = prepareLatencyData();
  
  const prepareCostPerformanceData = () => {
    return Object.keys(pricing).map(provider => {
      if (!costPerformanceRatio[provider]) return null;
      
      return {
        name: providerNames[provider],
        performance: costPerformanceRatio[provider].performance,
        cost: costPerformanceRatio[provider].cost,
        ratio: costPerformanceRatio[provider].ratio * 100
      };
    }).filter(Boolean);
  };
  
  const costPerformanceData = prepareCostPerformanceData();
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Advanced Performance Analysis</h2>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Performance Benchmarks</h3>
        
        <div className="flex mb-4 overflow-x-auto pb-2">
          <button
            className={`px-3 py-1 mr-2 text-sm font-medium rounded ${metricType === 'compute' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setMetricType('compute')}
          >
            Compute
          </button>
          <button
            className={`px-3 py-1 mr-2 text-sm font-medium rounded ${metricType === 'storage' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setMetricType('storage')}
          >
            Storage
          </button>
          <button
            className={`px-3 py-1 mr-2 text-sm font-medium rounded ${metricType === 'database' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setMetricType('database')}
          >
            Database
          </button>
          <button
            className={`px-3 py-1 text-sm font-medium rounded ${metricType === 'network' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setMetricType('network')}
          >
            Network
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200" style={{ height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              layout={Object.keys(barData[0] || {}).length > 5 ? 'vertical' : 'horizontal'}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              {Object.keys(barData[0] || {}).length > 5 ? (
                <>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                </>
              ) : (
                <>
                  <XAxis dataKey="name" />
                  <YAxis />
                </>
              )}
              <Tooltip />
              <Legend />
              {Object.keys(pricing).map(provider => (
                pricing[provider] && (
                  <Bar 
                    key={provider}
                    dataKey={providerNames[provider]}
                    fill={providerColors[provider]}
                  />
                )
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          {metricType === 'storage' || metricType === 'network' 
            ? 'Note: For latency metrics, lower values indicate better performance.' 
            : 'Note: Higher values indicate better performance across all metrics.'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Cross-Region Latency</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200" style={{ height: "280px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={latencyChartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'ms (lower is better)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                {Object.keys(pricing).map(provider => (
                  pricing[provider] && (
                    <Line
                      key={provider}
                      type="monotone"
                      dataKey={providerNames[provider]}
                      stroke={providerColors[provider]}
                      strokeWidth={2}
                      dot={{ r: 5 }}
                      activeDot={{ r: 8 }}
                    />
                  )
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Performance-to-Cost Ratio</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200" style={{ height: "280px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={costPerformanceData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => {
                  if (name === 'ratio') return [`${(value / 100).toFixed(2)}`, 'Performance/Cost Ratio'];
                  if (name === 'performance') return [`${value.toFixed(2)}`, 'Performance Score'];
                  if (name === 'cost') return [`$${value.toFixed(2)}`, 'Monthly Cost'];
                  return [value, name];
                }} />
                <Legend />
                <Bar name="Performance Score" dataKey="performance" fill="#60a5fa" />
                <Bar name="Monthly Cost ($)" dataKey="cost" fill="#f87171" />
                <Bar name="Performance/Cost Ratio" dataKey="ratio" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-medium text-gray-900 mb-3">Performance Takeaways</h3>
        
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <div className="space-y-2 text-sm text-indigo-700">
            <p className="flex items-start">
              <svg className="w-5 h-5 text-indigo-600 mr-1.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span><strong>GCP</strong> offers the best overall network performance and lowest global latencies, making it ideal for latency-sensitive applications.</span>
            </p>
            <p className="flex items-start">
              <svg className="w-5 h-5 text-indigo-600 mr-1.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span><strong>Oracle</strong> provides the best database performance, particularly for workloads optimized for Oracle Database.</span>
            </p>
            <p className="flex items-start">
              <svg className="w-5 h-5 text-indigo-600 mr-1.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span><strong>AWS</strong> offers the most balanced performance across all categories, with strong compute and storage performance.</span>
            </p>
            <p className="flex items-start">
              <svg className="w-5 h-5 text-indigo-600 mr-1.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span><strong>Alibaba Cloud</strong> provides the best performance-to-cost ratio, though with some feature and global presence limitations.</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-medium text-gray-900 mb-3">Performance Optimization Tips</h3>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Compute Optimization</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="flex items-start">
                <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Choose instance types optimized for your workload type (compute, memory, storage)
              </p>
              <p className="flex items-start">
                <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Implement auto-scaling based on CPU utilization or custom metrics
              </p>
              <p className="flex items-start">
                <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Use container orchestration for efficient resource utilization
              </p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Database Optimization</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="flex items-start">
                <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Implement proper indexing strategies for your query patterns
              </p>
              <p className="flex items-start">
                <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Consider read replicas for read-heavy workloads
              </p>
              <p className="flex items-start">
                <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Use connection pooling and caching where appropriate
              </p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Network Optimization</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="flex items-start">
                <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Place resources in regions closest to your users
              </p>
              <p className="flex items-start">
                <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Use CDN for static content delivery
              </p>
              <p className="flex items-start">
                <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Implement proper caching strategies to reduce network calls
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPerformanceAnalysis;