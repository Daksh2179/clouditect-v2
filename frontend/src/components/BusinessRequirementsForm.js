import React from 'react';
import { useWorkload } from '../context/WorkloadContext';

const BusinessRequirementsForm = () => {
  const { workload, updateWorkload } = useWorkload();
  
  const handleComplianceChange = (compliance) => {
    const currentCompliance = [...(workload.complianceRequirements || [])];
    const index = currentCompliance.indexOf(compliance);
    
    if (index === -1) {
      // Add compliance requirement
      updateWorkload({
        complianceRequirements: [...currentCompliance, compliance]
      });
    } else {
      // Remove compliance requirement
      currentCompliance.splice(index, 1);
      updateWorkload({
        complianceRequirements: currentCompliance
      });
    }
  };
  
  const handleBusinessMetricChange = (metric, value) => {
    updateWorkload({
      businessMetrics: {
        ...(workload.businessMetrics || {}),
        [metric]: value
      }
    });
  };
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Business Requirements</h3>
      
      <div className="mb-6">
        <label className="form-label">Expected Growth Rate</label>
        <select 
          className="input-field"
          value={workload.businessMetrics?.expectedGrowth || 'moderate'}
          onChange={(e) => handleBusinessMetricChange('expectedGrowth', e.target.value)}
        >
          <option value="low">Low Growth (0-20% yearly)</option>
          <option value="moderate">Moderate Growth (20-50% yearly)</option>
          <option value="high">High Growth (50-100% yearly)</option>
          <option value="rapid">Rapid Growth (100%+ yearly)</option>
        </select>
        <p className="mt-1 text-sm text-gray-500">
          This helps us recommend scalable solutions that grow with your business
        </p>
      </div>
      
      <div className="mb-6">
        <label className="form-label">Monthly Budget Constraint (USD)</label>
        <input 
          type="number"
          min="0"
          placeholder="Enter your monthly budget limit"
          className="input-field"
          value={workload.businessMetrics?.budgetConstraint || ''}
          onChange={(e) => handleBusinessMetricChange('budgetConstraint', e.target.value)}
        />
        <p className="mt-1 text-sm text-gray-500">
          Optional: Helps us provide recommendations within your budget
        </p>
      </div>
      
      <div className="mb-6">
        <label className="form-label">Expected Monthly Active Users</label>
        <input 
          type="number"
          min="0"
          placeholder="Enter expected number of users"
          className="input-field"
          value={workload.businessMetrics?.userTraffic || ''}
          onChange={(e) => handleBusinessMetricChange('userTraffic', e.target.value)}
        />
        <p className="mt-1 text-sm text-gray-500">
          Helps us recommend appropriate sizing for your workloads
        </p>
      </div>
      
      <div className="mb-6">
        <label className="form-label">Compliance Requirements</label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {['GDPR', 'HIPAA', 'PCI DSS', 'SOC2', 'ISO 27001', 'FedRAMP'].map(compliance => (
            <label key={compliance} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
              <input 
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={(workload.complianceRequirements || []).includes(compliance)}
                onChange={() => handleComplianceChange(compliance)}
              />
              <span>{compliance}</span>
            </label>
          ))}
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Select any compliance standards that your solution must adhere to
        </p>
      </div>
    </div>
  );
};

export default BusinessRequirementsForm;