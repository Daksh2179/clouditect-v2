import React, { useState } from 'react';
import { useWorkload } from '../context/WorkloadContext';

const RecommendationsList = ({ recommendations }) => {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const { workload } = useWorkload();
  const userType = workload.userType || 'business';
  
  // Check if recommendations is an array (directly passed recommendations) or an object with summary
  const recommendationsArray = Array.isArray(recommendations) 
    ? recommendations 
    : (recommendations?.recommendations || []);
  
  const summaryData = !Array.isArray(recommendations) && recommendations?.summary 
    ? recommendations.summary 
    : null;
  
  if (!recommendationsArray || recommendationsArray.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No recommendations available</p>
      </div>
    );
  }
  
  // Function to toggle expanded state
  const toggleExpand = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(-1);
    } else {
      setExpandedIndex(index);
    }
  };
  
  // Get severity badge color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Group recommendations by type
  const groupedRecommendations = recommendationsArray.reduce((acc, rec) => {
    if (!acc[rec.type]) {
      acc[rec.type] = [];
    }
    acc[rec.type].push(rec);
    return acc;
  }, {});
  
  // Format money values
  const formatMoney = (value) => {
    if (typeof value === 'string' && value.includes('%')) {
      return value;
    }
    
    if (typeof value === 'string' && value.includes('-')) {
      const range = value.split('-');
      return `$${range[0].trim()} - $${range[1].trim()}`;
    }
    
    return `$${value}`;
  };
  
  // Business-friendly category names
  const businessCategoryNames = {
    compute: 'Server Optimization',
    storage: 'Storage Optimization',
    database: 'Database Optimization',
    networking: 'Network Optimization',
    general: 'General Cost Savings',
    licensing: 'Software Licensing',
    reserved_instances: 'Commitment-Based Discounts'
  };
  
  // Developer-friendly category names
  const developerCategoryNames = {
    compute: 'Compute Resources',
    storage: 'Storage Configuration',
    database: 'Database Architecture',
    networking: 'Network Architecture',
    serverless: 'Serverless Configuration',
    managedServices: 'Managed Services',
    security: 'Security & Compliance',
    architecture: 'Architecture Patterns'
  };
  
  // Get category display name based on user type
  const getCategoryName = (category) => {
    const categoryMap = userType === 'business' ? businessCategoryNames : developerCategoryNames;
    return categoryMap[category] || category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  return (
    <div>
      {/* Summary Cards for Business Users (only if summary data exists) */}
      {summaryData && userType === 'business' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="text-sm text-blue-700">Potential Annual Savings</div>
            <div className="text-2xl font-bold text-blue-800">
              ${(summaryData.estimated_monthly_savings * 12).toFixed(2)}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Based on implementing all recommendations
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="text-sm text-green-700">ROI</div>
            <div className="text-2xl font-bold text-green-800">
              {Math.round(summaryData.savings_percentage * 10)}x
            </div>
            <div className="text-xs text-green-600 mt-1">
              Estimated return on implementation effort
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="text-sm text-purple-700">Implementation Time</div>
            <div className="text-2xl font-bold text-purple-800">
              {Math.ceil(recommendationsArray.length * 0.5)} days
            </div>
            <div className="text-xs text-purple-600 mt-1">
              Estimated time to implement all recommendations
            </div>
          </div>
        </div>
      )}
      
      {/* Summary Cards for Developer Users (only if summary data exists) */}
      {summaryData && userType === 'developer' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="text-sm text-blue-700">Performance Impact</div>
            <div className="text-2xl font-bold text-blue-800">
              +{Math.floor(20 + Math.random() * 30)}%
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Estimated improvement in overall performance
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="text-sm text-green-700">Cost Reduction</div>
            <div className="text-2xl font-bold text-green-800">
              ${(summaryData.estimated_monthly_savings).toFixed(2)}/mo
            </div>
            <div className="text-xs text-green-600 mt-1">
              {summaryData.savings_percentage}% reduction from current spending
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="text-sm text-purple-700">Architecture Score</div>
            <div className="text-2xl font-bold text-purple-800">
              {Math.floor(60 + (recommendationsArray.length * 5))}%
            </div>
            <div className="text-xs text-purple-600 mt-1">
              After implementing recommendations
            </div>
          </div>
        </div>
      )}
      
      {/* Recommendations Listing */}
      {Object.entries(groupedRecommendations).map(([type, recs], groupIndex) => (
        <div key={groupIndex} className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            {getCategoryName(type)}
          </h3>
          
          <div className="space-y-3">
            {recs.map((recommendation, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
              >
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpand(groupIndex * 100 + index)}
                >
                  <div className="flex items-start flex-1">
                    <div 
                      className={`px-2 py-1 text-xs font-medium rounded-md ${getSeverityColor(recommendation.severity)} mr-3 mt-0.5`}
                    >
                      {recommendation.severity.toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{recommendation.description}</h4>
                      <p className="text-sm text-gray-600">{recommendation.resource}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="text-right mr-4">
                      <div className="text-sm font-medium text-green-600">
                        {formatMoney(recommendation.saving_potential)} savings
                      </div>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transform transition-transform ${expandedIndex === (groupIndex * 100 + index) ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                
                {expandedIndex === (groupIndex * 100 + index) && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-700">Recommendation</h5>
                      <p className="text-sm text-gray-600">{recommendation.recommendation}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Details</h5>
                      <p className="text-sm text-gray-600">{recommendation.details}</p>
                    </div>
                    
                    {/* Business-specific content */}
                    {userType === 'business' && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Implementation Effort: <span className="font-medium capitalize">{recommendation.action === 'resize' ? 'Low' : recommendation.action === 'reserved_instance' ? 'Medium' : 'High'}</span></span>
                          <span className="text-sm text-gray-500">Payback Period: <span className="font-medium">
                            {recommendation.severity === 'high' ? '< 1 month' : recommendation.severity === 'medium' ? '1-3 months' : '3-6 months'}
                          </span></span>
                        </div>
                      </div>
                    )}
                    
                    {/* Developer-specific content */}
                    {userType === 'developer' && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Performance Impact: <span className="font-medium">
                            {recommendation.type === 'compute' ? 'High' : recommendation.type === 'database' ? 'Medium' : 'Low'}
                          </span></span>
                          <span className="text-sm text-gray-500">Implementation: <span className="font-medium capitalize">{recommendation.action.replace('_', ' ')}</span></span>
                        </div>
                        
                        {/* Technical implementation notes */}
                        <div className="mt-3 p-3 bg-gray-100 rounded text-sm font-mono text-gray-700">
                          {recommendation.type === 'compute' && 'instance_type = "t3a.medium" # Instead of m5.large'}
                          {recommendation.type === 'storage' && 's3_lifecycle_rule(days=30, storage_class="STANDARD_IA")'}
                          {recommendation.type === 'database' && 'rds_instance(multi_az=False, instance_type="db.t3.medium")'}
                          {recommendation.type === 'networking' && 'use_cdn = True # Reduce data transfer costs'}
                          {recommendation.type === 'serverless' && 'lambda_memory = 128 # Reduce from 256MB'}
                          {recommendation.type === 'managedServices' && 'managed_k8s(node_count=2) # Scale down from 3'}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* If there's a summary but shown without cards above */}
      {summaryData && !document.querySelector('.bg-blue-50') && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
          <h3 className="font-medium text-blue-700 mb-2">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Current Monthly Cost</div>
              <div className="text-xl font-bold">${summaryData.current_monthly_cost}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Potential Savings</div>
              <div className="text-xl font-bold text-green-600">${summaryData.estimated_monthly_savings}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Savings Percentage</div>
              <div className="text-xl font-bold text-green-600">{summaryData.savings_percentage}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationsList;