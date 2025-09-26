import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const TechnicalArchitectureDashboard = ({ pricing, workload }) => {
  const [activeTab, setActiveTab] = useState('services');
  
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
  
  // Service mapping between providers
  const serviceMapping = {
    compute: {
      aws: 'EC2',
      azure: 'Virtual Machines',
      gcp: 'Compute Engine',
      oracle: 'Compute',
      ibm: 'Virtual Servers',
      alibaba: 'ECS'
    },
    containerOrchestration: {
      aws: 'EKS',
      azure: 'AKS',
      gcp: 'GKE',
      oracle: 'OKE',
      ibm: 'IKS',
      alibaba: 'ACK'
    },
    objectStorage: {
      aws: 'S3',
      azure: 'Blob Storage',
      gcp: 'Cloud Storage',
      oracle: 'Object Storage',
      ibm: 'Cloud Object Storage',
      alibaba: 'OSS'
    },
    relationalDatabase: {
      aws: 'RDS',
      azure: 'Azure SQL',
      gcp: 'Cloud SQL',
      oracle: 'DB System',
      ibm: 'Db2',
      alibaba: 'RDS'
    },
    nosqlDatabase: {
      aws: 'DynamoDB',
      azure: 'Cosmos DB',
      gcp: 'Firestore',
      oracle: 'NoSQL',
      ibm: 'Cloudant',
      alibaba: 'Table Store'
    },
    serverless: {
      aws: 'Lambda',
      azure: 'Functions',
      gcp: 'Cloud Functions',
      oracle: 'Functions',
      ibm: 'Cloud Functions',
      alibaba: 'Function Compute'
    }
  };
  
  // Feature comparison data
  const featureComparison = {
    containerOrchestration: {
      aws: {
        features: {
          'Kubernetes Version Currency': 4,
          'Automated Node Management': 5,
          'Multi-AZ Support': 5,
          'Integration with CI/CD': 4,
          'Serverless Option': 5,
          'Ecosystem Integrations': 5
        },
        pros: ['Excellent integration with AWS services', 'Fargate for serverless containers', 'Strong security controls'],
        cons: ['More complex setup', 'Higher cost than GKE', 'AWS-specific implementation details']
      },
      azure: {
        features: {
          'Kubernetes Version Currency': 4,
          'Automated Node Management': 5,
          'Multi-AZ Support': 5,
          'Integration with CI/CD': 5,
          'Serverless Option': 4,
          'Ecosystem Integrations': 4
        },
        pros: ['Excellent GitHub/DevOps integration', 'Virtual Node (serverless containers)', 'Strong RBAC and policy support'],
        cons: ['Occasional stability issues', 'Limited regions compared to VMs', 'Configuration complexity']
      },
      gcp: {
        features: {
          'Kubernetes Version Currency': 5,
          'Automated Node Management': 5,
          'Multi-AZ Support': 5,
          'Integration with CI/CD': 4,
          'Serverless Option': 5,
          'Ecosystem Integrations': 4
        },
        pros: ['Created by Google (Kubernetes creators)', 'Autopilot for fully managed K8s', 'Best version currency'],
        cons: ['Less enterprise tooling', 'Narrower feature set than AWS/Azure', 'Documentation gaps']
      },
      oracle: {
        features: {
          'Kubernetes Version Currency': 3,
          'Automated Node Management': 4,
          'Multi-AZ Support': 4,
          'Integration with CI/CD': 3,
          'Serverless Option': 2,
          'Ecosystem Integrations': 3
        },
        pros: ['Good performance', 'Solid security', 'Competitive pricing'],
        cons: ['Fewer managed services', 'Slower version updates', 'Limited serverless options']
      },
      ibm: {
        features: {
          'Kubernetes Version Currency': 4,
          'Automated Node Management': 4,
          'Multi-AZ Support': 5,
          'Integration with CI/CD': 4,
          'Serverless Option': 3,
          'Ecosystem Integrations': 3
        },
        pros: ['Strong enterprise support', 'Good hybrid cloud options', 'OpenShift integration'],
        cons: ['Higher cost than alternatives', 'More complex setup', 'Smaller ecosystem']
      },
      alibaba: {
        features: {
          'Kubernetes Version Currency': 3,
          'Automated Node Management': 4,
          'Multi-AZ Support': 4,
          'Integration with CI/CD': 3,
          'Serverless Option': 3,
          'Ecosystem Integrations': 2
        },
        pros: ['Cost-effective', 'Good performance in Asia', 'Simplified management'],
        cons: ['Limited global presence', 'Fewer ecosystem integrations', 'Documentation mostly in Chinese']
      }
    },
    serverless: {
      aws: {
        features: {
          'Cold Start Time': 4,
          'Max Execution Time': 4,
          'Memory Options': 5,
          'Event Source Variety': 5,
          'Local Development': 4,
          'Language Support': 5
        },
        pros: ['Extensive ecosystem and integrations', 'Mature tooling', 'Large community'],
        cons: ['Complicated permission model', 'VPC cold start penalties', 'Limited local testing']
      },
      azure: {
        features: {
          'Cold Start Time': 3,
          'Max Execution Time': 5,
          'Memory Options': 4,
          'Event Source Variety': 4,
          'Local Development': 5,
          'Language Support': 4
        },
        pros: ['Excellent development experience', 'Visual Studio integration', 'Strong .NET support'],
        cons: ['Slower cold starts', 'Complex deployment model', 'Less mature than AWS']
      },
      gcp: {
        features: {
          'Cold Start Time': 4,
          'Max Execution Time': 3,
          'Memory Options': 4,
          'Event Source Variety': 4,
          'Local Development': 3,
          'Language Support': 4
        },
        pros: ['Simpler execution model', 'HTTP-centric approach', 'Good integration with GCP services'],
        cons: ['Limited execution time', 'Fewer triggers than AWS', 'Less mature tooling']
      },
      oracle: {
        features: {
          'Cold Start Time': 3,
          'Max Execution Time': 3,
          'Memory Options': 3,
          'Event Source Variety': 3,
          'Local Development': 3,
          'Language Support': 3
        },
        pros: ['Oracle Cloud integration', 'Reasonable pricing', 'Docker container support'],
        cons: ['Limited ecosystem', 'Fewer language options', 'Less mature platform']
      },
      ibm: {
        features: {
          'Cold Start Time': 4,
          'Max Execution Time': 4,
          'Memory Options': 3,
          'Event Source Variety': 3,
          'Local Development': 3,
          'Language Support': 4
        },
        pros: ['OpenWhisk open-source base', 'Good enterprise support', 'Composable functions'],
        cons: ['Less intuitive developer experience', 'Smaller ecosystem', 'Limited triggers']
      },
      alibaba: {
        features: {
          'Cold Start Time': 3,
          'Max Execution Time': 3,
          'Memory Options': 3,
          'Event Source Variety': 3,
          'Local Development': 2,
          'Language Support': 3
        },
        pros: ['Cost-effective', 'Good integration with Alibaba Cloud', 'Performant in Asia'],
        cons: ['Limited global presence', 'Fewer ecosystem integrations', 'Documentation challenges']
      }
    }
  };
  
  // Service implementation details
  const serviceImplementation = {
    aws: {
      compute: 'Amazon EC2 offers a wide range of instance types optimized for different use cases.',
      storage: 'Amazon S3 provides object storage with 99.999999999% durability.',
      database: 'Amazon RDS supports MySQL, PostgreSQL, SQL Server, Oracle, and MariaDB engines.',
      networking: 'AWS VPC with subnets, security groups, and network ACLs.'
    },
    azure: {
      compute: 'Azure Virtual Machines include specialized sizes for compute, memory, and storage.',
      storage: 'Azure Blob Storage offers hot, cool, and archive access tiers.',
      database: 'Azure SQL Database and Azure Cosmos DB for relational and NoSQL data.',
      networking: 'Azure Virtual Network with NSGs, Application Gateway, and Load Balancer.'
    },
    gcp: {
      compute: 'Google Compute Engine with predefined and custom machine types.',
      storage: 'Google Cloud Storage with multi-regional, regional, nearline, and coldline options.',
      database: 'Cloud SQL for relational and Firestore for NoSQL document data.',
      networking: 'VPC with global load balancing and Cloud CDN.'
    },
    oracle: {
      compute: 'Oracle Compute with flexible shapes and dedicated host options.',
      storage: 'Oracle Object Storage with standard and archive tiers.',
      database: 'Oracle Database service with autonomous options.',
      networking: 'Virtual Cloud Network with security lists and load balancing.'
    },
    ibm: {
      compute: 'IBM Virtual Servers with profiles for different workloads.',
      storage: 'IBM Cloud Object Storage with regional and cross-regional options.',
      database: 'IBM Db2 and Cloudant for relational and NoSQL needs.',
      networking: 'IBM Cloud VPC with security groups and load balancers.'
    },
    alibaba: {
      compute: 'Elastic Compute Service with a variety of instance families.',
      storage: 'Object Storage Service with standard, IA, and archive storage classes.',
      database: 'ApsaraDB for relational databases and Table Store for NoSQL.',
      networking: 'Virtual Private Cloud with security groups and Server Load Balancer.'
    }
  };
  
  // Architecture patterns and compatibility
  const architecturePatterns = {
    microservices: {
      aws: 5,
      azure: 4,
      gcp: 5,
      oracle: 3,
      ibm: 4,
      alibaba: 3
    },
    serverless: {
      aws: 5,
      azure: 4,
      gcp: 4,
      oracle: 3,
      ibm: 3,
      alibaba: 2
    },
    eventDriven: {
      aws: 5,
      azure: 4,
      gcp: 4,
      oracle: 3,
      ibm: 4,
      alibaba: 3
    },
    containerized: {
      aws: 5,
      azure: 5,
      gcp: 5,
      oracle: 4,
      ibm: 4,
      alibaba: 4
    },
    hybrid: {
      aws: 4,
      azure: 5,
      gcp: 4,
      oracle: 4,
      ibm: 5,
      alibaba: 3
    }
  };
  
  // Prepare radar chart data
  const prepareRadarData = (category) => {
    return Object.keys(featureComparison[category][Object.keys(featureComparison[category])[0]].features).map(feature => {
      const data = { feature };
      Object.keys(featureComparison[category]).forEach(provider => {
        if (pricing[provider]) {
          data[provider] = featureComparison[category][provider].features[feature];
        }
      });
      return data;
    });
  };
  
  // Only show available categories based on workload
  const availableCategories = [];
  if ((workload.compute || []).length > 0) availableCategories.push('compute');
  if ((workload.managedServices || []).some(s => s.type === 'kubernetes')) availableCategories.push('containerOrchestration');
  if ((workload.serverless || []).length > 0) availableCategories.push('serverless');
  if ((workload.storage || []).length > 0) availableCategories.push('storage');
  if ((workload.database || []).length > 0) availableCategories.push('database');
  
  // Determine which feature comparison to show
  const selectedCategory = availableCategories.includes('containerOrchestration') 
    ? 'containerOrchestration' 
    : availableCategories.includes('serverless')
      ? 'serverless'
      : null;
  
  const radarData = selectedCategory ? prepareRadarData(selectedCategory) : [];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Technical Architecture Analysis</h2>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">Select a tab</label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            onChange={(e) => setActiveTab(e.target.value)}
            value={activeTab}
          >
            <option value="services">Service Comparison</option>
            <option value="features">Feature Comparison</option>
            <option value="architectures">Architecture Patterns</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                className={`${
                  activeTab === 'services'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('services')}
              >
                Service Comparison
              </button>
              <button
                className={`${
                  activeTab === 'features'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('features')}
              >
                Feature Comparison
              </button>
              <button
                className={`${
                  activeTab === 'architectures'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('architectures')}
              >
                Architecture Patterns
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Services Comparison Tab */}
      {activeTab === 'services' && (
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Equivalent Services Across Providers</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Category
                  </th>
                  {Object.keys(pricing).map(provider => (
                    <th key={provider} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {providerNames[provider]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(serviceMapping).map(([category, providers]) => (
                  <tr key={category}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </td>
                    {Object.keys(pricing).map(provider => (
                      <td key={provider} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {providers[provider]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8">
            <h3 className="font-medium text-gray-900 mb-4">Implementation Details by Provider</h3>
            
            <div className="space-y-4">
              {Object.keys(pricing).map(provider => (
                <div key={provider} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: providerColors[provider] }}></div>
                    <h4 className="font-medium text-gray-800">{providerNames[provider]}</h4>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    {Object.entries(serviceImplementation[provider]).map(([service, description]) => (
                      <div key={service} className="flex">
                        <div className="w-24 font-medium capitalize text-gray-700">{service}:</div>
                        <div>{description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Feature Comparison Tab */}
      {activeTab === 'features' && (
        <div>
          {selectedCategory ? (
            <>
              <div className="mb-4">
                <h3 className="font-medium text-gray-900">
                  Feature Comparison: {selectedCategory.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Radar chart showing feature comparison across providers
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg" style={{ height: "350px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="feature" tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} />
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
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(pricing).map(provider => (
                  featureComparison[selectedCategory][provider] && (
                    <div key={provider} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium mb-3" style={{ color: providerColors[provider] }}>
                        {providerNames[provider]} {serviceMapping[selectedCategory][provider]}
                      </h4>
                      
                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-700">Strengths</div>
                        <ul className="mt-1 space-y-1">
                          {featureComparison[selectedCategory][provider].pros.map((pro, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700">Limitations</div>
                        <ul className="mt-1 space-y-1">
                          {featureComparison[selectedCategory][provider].cons.map((con, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <svg className="w-3.5 h-3.5 text-red-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">No detailed services selected</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      To see detailed feature comparisons, please include container orchestration or serverless resources in your workload.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Architecture Patterns Tab */}
      {activeTab === 'architectures' && (
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Architecture Pattern Compatibility</h3>
          <p className="text-sm text-gray-500 mb-6">
            How well each cloud provider supports various application architecture patterns.
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Architecture Pattern
                  </th>
                  {Object.keys(pricing).map(provider => (
                    <th key={provider} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {providerNames[provider]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(architecturePatterns).map(([pattern, ratings]) => (
                  <tr key={pattern}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                      {pattern.replace(/([A-Z])/g, ' $1').trim()}
                    </td>
                    {Object.keys(pricing).map(provider => (
                      <td key={provider} className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(star => (
                              <svg 
                                key={star} 
                                className={`h-5 w-5 ${star <= ratings[provider] ? 'text-yellow-400' : 'text-gray-300'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20" 
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Architecture Diagrams */}
          <div className="mt-8">
            <h3 className="font-medium text-gray-900 mb-4">Sample Architecture Patterns</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Microservices Architecture</h4>
                <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-auto h-48">
                  # Microservices Architecture Example
                  
                  ApiGateway:
                    Expose REST APIs for clients
                    Route to appropriate microservices
                  
                  Services:
                    UserService:
                      Container: Node.js
                      Database: MongoDB
                    
                    OrderService:
                      Container: Java Spring Boot
                      Database: PostgreSQL
                    
                    PaymentService:
                      Container: .NET Core
                      Database: SQL Server
                  
                  Communication:
                    Event Bus for async messaging
                    Service-to-service REST for sync
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Serverless Architecture</h4>
                <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-auto h-48">
                  # Serverless Architecture Example
                  
                  Frontend:
                    Static assets in blob storage
                    CDN for delivery
                  
                  API Layer:
                    Functions exposed via API Gateway
                    JWT authentication
                  
                  Backend:
                    Functions for business logic:
                      - CreateOrder (Node.js)
                      - ProcessPayment (Python)
                      - NotifyUser (Node.js)
                  
                  Data:
                    NoSQL Database for persistence
                    Event streams for workflow processing
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalArchitectureDashboard;