/**
 * Comprehensive list of regions for each cloud provider
 */
const regions = {
  aws: [
    // North America
    { id: 'us-east-1', name: 'US East (N. Virginia)', location: 'Virginia, USA', continent: 'North America' },
    { id: 'us-east-2', name: 'US East (Ohio)', location: 'Ohio, USA', continent: 'North America' },
    { id: 'us-west-1', name: 'US West (N. California)', location: 'California, USA', continent: 'North America' },
    { id: 'us-west-2', name: 'US West (Oregon)', location: 'Oregon, USA', continent: 'North America' },
    { id: 'ca-central-1', name: 'Canada (Central)', location: 'Montreal, Canada', continent: 'North America' },
    
    // South America
    { id: 'sa-east-1', name: 'South America (São Paulo)', location: 'São Paulo, Brazil', continent: 'South America' },
    
    // Europe
    { id: 'eu-north-1', name: 'Europe (Stockholm)', location: 'Stockholm, Sweden', continent: 'Europe' },
    { id: 'eu-west-1', name: 'Europe (Ireland)', location: 'Dublin, Ireland', continent: 'Europe' },
    { id: 'eu-west-2', name: 'Europe (London)', location: 'London, UK', continent: 'Europe' },
    { id: 'eu-west-3', name: 'Europe (Paris)', location: 'Paris, France', continent: 'Europe' },
    { id: 'eu-central-1', name: 'Europe (Frankfurt)', location: 'Frankfurt, Germany', continent: 'Europe' },
    { id: 'eu-south-1', name: 'Europe (Milan)', location: 'Milan, Italy', continent: 'Europe' },
    
    // Asia Pacific
    { id: 'ap-east-1', name: 'Asia Pacific (Hong Kong)', location: 'Hong Kong', continent: 'Asia' },
    { id: 'ap-south-1', name: 'Asia Pacific (Mumbai)', location: 'Mumbai, India', continent: 'Asia' },
    { id: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)', location: 'Tokyo, Japan', continent: 'Asia' },
    { id: 'ap-northeast-2', name: 'Asia Pacific (Seoul)', location: 'Seoul, South Korea', continent: 'Asia' },
    { id: 'ap-northeast-3', name: 'Asia Pacific (Osaka)', location: 'Osaka, Japan', continent: 'Asia' },
    { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', location: 'Singapore', continent: 'Asia' },
    { id: 'ap-southeast-2', name: 'Asia Pacific (Sydney)', location: 'Sydney, Australia', continent: 'Oceania' },
    
    // Middle East
    { id: 'me-south-1', name: 'Middle East (Bahrain)', location: 'Bahrain', continent: 'Asia' },
    
    // Africa
    { id: 'af-south-1', name: 'Africa (Cape Town)', location: 'Cape Town, South Africa', continent: 'Africa' }
  ],
  
  azure: [
    // North America
    { id: 'eastus', name: 'East US', location: 'Virginia, USA', continent: 'North America' },
    { id: 'eastus2', name: 'East US 2', location: 'Virginia, USA', continent: 'North America' },
    { id: 'southcentralus', name: 'South Central US', location: 'Texas, USA', continent: 'North America' },
    { id: 'westus', name: 'West US', location: 'California, USA', continent: 'North America' },
    { id: 'westus2', name: 'West US 2', location: 'Washington, USA', continent: 'North America' },
    { id: 'westus3', name: 'West US 3', location: 'Arizona, USA', continent: 'North America' },
    { id: 'canadacentral', name: 'Canada Central', location: 'Toronto, Canada', continent: 'North America' },
    { id: 'canadaeast', name: 'Canada East', location: 'Quebec, Canada', continent: 'North America' },
    
    // South America
    { id: 'brazilsouth', name: 'Brazil South', location: 'São Paulo, Brazil', continent: 'South America' },
    { id: 'brazilsoutheast', name: 'Brazil Southeast', location: 'Rio de Janeiro, Brazil', continent: 'South America' },
    
    // Europe
    { id: 'northeurope', name: 'North Europe', location: 'Dublin, Ireland', continent: 'Europe' },
    { id: 'westeurope', name: 'West Europe', location: 'Amsterdam, Netherlands', continent: 'Europe' },
    { id: 'uksouth', name: 'UK South', location: 'London, UK', continent: 'Europe' },
    { id: 'ukwest', name: 'UK West', location: 'Cardiff, UK', continent: 'Europe' },
    { id: 'francecentral', name: 'France Central', location: 'Paris, France', continent: 'Europe' },
    { id: 'germanywestcentral', name: 'Germany West Central', location: 'Frankfurt, Germany', continent: 'Europe' },
    { id: 'norwayeast', name: 'Norway East', location: 'Oslo, Norway', continent: 'Europe' },
    { id: 'switzerlandnorth', name: 'Switzerland North', location: 'Zurich, Switzerland', continent: 'Europe' },
    
    // Asia Pacific
    { id: 'eastasia', name: 'East Asia', location: 'Hong Kong', continent: 'Asia' },
    { id: 'southeastasia', name: 'Southeast Asia', location: 'Singapore', continent: 'Asia' },
    { id: 'australiaeast', name: 'Australia East', location: 'New South Wales, Australia', continent: 'Oceania' },
    { id: 'australiasoutheast', name: 'Australia Southeast', location: 'Victoria, Australia', continent: 'Oceania' },
    { id: 'japaneast', name: 'Japan East', location: 'Tokyo, Japan', continent: 'Asia' },
    { id: 'japanwest', name: 'Japan West', location: 'Osaka, Japan', continent: 'Asia' },
    { id: 'centralindia', name: 'Central India', location: 'Pune, India', continent: 'Asia' },
    { id: 'southindia', name: 'South India', location: 'Chennai, India', continent: 'Asia' },
    { id: 'koreacentral', name: 'Korea Central', location: 'Seoul, South Korea', continent: 'Asia' },
    
    // Middle East
    { id: 'uaenorth', name: 'UAE North', location: 'Dubai, UAE', continent: 'Asia' },
    
    // Africa
    { id: 'southafricanorth', name: 'South Africa North', location: 'Johannesburg, South Africa', continent: 'Africa' }
  ],
  
  gcp: [
    // North America
    { id: 'us-central1', name: 'Iowa (us-central1)', location: 'Council Bluffs, Iowa, USA', continent: 'North America' },
    { id: 'us-east1', name: 'South Carolina (us-east1)', location: 'Moncks Corner, South Carolina, USA', continent: 'North America' },
    { id: 'us-east4', name: 'Northern Virginia (us-east4)', location: 'Ashburn, Virginia, USA', continent: 'North America' },
    { id: 'us-west1', name: 'Oregon (us-west1)', location: 'The Dalles, Oregon, USA', continent: 'North America' },
    { id: 'us-west2', name: 'Los Angeles (us-west2)', location: 'Los Angeles, California, USA', continent: 'North America' },
    { id: 'us-west3', name: 'Salt Lake City (us-west3)', location: 'Salt Lake City, Utah, USA', continent: 'North America' },
    { id: 'us-west4', name: 'Las Vegas (us-west4)', location: 'Las Vegas, Nevada, USA', continent: 'North America' },
    { id: 'northamerica-northeast1', name: 'Montreal (northamerica-northeast1)', location: 'Montreal, Quebec, Canada', continent: 'North America' },
    { id: 'northamerica-northeast2', name: 'Toronto (northamerica-northeast2)', location: 'Toronto, Ontario, Canada', continent: 'North America' },
    
    // South America
    { id: 'southamerica-east1', name: 'São Paulo (southamerica-east1)', location: 'Osasco, São Paulo, Brazil', continent: 'South America' },
    { id: 'southamerica-west1', name: 'Santiago (southamerica-west1)', location: 'Santiago, Chile', continent: 'South America' },
    
    // Europe
    { id: 'europe-west1', name: 'Belgium (europe-west1)', location: 'St. Ghislain, Belgium', continent: 'Europe' },
    { id: 'europe-west2', name: 'London (europe-west2)', location: 'London, UK', continent: 'Europe' },
    { id: 'europe-west3', name: 'Frankfurt (europe-west3)', location: 'Frankfurt, Germany', continent: 'Europe' },
    { id: 'europe-west4', name: 'Netherlands (europe-west4)', location: 'Eemshaven, Netherlands', continent: 'Europe' },
    { id: 'europe-west6', name: 'Zurich (europe-west6)', location: 'Zurich, Switzerland', continent: 'Europe' },
    { id: 'europe-central2', name: 'Warsaw (europe-central2)', location: 'Warsaw, Poland', continent: 'Europe' },
    { id: 'europe-north1', name: 'Finland (europe-north1)', location: 'Hamina, Finland', continent: 'Europe' },
    
    // Asia Pacific
    { id: 'asia-east1', name: 'Taiwan (asia-east1)', location: 'Changhua County, Taiwan', continent: 'Asia' },
    { id: 'asia-east2', name: 'Hong Kong (asia-east2)', location: 'Hong Kong', continent: 'Asia' },
    { id: 'asia-northeast1', name: 'Tokyo (asia-northeast1)', location: 'Tokyo, Japan', continent: 'Asia' },
    { id: 'asia-northeast2', name: 'Osaka (asia-northeast2)', location: 'Osaka, Japan', continent: 'Asia' },
    { id: 'asia-northeast3', name: 'Seoul (asia-northeast3)', location: 'Seoul, South Korea', continent: 'Asia' },
    { id: 'asia-south1', name: 'Mumbai (asia-south1)', location: 'Mumbai, India', continent: 'Asia' },
    { id: 'asia-southeast1', name: 'Singapore (asia-southeast1)', location: 'Jurong West, Singapore', continent: 'Asia' },
    { id: 'asia-southeast2', name: 'Jakarta (asia-southeast2)', location: 'Jakarta, Indonesia', continent: 'Asia' },
    { id: 'australia-southeast1', name: 'Sydney (australia-southeast1)', location: 'Sydney, Australia', continent: 'Oceania' },
    
    // Middle East
    { id: 'me-west1', name: 'Tel Aviv (me-west1)', location: 'Tel Aviv, Israel', continent: 'Asia' }
  ],
  // Add new IBM Cloud regions
  ibm: [
    // North America
    { id: 'us-south', name: 'Dallas', location: 'Dallas, Texas, USA', continent: 'North America' },
    { id: 'us-east', name: 'Washington DC', location: 'Washington DC, USA', continent: 'North America' },
    { id: 'ca-tor', name: 'Toronto', location: 'Toronto, Canada', continent: 'North America' },
    
    // Europe
    { id: 'eu-gb', name: 'London', location: 'London, UK', continent: 'Europe' },
    { id: 'eu-de', name: 'Frankfurt', location: 'Frankfurt, Germany', continent: 'Europe' },
    
    // Asia Pacific
    { id: 'jp-tok', name: 'Tokyo', location: 'Tokyo, Japan', continent: 'Asia' },
    { id: 'au-syd', name: 'Sydney', location: 'Sydney, Australia', continent: 'Oceania' }
  ],
  
  // Add new Oracle Cloud regions
  oracle: [
    // North America
    { id: 'us-ashburn-1', name: 'US East (Ashburn)', location: 'Ashburn, Virginia, USA', continent: 'North America' },
    { id: 'us-phoenix-1', name: 'US West (Phoenix)', location: 'Phoenix, Arizona, USA', continent: 'North America' },
    { id: 'ca-toronto-1', name: 'Canada Southeast (Toronto)', location: 'Toronto, Canada', continent: 'North America' },
    
    // Europe
    { id: 'uk-london-1', name: 'UK South (London)', location: 'London, UK', continent: 'Europe' },
    { id: 'eu-frankfurt-1', name: 'Germany Central (Frankfurt)', location: 'Frankfurt, Germany', continent: 'Europe' },
    
    // Asia Pacific
    { id: 'ap-tokyo-1', name: 'Japan East (Tokyo)', location: 'Tokyo, Japan', continent: 'Asia' },
    { id: 'ap-mumbai-1', name: 'India West (Mumbai)', location: 'Mumbai, India', continent: 'Asia' },
    { id: 'ap-sydney-1', name: 'Australia East (Sydney)', location: 'Sydney, Australia', continent: 'Oceania' }
  ],
  
  // Add new Alibaba Cloud regions
  alibaba: [
    // North America
    { id: 'us-west-1', name: 'Silicon Valley', location: 'Silicon Valley, California, USA', continent: 'North America' },
    { id: 'us-east-1', name: 'Virginia', location: 'Virginia, USA', continent: 'North America' },
    
    // Europe
    { id: 'eu-central-1', name: 'Frankfurt', location: 'Frankfurt, Germany', continent: 'Europe' },
    { id: 'eu-west-1', name: 'London', location: 'London, UK', continent: 'Europe' },
    
    // Asia Pacific
    { id: 'cn-hangzhou', name: 'Hangzhou', location: 'Hangzhou, China', continent: 'Asia' },
    { id: 'cn-beijing', name: 'Beijing', location: 'Beijing, China', continent: 'Asia' },
    { id: 'cn-shanghai', name: 'Shanghai', location: 'Shanghai, China', continent: 'Asia' },
    { id: 'ap-southeast-1', name: 'Singapore', location: 'Singapore', continent: 'Asia' },
    { id: 'ap-southeast-5', name: 'Jakarta', location: 'Jakarta, Indonesia', continent: 'Asia' },
    { id: 'ap-northeast-1', name: 'Tokyo', location: 'Tokyo, Japan', continent: 'Asia' },
    { id: 'ap-south-1', name: 'Mumbai', location: 'Mumbai, India', continent: 'Asia' }
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

module.exports = regions;