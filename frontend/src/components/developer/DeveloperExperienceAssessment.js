import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const DeveloperExperienceAssessment = ({ pricing, workload }) => {
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
    ibm: 'IBM',
    alibaba: 'Alibaba'
  };
  
  // Developer experience ratings
  const developerExperience = {
    aws: {
      'Documentation Quality': 4.5,
      'SDK Maturity': 4.8,
      'CLI Experience': 4.6,
      'Local Development': 4.0,
      'Error Messages': 3.8,
      'Community Support': 5.0
    },
    azure: {
      'Documentation Quality': 4.2,
      'SDK Maturity': 4.5,
      'CLI Experience': 4.4,
      'Local Development': 4.5,
      'Error Messages': 4.0,
      'Community Support': 4.2
    },
    gcp: {
      'Documentation Quality': 4.4,
      'SDK Maturity': 4.3,
      'CLI Experience': 4.5,
      'Local Development': 4.2,
      'Error Messages': 4.2,
      'Community Support': 4.0
    },
    oracle: {
      'Documentation Quality': 3.8,
      'SDK Maturity': 3.5,
      'CLI Experience': 3.7,
      'Local Development': 3.2,
      'Error Messages': 3.5,
      'Community Support': 3.0
    },
    ibm: {
      'Documentation Quality': 4.0,
      'SDK Maturity': 3.8,
      'CLI Experience': 3.9,
      'Local Development': 3.5,
      'Error Messages': 3.7,
      'Community Support': 3.5
    },
    alibaba: {
      'Documentation Quality': 3.0,
      'SDK Maturity': 3.5,
      'CLI Experience': 3.2,
      'Local Development': 3.0,
      'Error Messages': 3.0,
      'Community Support': 2.8
    }
  };
  
  // Language-specific SDK ratings
  const languageSDKs = {
    'JavaScript/Node.js': {
      aws: 5,
      azure: 4.5,
      gcp: 4.5,
      oracle: 3.5,
      ibm: 4,
      alibaba: 3.5
    },
    'Python': {
      aws: 5,
      azure: 4.5,
      gcp: 4.8,
      oracle: 3.8,
      ibm: 4,
      alibaba: 3.5
    },
    'Java': {
      aws: 4.8,
      azure: 4.5,
      gcp: 4.5,
      oracle: 4.5,
      ibm: 4.2,
      alibaba: 4
    },
    '.NET': {
      aws: 4.5,
      azure: 5,
      gcp: 4,
      oracle: 3.5,
      ibm: 3.8,
      alibaba: 3.2
    },
    'Go': {
      aws: 4.5,
      azure: 4,
      gcp: 4.8,
      oracle: 3.2,
      ibm: 3.5,
      alibaba: 3
    },
    'Ruby': {
      aws: 4,
      azure: 3.8,
      gcp: 4,
      oracle: 3,
      ibm: 3.5,
      alibaba: 2.8
    }
  };
  
  // Get programming language preference, default to JavaScript
  const preferredLanguage = workload.technicalRequirements?.programmingLanguage || 'JavaScript/Node.js';
  
  // Developer tooling information
  const developerTooling = {
    aws: {
      'IDE Plugins': ['AWS Toolkit for VS Code', 'AWS Toolkit for JetBrains', 'AWS Toolkit for Visual Studio'],
      'Local Development': ['LocalStack', 'AWS SAM Local', 'Docker images for services'],
      'CI/CD Integration': ['AWS CodePipeline', 'AWS CodeBuild', 'GitHub Actions support', 'Jenkins plugins'],
      'Infrastructure as Code': ['CloudFormation', 'AWS CDK', 'Terraform provider'],
      'Monitoring & Debugging': ['CloudWatch', 'X-Ray', 'AWS App Runner']
    },
    azure: {
      'IDE Plugins': ['Azure Tools for VS Code', 'Azure Toolkit for IntelliJ', 'Visual Studio integration'],
      'Local Development': ['Azurite', 'Azure Functions Core Tools', 'Dev Spaces'],
      'CI/CD Integration': ['Azure DevOps', 'GitHub Actions', 'Jenkins plugins'],
      'Infrastructure as Code': ['ARM Templates', 'Bicep', 'Terraform provider'],
      'Monitoring & Debugging': ['Application Insights', 'Azure Monitor', 'Log Analytics']
    },
    gcp: {
      'IDE Plugins': ['Cloud Tools for VS Code', 'Cloud Tools for IntelliJ', 'Cloud Tools for Eclipse'],
      'Local Development': ['Cloud SDK', 'Minikube', 'Cloud Code'],
      'CI/CD Integration': ['Cloud Build', 'Cloud Deploy', 'GitHub Actions support'],
      'Infrastructure as Code': ['Deployment Manager', 'Terraform provider'],
      'Monitoring & Debugging': ['Cloud Monitoring', 'Cloud Trace', 'Error Reporting']
    },
    oracle: {
      'IDE Plugins': ['OCI Toolkit for Eclipse', 'OCI VS Code plugin'],
      'Local Development': ['OCI CLI', 'Resource Manager'],
      'CI/CD Integration': ['OCI DevOps service', 'Jenkins plugins'],
      'Infrastructure as Code': ['Terraform provider', 'Resource Manager'],
      'Monitoring & Debugging': ['Application Performance Monitoring', 'Logging']
    },
    ibm: {
      'IDE Plugins': ['IBM Cloud Developer Tools extension for VS Code'],
      'Local Development': ['IBM Cloud CLI', 'IBM Cloud Shell'],
      'CI/CD Integration': ['IBM Continuous Delivery', 'Tekton integration'],
      'Infrastructure as Code': ['Terraform provider', 'Schematics'],
      'Monitoring & Debugging': ['IBM Cloud Monitoring', 'IBM Cloud Logging']
    },
    alibaba: {
      'IDE Plugins': ['Alibaba Cloud Toolkit for Eclipse', 'Alibaba Cloud Toolkit for IntelliJ'],
      'Local Development': ['Alibaba Cloud CLI', 'Serverless Devs'],
      'CI/CD Integration': ['Container Registry', 'Flow Control'],
      'Infrastructure as Code': ['Resource Orchestration Service', 'Terraform provider'],
      'Monitoring & Debugging': ['CloudMonitor', 'Log Service']
    }
  };
  
  // Prepare radar data for developer experience
  const prepareDevExRadarData = () => {
    return Object.keys(developerExperience.aws).map(metric => {
      const data = { metric };
      Object.keys(pricing).forEach(provider => {
        if (pricing[provider]) {
          data[provider] = developerExperience[provider][metric];
        }
      });
      return data;
    });
  };
  
  const devExRadarData = prepareDevExRadarData();
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Developer Experience Assessment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Developer Experience Rating</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200" style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={devExRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 5]} />
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
          <h3 className="font-medium text-gray-900 mb-3">
            {preferredLanguage} SDK Ratings
          </h3>
          
          <div className="space-y-4">
            {Object.keys(pricing).map(provider => (
              <div key={provider} className="flex items-center">
                <div className="w-32 flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: providerColors[provider] }}></div>
                  <div className="text-sm font-medium">{providerNames[provider]}</div>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ 
                        width: `${(languageSDKs[preferredLanguage][provider] / 5) * 100}%`,
                        backgroundColor: providerColors[provider]
                      }}
                    ></div>
                  </div>
                </div>
                <div className="w-10 text-right text-sm font-medium ml-2">
                  {languageSDKs[preferredLanguage][provider]}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="text-sm text-blue-800">
              {preferredLanguage} SDK quality ratings are based on documentation coverage, feature parity, community adoption, and release frequency.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="font-medium text-gray-900 mb-3">Developer Tooling Comparison</h3>
        
        <div className="mt-4 space-y-6">
          {['IDE Plugins', 'Local Development', 'CI/CD Integration', 'Infrastructure as Code', 'Monitoring & Debugging'].map(category => (
            <div key={category}>
              <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(pricing).map(provider => (
                  <div key={provider} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: providerColors[provider] }}></div>
                      <div className="text-sm font-medium">{providerNames[provider]}</div>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {developerTooling[provider][category].map((tool, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-100">
        <h3 className="font-medium text-green-800 mb-2">Key Developer Experience Takeaways</h3>
        <div className="space-y-2 text-sm text-green-700">
          <p className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mr-1.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
            <span>AWS offers the most mature development experience with the largest community and ecosystem, but has a steeper learning curve.</span>
          </p>
          <p className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mr-1.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
            <span>Azure provides the best integration with Microsoft development tools and excellent support for .NET developers.</span>
          </p>
          <p className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mr-1.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
            <span>GCP excels in its clean API design, Python SDK quality, and container-native approach.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeveloperExperienceAssessment;