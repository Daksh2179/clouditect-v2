// Fallback providers data in case API calls fail
const fallbackProviders = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    description: 'Amazon Web Services (AWS) is a comprehensive cloud computing platform provided by Amazon.'
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    description: 'Microsoft Azure is a cloud computing service created by Microsoft for building, testing, deploying, and managing applications and services.'
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    description: 'Google Cloud Platform (GCP) is a suite of cloud computing services that runs on the same infrastructure that Google uses internally.'
  },
// START MODIFICATION
  {
    id: 'ibm',
    name: 'IBM Cloud',
    description: 'IBM Cloud offers a wide range of services including compute, storage, networking, database, and AI, with particular strengths in hybrid cloud solutions and enterprise integration.'
  },
  {
    id: 'oracle',
    name: 'Oracle Cloud',
    description: 'Oracle Cloud provides a comprehensive suite of cloud applications, platform services, and engineered systems with a focus on database and enterprise applications.'
  },
  {
    id: 'alibaba',
    name: 'Alibaba Cloud',
    description: 'Alibaba Cloud, also known as Aliyun, offers a suite of cloud computing services globally, with particular strength in Asia Pacific regions and e-commerce solutions.'
  },
  {
    id: 'digitalocean',
    name: 'DigitalOcean',
    description: 'DigitalOcean is a cloud computing platform that provides an easy-to-use interface for developers to deploy and scale applications.'
  }
];
// END MODIFICATION

export default fallbackProviders;