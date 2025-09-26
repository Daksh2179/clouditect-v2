import React, { useState } from 'react';

const SecurityComplianceImplementation = ({ pricing, workload }) => {
  const [activeTab, setActiveTab] = useState('security');
  
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
  
  // Security services
  const securityServices = {
    aws: {
      'Identity & Access': ['IAM', 'AWS Organizations', 'AWS SSO'],
      'Network Security': ['Security Groups', 'NACLs', 'WAF', 'Shield'],
      'Data Protection': ['KMS', 'CloudHSM', 'Certificate Manager'],
      'Threat Detection': ['GuardDuty', 'Inspector', 'Detective'],
      'Monitoring & Logging': ['CloudTrail', 'Config', 'Security Hub']
    },
    azure: {
      'Identity & Access': ['Azure AD', 'Azure RBAC', 'Managed Identities'],
      'Network Security': ['NSGs', 'Azure Firewall', 'Front Door'],
      'Data Protection': ['Key Vault', 'Azure Information Protection', 'SSL Certificates'],
      'Threat Detection': ['Azure Sentinel', 'Security Center', 'Advanced Threat Protection'],
      'Monitoring & Logging': ['Azure Monitor', 'Log Analytics', 'Activity Logs']
    },
    gcp: {
      'Identity & Access': ['IAM', 'Identity Platform', 'Resource Manager'],
      'Network Security': ['Cloud Armor', 'Cloud Firewall', 'Cloud NAT'],
      'Data Protection': ['Cloud KMS', 'Secret Manager', 'Certificate Authority Service'],
      'Threat Detection': ['Security Command Center', 'Event Threat Detection', 'Web Security Scanner'],
      'Monitoring & Logging': ['Cloud Audit Logs', 'Cloud Monitoring', 'Cloud Logging']
    },
    oracle: {
      'Identity & Access': ['Identity and Access Management', 'Federation'],
      'Network Security': ['Network Security Groups', 'DDoS Protection', 'Web Application Firewall'],
      'Data Protection': ['Vault', 'Data Safe'],
      'Threat Detection': ['Cloud Guard', 'Security Advisor'],
      'Monitoring & Logging': ['Logging', 'Monitoring', 'Audit']
    },
    ibm: {
      'Identity & Access': ['IAM', 'App ID', 'Access Groups'],
      'Network Security': ['Security Groups', 'VPC Flow Logs', 'SSL Certificates'],
      'Data Protection': ['Key Protect', 'Hyper Protect Crypto Services'],
      'Threat Detection': ['Security Advisor', 'Cloud Activity Tracker'],
      'Monitoring & Logging': ['Activity Tracker', 'Monitoring', 'Log Analysis']
    },
    alibaba: {
      'Identity & Access': ['RAM', 'SSO', 'Security Token Service'],
      'Network Security': ['Security Group', 'Anti-DDoS', 'WAF'],
      'Data Protection': ['KMS', 'SSL Certificates'],
      'Threat Detection': ['Threat Detection Service', 'Security Center'],
      'Monitoring & Logging': ['ActionTrail', 'CloudMonitor', 'Log Service']
    }
  };
  
  // Compliance implementation difficulty
  const complianceImplementation = {
    'GDPR': {
      aws: { difficulty: 'Medium', features: ['Controls for data residency', 'Privacy tools', 'Compliance documentation'] },
      azure: { difficulty: 'Medium', features: ['GDPR features dashboard', 'Data Subject Requests', 'Compliance documentation'] },
      gcp: { difficulty: 'Medium', features: ['Data residency controls', 'Data deletion capabilities', 'Compliance documentation'] },
      oracle: { difficulty: 'Medium-High', features: ['Regional data centers', 'Basic compliance tools', 'Documentation'] },
      ibm: { difficulty: 'Medium', features: ['Privacy tools', 'EU data centers', 'Compliance documentation'] },
      alibaba: { difficulty: 'High', features: ['Limited GDPR features', 'Regional isolation', 'Basic documentation'] }
    },
    'HIPAA': {
      aws: { difficulty: 'Medium', features: ['BAA available', 'Compliance guidance', 'Eligible services documentation'] },
      azure: { difficulty: 'Medium', features: ['BAA available', 'Blueprint templates', 'Compliance documentation'] },
      gcp: { difficulty: 'Medium', features: ['BAA available', 'Healthcare API', 'Compliance guides'] },
      oracle: { difficulty: 'Medium-High', features: ['BAA available', 'Limited healthcare tools', 'Basic documentation'] },
      ibm: { difficulty: 'Medium', features: ['BAA available', 'Healthcare tools', 'Compliance guides'] },
      alibaba: { difficulty: 'High', features: ['Limited HIPAA support', 'Few healthcare-specific tools'] }
    },
    'PCI DSS': {
      aws: { difficulty: 'Medium-Low', features: ['Compliance guidance', 'Reference architecture', 'Audit tools'] },
      azure: { difficulty: 'Medium-Low', features: ['Blueprint templates', 'Compliance tools', 'Documentation'] },
      gcp: { difficulty: 'Medium', features: ['Compliance guidance', 'Security services', 'Documentation'] },
      oracle: { difficulty: 'Medium', features: ['Compliance guidance', 'Basic tools', 'Documentation'] },
      ibm: { difficulty: 'Medium', features: ['Compliance guidance', 'Security services', 'Documentation'] },
      alibaba: { difficulty: 'Medium-High', features: ['Basic compliance guidance', 'Limited tools'] }
    }
  };
  
  // Security best practices
  const securityBestPractices = [
    {
      title: 'Use IAM roles/service accounts instead of static credentials',
      description: 'Avoid hardcoded credentials in your applications by using instance roles, managed identities, or service accounts',
      implementation: {
        aws: 'IAM Roles for EC2/ECS/Lambda',
        azure: 'Managed Identities for Azure resources',
        gcp: 'Service Accounts for GCE/GKE/Cloud Functions',
        oracle: 'Instance Principal authentication',
        ibm: 'IAM service IDs with API keys',
        alibaba: 'RAM roles for ECS instances'
      }
    },
    {
      title: 'Enable multi-factor authentication for all users',
      description: 'Protect user accounts with additional authentication factors beyond passwords',
      implementation: {
        aws: 'IAM MFA with virtual or hardware tokens',
        azure: 'Azure AD MFA, Conditional Access policies',
        gcp: 'Cloud Identity MFA, Security Key enforcement',
        oracle: 'OCI IAM MFA',
        ibm: 'IBM Cloud MFA',
        alibaba: 'RAM MFA'
      }
    },
    {
      title: 'Implement least privilege access',
      description: 'Grant only the permissions necessary for users and services to perform their functions',
      implementation: {
        aws: 'IAM policy conditions and permission boundaries',
        azure: 'Azure RBAC with custom roles',
        gcp: 'IAM with predefined and custom roles',
        oracle: 'OCI IAM policies and compartments',
        ibm: 'IAM access groups and custom roles',
        alibaba: 'RAM policies and resource groups'
      }
    },
    {
      title: 'Encrypt data at rest and in transit',
      description: 'Protect sensitive data with strong encryption',
      implementation: {
        aws: 'KMS for service integration, TLS for connections',
        azure: 'Key Vault, Storage Service Encryption, TLS',
        gcp: 'Cloud KMS, default encryption, TLS',
        oracle: 'OCI Vault, TLS connections',
        ibm: 'Key Protect, TLS connections',
        alibaba: 'KMS, TLS connections'
      }
    }
  ];
  
  // Sample security code snippets for different providers
  const securityCodeSnippets = {
    aws: `// AWS IAM policy for least privilege
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadOnly",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::example-bucket",
        "arn:aws:s3:::example-bucket/*"
      ]
    }
  ]
}`,
    azure: `// Azure RBAC role definition
{
  "Name": "Custom S3 Reader",
  "Description": "Can read S3 bucket items.",
  "Actions": [
    "Microsoft.Storage/storageAccounts/blobServices/containers/read",
    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read"
  ],
  "NotActions": [],
  "DataActions": [],
  "NotDataActions": [],
  "AssignableScopes": [
    "/subscriptions/{subscription-id}"
  ]
}`,
    gcp: `# GCP IAM policy binding with Terraform
resource "google_storage_bucket_iam_binding" "binding" {
  bucket = "example-bucket"
  role = "roles/storage.objectViewer"
  members = [
    "serviceAccount:my-service-account@my-project.iam.gserviceaccount.com",
  ]
}`
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Security & Compliance Implementation</h2>
      
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
            <option value="security">Security Services</option>
            <option value="compliance">Compliance Implementation</option>
            <option value="bestPractices">Security Best Practices</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                className={`${
                  activeTab === 'security'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('security')}
              >
                Security Services
              </button>
              <button
                className={`${
                  activeTab === 'compliance'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('compliance')}
              >
                Compliance Implementation
              </button>
              <button
                className={`${
                  activeTab === 'bestPractices'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('bestPractices')}
              >
                Security Best Practices
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Security Services Tab */}
      {activeTab === 'security' && (
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Cloud Security Services Comparison</h3>
          <p className="text-sm text-gray-600 mb-6">
            Compare security services offered by each cloud provider to implement your security controls.
          </p>
          
          <div className="space-y-6">
            {Object.entries(securityServices[Object.keys(securityServices)[0]]).map(([category, _]) => (
              <div key={category}>
                <h4 className="text-sm font-medium text-gray-700 mb-3">{category}</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provider
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Services
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.keys(pricing).map(provider => (
                        <tr key={provider}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: providerColors[provider] }}></div>
                              <div className="font-medium text-gray-900">{providerNames[provider]}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {securityServices[provider][category].map((service, idx) => (
                                <span key={idx} className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                  {service}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Security Implementation Example</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-medium text-sm mb-2">IAM Policy Example</div>
                <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
                  {securityCodeSnippets.aws}
                </pre>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-medium text-sm mb-2">Security Considerations</div>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Apply least privilege principle
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Use conditions for additional security
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Regularly audit access patterns
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Implement infrastructure as code for policies
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Compliance Implementation Tab */}
      {activeTab === 'compliance' && (
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Compliance Implementation Difficulty</h3>
          <p className="text-sm text-gray-600 mb-6">
            How challenging it is to implement different compliance frameworks on each cloud provider.
          </p>
          
          <div className="space-y-6">
            {Object.entries(complianceImplementation).map(([framework, providers]) => (
              <div key={framework}>
                <h4 className="text-sm font-medium text-gray-700 mb-3">{framework}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.keys(pricing).map(provider => (
                    <div key={provider} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: providerColors[provider] }}></div>
                          <div className="font-medium text-gray-900">{providerNames[provider]}</div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          providers[provider].difficulty.includes('Low') 
                            ? 'bg-green-100 text-green-800' 
                            : providers[provider].difficulty.includes('High')
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {providers[provider].difficulty}
                        </span>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {providers[provider].features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h4 className="font-medium text-purple-800 mb-2">Technical Implementation Tips</h4>
            <div className="space-y-2 text-sm text-purple-700">
              <p>
                <span className="font-medium">Infrastructure as Code:</span> Define compliance controls as code using tools like Terraform or CloudFormation to ensure consistency and auditability.
              </p>
              <p>
                <span className="font-medium">Continuous Compliance:</span> Implement automated compliance checks in your CI/CD pipeline to detect drift from compliant configurations.
              </p>
              <p>
                <span className="font-medium">Segmentation:</span> Use network segmentation and service boundaries (VPCs, resource groups) to isolate regulated workloads from non-regulated ones.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Best Practices Tab */}
      {activeTab === 'bestPractices' && (
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Security Best Practices</h3>
          <p className="text-sm text-gray-600 mb-6">
            Recommended security practices that apply across cloud providers.
          </p>
          
          <div className="space-y-6">
            {securityBestPractices.map((practice, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="font-medium text-gray-800">{practice.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{practice.description}</p>
                </div>
                
                <div className="p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Implementation by Provider</h5>
                  <div className="space-y-3">
                    {Object.keys(pricing).map(provider => (
                      <div key={provider} className="flex items-start">
                        <div className="flex-shrink-0 w-24">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: providerColors[provider] }}></div>
                            <div className="text-sm font-medium">{providerNames[provider]}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">{practice.implementation[provider]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2">Security Implementation Resources</h4>
            <div className="space-y-2 text-sm text-blue-700">
              <p>
                <span className="font-medium">AWS:</span> Well-Architected Framework Security Pillar, AWS Security Best Practices whitepaper
              </p>
              <p>
                <span className="font-medium">Azure:</span> Azure Security Benchmark, Microsoft Cloud Adoption Framework
              </p>
              <p>
                <span className="font-medium">GCP:</span> Google Cloud Security Best Practices, GCP Security Blueprint
              </p>
              <p>
                <span className="font-medium">Multi-cloud:</span> CSA Cloud Controls Matrix, NIST Cybersecurity Framework
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityComplianceImplementation;