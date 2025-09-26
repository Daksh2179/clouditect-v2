// Fallback regions in case API calls fail
const fallbackRegions = {
  aws: [
    { id: 'us-east-1', name: 'US East (N. Virginia)', location: 'Virginia, USA', continent: 'North America' },
    { id: 'us-west-2', name: 'US West (Oregon)', location: 'Oregon, USA', continent: 'North America' },
    { id: 'eu-west-1', name: 'Europe (Ireland)', location: 'Dublin, Ireland', continent: 'Europe' },
    { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', location: 'Singapore', continent: 'Asia' },
    { id: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)', location: 'Tokyo, Japan', continent: 'Asia' }
  ],
  azure: [
    { id: 'eastus', name: 'East US', location: 'Virginia, USA', continent: 'North America' },
    { id: 'westus2', name: 'West US 2', location: 'Washington, USA', continent: 'North America' },
    { id: 'westeurope', name: 'West Europe', location: 'Netherlands', continent: 'Europe' },
    { id: 'southeastasia', name: 'Southeast Asia', location: 'Singapore', continent: 'Asia' },
    { id: 'japaneast', name: 'Japan East', location: 'Tokyo, Japan', continent: 'Asia' }
  ],
  gcp: [
    { id: 'us-central1', name: 'Iowa (us-central1)', location: 'Iowa, USA', continent: 'North America' },
    { id: 'us-west1', name: 'Oregon (us-west1)', location: 'Oregon, USA', continent: 'North America' },
    { id: 'europe-west1', name: 'Belgium (europe-west1)', location: 'Belgium', continent: 'Europe' },
    { id: 'asia-southeast1', name: 'Singapore (asia-southeast1)', location: 'Singapore', continent: 'Asia' },
    { id: 'asia-northeast1', name: 'Tokyo (asia-northeast1)', location: 'Tokyo, Japan', continent: 'Asia' }
  ],
  ibm: [
    { id: 'us-south', name: 'Dallas', location: 'Dallas, Texas, USA', continent: 'North America' },
    { id: 'us-east', name: 'Washington DC', location: 'Washington DC, USA', continent: 'North America' },
    { id: 'eu-gb', name: 'London', location: 'London, UK', continent: 'Europe' },
    { id: 'eu-de', name: 'Frankfurt', location: 'Frankfurt, Germany', continent: 'Europe' },
    { id: 'jp-tok', name: 'Tokyo', location: 'Tokyo, Japan', continent: 'Asia' }
  ],
  oracle: [
    { id: 'us-ashburn-1', name: 'US East (Ashburn)', location: 'Ashburn, Virginia, USA', continent: 'North America' },
    { id: 'us-phoenix-1', name: 'US West (Phoenix)', location: 'Phoenix, Arizona, USA', continent: 'North America' },
    { id: 'uk-london-1', name: 'UK South (London)', location: 'London, UK', continent: 'Europe' },
    { id: 'eu-frankfurt-1', name: 'Germany Central (Frankfurt)', location: 'Frankfurt, Germany', continent: 'Europe' },
    { id: 'ap-tokyo-1', name: 'Japan East (Tokyo)', location: 'Tokyo, Japan', continent: 'Asia' }
  ],
  alibaba: [
    { id: 'us-west-1', name: 'Silicon Valley', location: 'Silicon Valley, California, USA', continent: 'North America' },
    { id: 'eu-central-1', name: 'Frankfurt', location: 'Frankfurt, Germany', continent: 'Europe' },
    { id: 'cn-hangzhou', name: 'Hangzhou', location: 'Hangzhou, China', continent: 'Asia' },
    { id: 'ap-southeast-1', name: 'Singapore', location: 'Singapore', continent: 'Asia' },
    { id: 'ap-northeast-1', name: 'Tokyo', location: 'Tokyo, Japan', continent: 'Asia' }
  ],
  digitalocean: [
    { id: 'nyc1', name: 'New York 1', location: 'New York, USA', continent: 'North America' },
    { id: 'sfo3', name: 'San Francisco 3', location: 'San Francisco, USA', continent: 'North America' },
    { id: 'tor1', name: 'Toronto 1', location: 'Toronto, Canada', continent: 'North America' },
    { id: 'lon1', name: 'London 1', location: 'London, UK', continent: 'Europe' },
    { id: 'fra1', name: 'Frankfurt 1', location: 'Frankfurt, Germany', continent: 'Europe' },
    { id: 'ams3', name: 'Amsterdam 3', location: 'Amsterdam, Netherlands', continent: 'Europe' },
    { id: 'sgp1', name: 'Singapore 1', location: 'Singapore', continent: 'Asia' },
    { id: 'blr1', name: 'Bangalore 1', location: 'Bangalore, India', continent: 'Asia' }
  ]
};

export default fallbackRegions;