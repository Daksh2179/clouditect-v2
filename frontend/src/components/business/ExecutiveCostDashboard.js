// frontend/src/components/business/ExecutiveCostDashboard.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ExecutiveCostDashboard = ({ pricing, workload }) => {
  if (!pricing) return null;

  // Get available providers
  const providers = Object.keys(pricing);
  
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
  
  // Find the cheapest provider
  let cheapestProvider = providers[0];
  providers.forEach(provider => {
    if (pricing[provider].total < pricing[cheapestProvider].total) {
      cheapestProvider = provider;
    }
  });
  
  // Sort providers by cost
  const sortedProviders = [...providers].sort((a, b) => 
    pricing[a].total - pricing[b].total
  );
  
  // Format cost data for chart
  const costData = sortedProviders.map(provider => ({
    name: providerNames[provider] || provider.toUpperCase(),
    value: pricing[provider].total,
    color: providerColors[provider]
  }));
  
  // Budget analysis
  const budgetLimit = workload.businessMetrics?.budgetConstraint;
  const withinBudget = budgetLimit ? pricing[cheapestProvider].total <= budgetLimit : null;
  
  // Format for pie chart
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    if (percent < 0.05) return null;
    
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Executive Cost Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-sm text-blue-600">Recommended Provider</div>
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-800 capitalize mr-2">
              {providerNames[cheapestProvider] || cheapestProvider}
            </div>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Lowest Cost
            </span>
          </div>
          <div className="text-sm text-blue-600 mt-1">
            ${pricing[cheapestProvider].total.toFixed(2)}/month
          </div>
        </div>
        
        {budgetLimit && (
          <div className={`p-4 rounded-lg border ${withinBudget ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
            <div className="text-sm text-gray-600">Budget Status</div>
            <div className="flex items-center">
              <div className={`text-xl font-bold ${withinBudget ? 'text-green-700' : 'text-red-700'}`}>
                {withinBudget ? 'Within Budget' : 'Over Budget'}
              </div>
            </div>
            <div className={`text-sm mt-1 ${withinBudget ? 'text-green-600' : 'text-red-600'}`}>
              {withinBudget 
                ? `$${(budgetLimit - pricing[cheapestProvider].total).toFixed(2)} under budget`
                : `$${(pricing[cheapestProvider].total - budgetLimit).toFixed(2)} over budget`
              }
            </div>
          </div>
        )}
        
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <div className="text-sm text-indigo-600">Potential Annual Cost</div>
          <div className="text-2xl font-bold text-indigo-800">
            ${(pricing[cheapestProvider].total * 12).toFixed(2)}
          </div>
          <div className="text-sm text-indigo-600 mt-1">
            Based on current configuration
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Monthly Cost by Provider</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={sortedProviders.map(provider => ({
                name: providerNames[provider] || provider.toUpperCase(),
                value: pricing[provider].total
              }))}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 'auto']} />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Bar 
                dataKey="value" 
                fill="#4361ee"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Cost Breakdown for {providerNames[cheapestProvider]}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Compute', value: pricing[cheapestProvider].compute, color: '#4361ee' },
                  { name: 'Storage', value: pricing[cheapestProvider].storage, color: '#acc937ff' },
                  { name: 'Database', value: pricing[cheapestProvider].database, color: '#2cc25eff' },
                  { name: 'Networking', value: pricing[cheapestProvider].networking || 0, color: '#4cc9f0' },
                  { name: 'Serverless', value: pricing[cheapestProvider].serverless || 0, color: '#915ccfff' },
                  { name: 'Managed Services', value: pricing[cheapestProvider].managedServices || 0, color: '#d71c12ff' },
                ].filter(item => item.value > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#141318ff"
                dataKey="value"
              >
                {costData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveCostDashboard;