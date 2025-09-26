import React from 'react';
import { useWorkload } from '../context/WorkloadContext';

const DeveloperRequirementsForm = () => {
  const { workload, updateWorkload } = useWorkload();
  
  const handleTechnicalRequirementChange = (requirement, value) => {
    updateWorkload({
      technicalRequirements: {
        ...(workload.technicalRequirements || {}),
        [requirement]: value
      }
    });
  };
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Technical Requirements</h3>
      
      <div className="mb-6">
        <label className="form-label">Architecture Pattern</label>
        <select 
          className="input-field"
          value={workload.technicalRequirements?.architecturePattern || 'traditional'}
          onChange={(e) => handleTechnicalRequirementChange('architecturePattern', e.target.value)}
        >
          <option value="traditional">Traditional (Monolithic)</option>
          <option value="microservices">Microservices</option>
          <option value="serverless">Serverless</option>
          <option value="hybrid">Hybrid (Microservices + Serverless)</option>
        </select>
        <p className="mt-1 text-sm text-gray-500">
          This impacts the types of services and resources recommended
        </p>
      </div>
      
      <div className="mb-6">
        <label className="form-label">High Availability Requirements</label>
        <div className="grid grid-cols-1 gap-4 mt-2">
          <label className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <input 
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={workload.technicalRequirements?.highAvailability || false}
              onChange={(e) => handleTechnicalRequirementChange('highAvailability', e.target.checked)}
            />
            <div>
              <div className="font-medium">High Availability</div>
              <div className="text-sm text-gray-500">Multi-AZ deployment for fault tolerance</div>
            </div>
          </label>
          
          <label className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <input 
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={workload.technicalRequirements?.disasterRecovery || false}
              onChange={(e) => handleTechnicalRequirementChange('disasterRecovery', e.target.checked)}
            />
            <div>
              <div className="font-medium">Disaster Recovery</div>
              <div className="text-sm text-gray-500">Cross-region backup and recovery capabilities</div>
            </div>
          </label>
          
          <label className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <input 
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={workload.technicalRequirements?.autoscaling || false}
              onChange={(e) => handleTechnicalRequirementChange('autoscaling', e.target.checked)}
            />
            <div>
              <div className="font-medium">Auto Scaling</div>
              <div className="text-sm text-gray-500">Dynamic resource scaling based on load</div>
            </div>
          </label>
          
          <label className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <input 
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={workload.technicalRequirements?.multiRegion || false}
              onChange={(e) => handleTechnicalRequirementChange('multiRegion', e.target.checked)}
            />
            <div>
              <div className="font-medium">Multi-Region Deployment</div>
              <div className="text-sm text-gray-500">Deploy across multiple geographic regions</div>
            </div>
          </label>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="form-label">CI/CD Pipeline Requirements</label>
        <select 
          className="input-field"
          value={workload.technicalRequirements?.cicdRequirements || 'basic'}
          onChange={(e) => handleTechnicalRequirementChange('cicdRequirements', e.target.value)}
        >
          <option value="none">None (Manual deployments)</option>
          <option value="basic">Basic (Simple automation)</option>
          <option value="advanced">Advanced (Full CI/CD with testing)</option>
          <option value="gitops">GitOps (Infrastructure as Code)</option>
        </select>
        <p className="mt-1 text-sm text-gray-500">
          This affects recommended developer tools and services
        </p>
      </div>
      
      <div className="mb-6">
        <label className="form-label">Performance Requirements</label>
        <select 
          className="input-field"
          value={workload.technicalRequirements?.performanceRequirements || 'standard'}
          onChange={(e) => handleTechnicalRequirementChange('performanceRequirements', e.target.value)}
        >
          <option value="standard">Standard (Average workload)</option>
          <option value="high">High Performance (CPU optimized)</option>
          <option value="memory">Memory Intensive</option>
          <option value="storage">Storage Optimized</option>
          <option value="gpu">GPU/Machine Learning</option>
        </select>
        <p className="mt-1 text-sm text-gray-500">
          Helps us recommend instance types optimized for your workload
        </p>
      </div>
    </div>
  );
};

export default DeveloperRequirementsForm;