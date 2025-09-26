import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import { useWorkload } from '../context/WorkloadContext';

const CostComparisonChart = ({ pricing }) => {
  const [chartType, setChartType] = useState('bar'); // 'bar', 'pie', or 'forecast'
  const { workload } = useWorkload();
  const userType = workload.userType || 'business';
  
  if (!pricing) return null;
  
  // Get available providers from pricing data
  const availableProviders = Object.keys(pricing);
  
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
  
  // Prepare data for bar chart
  const resourceTypes = ['compute', 'storage', 'database', 'networking', 'serverless', 'managedServices'];
  
  // Create base data structure for each resource type
  const barData = resourceTypes.map(type => {
    const data = {
      name: type.charAt(0).toUpperCase() + type.slice(1)
    };
    
    // Add data for each provider
    availableProviders.forEach(provider => {
      if (pricing[provider] && pricing[provider][type] !== undefined) {
        data[providerNames[provider]] = pricing[provider][type];
      } else if (pricing[provider]) {
        data[providerNames[provider]] = 0;
      }
    });
    
    return data;
  });
  
  // Add total row
  const totalData = {
    name: 'Total'
  };
  availableProviders.forEach(provider => {
    if (pricing[provider]) {
      totalData[providerNames[provider]] = pricing[provider].total;
    }
  });
  barData.push(totalData);
  
  // Filter out resource types with zero values across all providers
  const filteredBarData = barData.filter(item => {
    // Keep 'Total' row
    if (item.name === 'Total') return true;
    
    // Check if any provider has non-zero value for this resource type
    return availableProviders.some(provider => 
      item[providerNames[provider]] > 0
    );
  });
  
  // Prepare data for pie chart
  const pieData = availableProviders.map(provider => ({
    name: providerNames[provider],
    value: pricing[provider]?.total || 0,
    color: providerColors[provider]
  })).filter(item => item.value > 0);
  
  // Prepare data for breakdown pie charts
  const prepareBreakdownData = (provider) => {
    const result = [];
    
    resourceTypes.forEach((type, index) => {
      if (pricing[provider]?.[type] > 0) {
        result.push({
          name: type.charAt(0).toUpperCase() + type.slice(1),
          value: pricing[provider][type],
          color: getShadeOfColor(providerColors[provider], index)
        });
      }
    });
    
    return result;
  };
  
  // Prepare forecast data
  const prepareForecastData = () => {
    // Base on business metrics if available
    const growthRate = workload.businessMetrics?.expectedGrowth || 'moderate';
    
    // Define monthly growth factors based on growth rate
    const monthlyGrowthFactor = {
      low: 1.01,      // ~12% annual
      moderate: 1.03, // ~42% annual
      high: 1.05,     // ~80% annual
      rapid: 1.10     // ~213% annual
    }[growthRate];
    
    const months = [];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push(date.toLocaleString('default', { month: 'short', year: 'numeric' }));
    }
    
    return months.map((month, i) => {
      const data = {
        name: month
      };
      
      availableProviders.forEach(provider => {
        if (pricing[provider]) {
          // Calculate growth based on selected growth rate
          data[providerNames[provider]] = Math.round(pricing[provider].total * Math.pow(monthlyGrowthFactor, i) * 100) / 100;
        }
      });
      
      return data;
    });
  };
  
  // Helper to get different shades of a color
  const getShadeOfColor = (hexColor, index) => {
    // Convert hex to RGB
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);
    
    // Adjust the brightness based on index
    const adjustmentFactor = 0.2 * index;
    r = Math.min(255, Math.round(r * (1 + adjustmentFactor)));
    g = Math.min(255, Math.round(g * (1 + adjustmentFactor)));
    b = Math.min(255, Math.round(b * (1 + adjustmentFactor)));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    
    if (percent < 0.05) return null;
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="middle"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="font-semibold">{payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              chartType === 'bar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
            onClick={() => setChartType('bar')}
          >
            Bar Chart
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              chartType === 'pie' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
            onClick={() => setChartType('pie')}
          >
            Pie Chart
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              chartType === 'forecast' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
            onClick={() => setChartType('forecast')}
          >
            12-Month Forecast
          </button>
        </div>
      </div>
      
      {/* Bar Chart View */}
      {chartType === 'bar' && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={filteredBarData}
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
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {availableProviders.map(provider => (
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
      )}
      
      {/* Pie Chart View */}
      {chartType === 'pie' && (
        <div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Total Monthly Cost Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {availableProviders.map(provider => (
              pricing[provider] && pricing[provider].total > 0 && (
                <div key={provider}>
                  <h3 className={`text-lg font-semibold mb-4 text-center text-${provider}`}>
                    {providerNames[provider]} Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={prepareBreakdownData(provider)}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {prepareBreakdownData(provider).map((entry, index) => (
                          <Cell key={`cell-${provider}-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )
            ))}
          </div>
        </div>
      )}
      
      {/* Forecast Chart View */}
      {chartType === 'forecast' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">12-Month Cost Forecast</h3>
          <p className="text-sm text-gray-500 mb-4 text-center">
            Based on {workload.businessMetrics?.expectedGrowth || 'moderate'} growth rate
          </p>
          
          <ResponsiveContainer width="100%" height={400}>
            {userType === 'business' ? (
              <AreaChart
                data={prepareForecastData()}
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
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {availableProviders.map(provider => (
                  pricing[provider] && (
                    <Area 
                      key={provider}
                      type="monotone"
                      dataKey={providerNames[provider]}
                      stackId="1"
                      stroke={providerColors[provider]}
                      fill={providerColors[provider]}
                      fillOpacity={0.6}
                    />
                  )
                ))}
              </AreaChart>
            ) : (
              <LineChart
                data={prepareForecastData()}
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
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {availableProviders.map(provider => (
                  pricing[provider] && (
                    <Line 
                      key={provider}
                      type="monotone"
                      dataKey={providerNames[provider]}
                      stroke={providerColors[provider]}
                      strokeWidth={2}
                    />
                  )
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
          
          {/* TCO Analysis for Business Users */}
          {userType === 'business' && (
            <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2">Total Cost of Ownership (TCO) Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableProviders.map(provider => (
                  pricing[provider] && (
                    <div key={provider} className="bg-white p-3 rounded border border-blue-100">
                      <div className="font-medium" style={{ color: providerColors[provider] }}>
                        {providerNames[provider]}
                      </div>
                      <div className="text-2xl font-bold">
                        ${(pricing[provider].total * 12).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">1-year TCO</div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
          
          {/* Performance/Cost Analysis for Developer Users */}
          {userType === 'developer' && (
            <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Performance to Cost Ratio</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableProviders.map(provider => {
                  // Calculate a mock performance score (would be based on benchmarks in real app)
                  const performanceScore = 70 + Math.floor(Math.random() * 30);
                  const costScore = Math.floor(100 - (pricing[provider]?.total / 
                    Math.max(...availableProviders.map(p => pricing[p]?.total || 0)) * 100));
                  
                  const overallScore = Math.floor((performanceScore + costScore) / 2);
                  
                  return pricing[provider] && (
                    <div key={provider} className="bg-white p-3 rounded border border-gray-200">
                      <div className="font-medium" style={{ color: providerColors[provider] }}>
                        {providerNames[provider]}
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Performance</div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${performanceScore}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-2 text-sm font-medium">{performanceScore}</div>
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Cost Efficiency</div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${costScore}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-2 text-sm font-medium">{costScore}</div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-500">Overall Score</div>
                        <div className="text-xl font-bold">{overallScore}/100</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CostComparisonChart;