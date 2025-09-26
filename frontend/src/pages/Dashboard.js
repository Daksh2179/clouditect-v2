// frontend/src/pages/Dashboard.js
// Enhanced Dashboard.js for Business View
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWorkload } from '../context/WorkloadContext';
import CostComparisonChart from '../components/CostComparisonChart';
import RecommendationsList from '../components/RecommendationsList';
import ProviderCostCard from '../components/ProviderCostCard';
import RegionComparisonChart from '../components/RegionComparisonChart';

// Import new business components
import ExecutiveCostDashboard from '../components/business/ExecutiveCostDashboard';
import BusinessFitAnalysis from '../components/business/BusinessFitAnalysis';
import FinancialAnalysis from '../components/business/FinancialAnalysis';
import StrategicRecommendations from '../components/business/StrategicRecommendations';
import ComplianceRegionAnalysis from '../components/business/ComplianceRegionAnalysis';

import TechnicalArchitectureDashboard from '../components/developer/TechnicalArchitectureDashboard';
import DeveloperExperienceAssessment from '../components/developer/DeveloperExperienceAssessment';
import SecurityComplianceImplementation from '../components/developer/SecurityComplianceImplementation';
import AdvancedPerformanceAnalysis from '../components/developer/AdvancedPerformanceAnalysis';
// START MODIFICATION
import MultiCloudCompatibility from '../components/developer/MultiCloudCompatibility';
// END MODIFICATION

const Dashboard = () => {
  const { pricing, recommendations, workload } = useWorkload();
  const [preferredProvider, setPreferredProvider] = useState('aws');
  const userType = workload?.userType || 'business';
  
  // Set preferred provider from workload when pricing is available
  useEffect(() => {
    if (pricing && workload?.preferred_provider) {
      setPreferredProvider(workload.preferred_provider);
    }
  }, [pricing, workload]);
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {userType === 'business' ? 'Business Cloud Strategy Dashboard' : 'Technical Cloud Architecture Dashboard'}
      </h1>
      
      {!pricing ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Welcome to Clouditect</h2>
          <p className="text-gray-600 mb-6">
            Make data-driven cloud strategy decisions with comprehensive provider comparisons.
          </p>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
            <Link 
              to="/workload/simple" 
              className={userType === 'business' ? "btn-business" : "btn-primary"}
            >
              Business Cloud Strategy
            </Link>
            <Link 
              to="/workload/detailed" 
              className={userType === 'developer' ? "btn-developer" : "btn-secondary"}
            >
              Technical Cloud Architecture
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-blue-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">Multi-Cloud Analysis</h3>
              <p className="text-gray-600 text-sm">
                Compare costs and features across 7 major cloud providers
              </p>
            </div>
            
            <div className="card text-center">
              <div className="text-blue-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">Strategic Insights</h3>
              <p className="text-gray-600 text-sm">
                Get tailored recommendations for your specific business needs
              </p>
            </div>
            
            <div className="card text-center">
              <div className="text-blue-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">{userType === 'business' ? 'Cost Optimization' : 'Technical Optimization'}</h3>
              <p className="text-gray-600 text-sm">
                {userType === 'business' 
                  ? 'Identify savings opportunities with actionable recommendations' 
                  : 'Get architecture best practices and performance optimizations'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* User Type Indicator */}
          <div className="bg-white border-l-4 px-4 py-3 shadow-sm rounded-lg flex justify-between items-center">
            <div>
              <div className={`border-l-4 ${userType === 'business' ? 'border-blue-500' : 'border-purple-500'} pl-3`}>
                <p className="text-sm text-gray-600">
                  {userType === 'business' ? 'Business Strategy View' : 'Technical Architecture View'}
                </p>
                <p className="text-lg font-semibold">
                  {userType === 'business' 
                    ? 'Cloud Strategy Analysis Dashboard' 
                    : 'Technical Cloud Architecture Dashboard'}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                className="btn-outline flex items-center"
                onClick={() => alert('Report would be exported as PDF')}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                </svg>
                Export PDF
              </button>
              <button
                className="btn-outline flex items-center"
                onClick={() => alert('Data would be exported as CSV')}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Export CSV
              </button>
            </div>
          </div>
          
          {/* Business View */}
          {userType === 'business' && (
            <>
              <ExecutiveCostDashboard pricing={pricing} workload={workload} />
              <BusinessFitAnalysis pricing={pricing} workload={workload} />
              <FinancialAnalysis pricing={pricing} workload={workload} />
              <StrategicRecommendations recommendations={recommendations} pricing={pricing} workload={workload} />
              <ComplianceRegionAnalysis pricing={pricing} workload={workload} />
            </>
          )}
          
          {/* Developer View */}
{userType === 'developer' && (
  <>
    <TechnicalArchitectureDashboard pricing={pricing} workload={workload} />
    <DeveloperExperienceAssessment pricing={pricing} workload={workload} />
    <MultiCloudCompatibility pricing={pricing} workload={workload} />
    <SecurityComplianceImplementation pricing={pricing} workload={workload} />
    <AdvancedPerformanceAnalysis pricing={pricing} workload={workload} />
    
    {/* Standard Cost Comparison */}
    <div className="card mt-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Cost Breakdown</h2>
      <CostComparisonChart pricing={pricing} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {Object.keys(pricing).map(provider => (
          <ProviderCostCard 
            key={provider}
            provider={provider} 
            data={pricing[provider]} 
            color={
              provider === 'aws' ? 'aws' : 
              provider === 'azure' ? 'azure' : 
              provider === 'gcp' ? 'gcp' : 
              provider === 'oracle' ? 'orange-500' : 
              provider === 'ibm' ? 'blue-700' :
              provider === 'alibaba' ? 'red-600' : 'blue-500'
            }
          />
        ))}
      </div>
    </div>
    
    {/* Region Comparison - Keep if useful for developers */}
    <div className="card mt-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Regional Performance Analysis</h2>
      <div className="mb-4">
        <p className="text-gray-600 mb-4">
          Compare performance metrics across different geographic regions.
        </p>
        
        <div className="mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {Object.keys(pricing).map(provider => (
              <button 
                key={provider}
                className={`px-4 py-2 text-sm font-medium ${
                  preferredProvider === provider ? 
                    provider === 'aws' ? 'bg-aws text-white' : 
                    provider === 'azure' ? 'bg-azure text-white' : 
                    provider === 'gcp' ? 'bg-gcp text-white' :
                    provider === 'oracle' ? 'bg-orange-500 text-white' :
                    provider === 'ibm' ? 'bg-blue-700 text-white' :
                    provider === 'alibaba' ? 'bg-red-600 text-white' : 'bg-blue-500 text-white' :
                    'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
                onClick={() => setPreferredProvider(provider)}
              >
                {provider.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        
        <RegionComparisonChart provider={preferredProvider} workload={workload} />
      </div>
    </div>
  </>
)}
          
          <div className="flex justify-center mt-8">
            <Link 
              to={userType === 'business' ? "/workload/simple" : "/workload/detailed"} 
              className={userType === 'business' ? "btn-business mr-4" : "btn-developer mr-4"}
            >
              New Analysis
            </Link>
            <Link to={workload.name && workload.name.includes('template') ? "/workload/simple" : "/workload/detailed"} className="btn-secondary">
              Modify Configuration
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;