import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts';

const FinancialAnalysis = ({ pricing, workload }) => {
  const [timeframe, setTimeframe] = useState('3year'); // 1year, 3year, 5year
  
  if (!pricing) return null;
  
  // Provider color map and names
  const providerColors = {
    aws: '#FF9900',
    azure: '#00a4d6ff',
    gcp: '#74f442ff',
    oracle: '#F80000',
    ibm: '#fe0fceff',
    alibaba: '#efec16ff',
    digitalocean: '#001effff'
    
  };
  
  const providerNames = {
    aws: 'AWS',
    azure: 'Azure',
    gcp: 'GCP',
    oracle: 'Oracle',
    ibm: 'IBM Cloud',
    alibaba: 'Alibaba',
    digitalocean: 'DigitalOcean'
  };
  
  // Get expected growth rate
  const growthRate = workload.businessMetrics?.expectedGrowth || 'moderate';
  
  // Define monthly growth factors based on growth rate
  const monthlyGrowthFactor = {
    low: 1.01,      // ~12% annual
    moderate: 1.03, // ~42% annual
    high: 1.05,     // ~80% annual
    rapid: 1.10     // ~213% annual
  }[growthRate];
  
  // Prepare cost forecast data
  const generateForecastData = () => {
    const months = [];
    const now = new Date();
    
    // Determine months to show based on timeframe
    const numMonths = timeframe === '1year' ? 12 : timeframe === '3year' ? 36 : 60;
    
    for (let i = 0; i < numMonths; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push({
        name: i % 12 === 0 ? date.toLocaleString('default', { month: 'short', year: 'numeric' }) 
                           : date.toLocaleString('default', { month: 'short' }),
        month: i
      });
    }
    
    // Add cost projections
    return months.map(month => {
      const result = { ...month };
      
      Object.keys(pricing).forEach(provider => {
        if (pricing[provider]) {
          // Calculate growth based on selected growth rate
          result[provider] = Math.round(pricing[provider].total * Math.pow(monthlyGrowthFactor, month.month) * 100) / 100;
        }
      });
      
      return result;
    });
  };
  
  const forecastData = generateForecastData();
  
  // Calculate 1/3/5 year totals
  const calculateTotalCosts = () => {
    const result = {};
    
    Object.keys(pricing).forEach(provider => {
      if (pricing[provider]) {
        const monthly = pricing[provider].total;
        
        result[provider] = {
          monthly,
          annual: monthly * 12,
          threeYear: monthly * 36,
          fiveYear: monthly * 60
        };
        
        // Apply growth rates for more accurate projections
        let accumulatedCost = 0;
        for (let i = 0; i < 60; i++) {
          const monthCost = monthly * Math.pow(monthlyGrowthFactor, i);
          if (i < 12) result[provider].annualGrowth = (result[provider].annualGrowth || 0) + monthCost;
          if (i < 36) result[provider].threeYearGrowth = (result[provider].threeYearGrowth || 0) + monthCost;
          result[provider].fiveYearGrowth = (result[provider].fiveYearGrowth || 0) + monthCost;
        }
        
        // Round values
        result[provider].annualGrowth = Math.round(result[provider].annualGrowth);
        result[provider].threeYearGrowth = Math.round(result[provider].threeYearGrowth);
        result[provider].fiveYearGrowth = Math.round(result[provider].fiveYearGrowth);
      }
    });
    
    return result;
  };
  
  const totalCosts = calculateTotalCosts();
  
  // Find cheapest provider
  const getProviderRanking = () => {
    return Object.keys(pricing)
      .filter(provider => pricing[provider])
      .sort((a, b) => pricing[a].total - pricing[b].total);
  };
  
  const rankedProviders = getProviderRanking();
  const cheapestProvider = rankedProviders[0];
  
  // Calculate per-customer costs
  const getUserMetrics = () => {
    if (!workload.businessMetrics?.userTraffic) return null;
    
    const userTraffic = workload.businessMetrics.userTraffic;
    const result = {};
    
    Object.keys(pricing).forEach(provider => {
      if (pricing[provider]) {
        result[provider] = {
          costPerUser: pricing[provider].total / userTraffic,
          annualCostPerUser: (pricing[provider].total * 12) / userTraffic
        };
      }
    });
    
    return result;
  };
  
  const userMetrics = getUserMetrics();
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Analysis</h2>
      
      {/* TCO Analysis */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-700">Total Cost of Ownership</h3>
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                timeframe === '1year' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
              onClick={() => setTimeframe('1year')}
            >
              1 Year
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                timeframe === '3year' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-gray-300'
              }`}
              onClick={() => setTimeframe('3year')}
            >
              3 Years
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                timeframe === '5year' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
              onClick={() => setTimeframe('5year')}
            >
              5 Years
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={forecastData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              {Object.keys(pricing).map(provider => (
                pricing[provider] && (
                  <Area
                    key={provider}
                    type="monotone"
                    dataKey={provider}
                    name={providerNames[provider]}
                    stroke={providerColors[provider]}
                    fill={providerColors[provider]}
                    fillOpacity={0.2}
                  />
                )
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  1 Year
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  3 Years
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  5 Years
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankedProviders.map(provider => (
                <tr key={provider} className={provider === cheapestProvider ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: providerColors[provider] }}></div>
                      <div className="font-medium text-gray-900">
                        {providerNames[provider] || provider.toUpperCase()}
                        {provider === cheapestProvider && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Best Value
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${totalCosts[provider].monthly.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${totalCosts[provider].annualGrowth.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${totalCosts[provider].threeYearGrowth.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${totalCosts[provider].fiveYearGrowth.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {workload.deploymentStrategy === 'multi-cloud' && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-700">Single-Cloud vs. Multi-Cloud TCO</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: 'Single Cloud', value: totalCosts[cheapestProvider].threeYearGrowth },
                    { name: 'Multi-Cloud', value: totalCosts[cheapestProvider].threeYearGrowth * 1.15 } // Simulated 15% overhead
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Multi-cloud TCO is simulated with a 15% operational overhead.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Per-Customer Metrics */}
      {userMetrics && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Cost Per User Metrics</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Cost Per User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Annual Cost Per User
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rankedProviders.map(provider => (
                  <tr key={provider} className={provider === cheapestProvider ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: providerColors[provider] }}></div>
                        <div className="font-medium text-gray-900">{providerNames[provider] || provider.toUpperCase()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${userMetrics[provider].costPerUser.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${userMetrics[provider].annualCostPerUser.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialAnalysis;