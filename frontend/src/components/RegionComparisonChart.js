import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import apiService from '../services/api';

const RegionComparisonChart = ({ provider, workload }) => {
  const [regionData, setRegionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [availableRegions, setAvailableRegions] = useState([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await apiService.getRegions(provider);
        // Limit to 5 popular regions per continent for performance
        const regions = response.data;
        
        // Group by continent
        const continentMap = {};
        regions.forEach(region => {
          if (!continentMap[region.continent]) {
            continentMap[region.continent] = [];
          }
          continentMap[region.continent].push(region);
        });
        
        // Select popular regions from each continent
        const popularRegions = [];
        for (const continent in continentMap) {
          // Take first 2 regions from each continent
          popularRegions.push(...continentMap[continent].slice(0, 2));
        }
        
        setAvailableRegions(regions);
        setSelectedRegions(popularRegions.slice(0, 5).map(r => r.id));
      } catch (err) {
        setError('Error loading regions');
      }
    };

    fetchRegions();
  }, [provider]);

  useEffect(() => {
    const fetchRegionPricing = async () => {
      if (selectedRegions.length === 0 || !workload) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const results = [];
        
        for (const region of selectedRegions) {
          // Create a modified workload with this region
          const modifiedWorkload = {
            ...workload,
            region: {
              ...workload.region,
              [provider]: region
            }
          };
          
          // Get pricing for this region
          const response = await apiService.calculatePricing(modifiedWorkload);
          
          // Find the region name
          const regionInfo = availableRegions.find(r => r.id === region);
          const regionName = regionInfo ? regionInfo.name : region;
          
          results.push({
            region: region,
            regionName: regionName,
            totalCost: response.data[provider].total,
            compute: response.data[provider].compute,
            storage: response.data[provider].storage,
            database: response.data[provider].database
          });
        }
        
        // Sort by total cost
        results.sort((a, b) => a.totalCost - b.totalCost);
        setRegionData(results);
      } catch (err) {
        setError('Error calculating region pricing');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegionPricing();
  }, [selectedRegions, workload, provider, availableRegions]);

  const handleRegionChange = (event) => {
    const value = event.target.value;
    
    if (selectedRegions.includes(value)) {
      setSelectedRegions(selectedRegions.filter(r => r !== value));
    } else {
      if (selectedRegions.length < 5) {
        setSelectedRegions([...selectedRegions, value]);
      }
    }
  };

  if (loading) return <div className="text-center py-3">Loading region comparison...</div>;
  if (error) return <div className="text-red-500 py-3">{error}</div>;
  if (regionData.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm font-medium text-gray-700">Compare regions:</span>
        <select
          className="text-sm border border-gray-300 rounded px-2 py-1"
          value=""
          onChange={handleRegionChange}
        >
          <option value="" disabled>Add region...</option>
          {availableRegions.map(region => (
            <option 
              key={region.id} 
              value={region.id} 
              disabled={selectedRegions.includes(region.id)}
            >
              {region.name} ({region.location})
            </option>
          ))}
        </select>
        
        <div className="flex flex-wrap gap-1 ml-2">
          {selectedRegions.map(region => {
            const regionInfo = availableRegions.find(r => r.id === region);
            return (
              <span 
                key={region} 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {regionInfo?.name || region}
                <button 
                  type="button"
                  className="ml-1 text-blue-500 hover:text-blue-700"
                  onClick={() => setSelectedRegions(selectedRegions.filter(r => r !== region))}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={regionData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="regionName" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="compute" stackId="a" name="Compute" fill="#3b82f6" />
            <Bar dataKey="storage" stackId="a" name="Storage" fill="#10b981" />
            <Bar dataKey="database" stackId="a" name="Database" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-2">Region Price Comparison</h4>
        <p className="text-sm text-blue-700">
          {regionData[0]?.regionName} is the most cost-effective region, while {regionData[regionData.length-1]?.regionName} is the most expensive.
          The price difference is ${(regionData[regionData.length-1]?.totalCost - regionData[0]?.totalCost).toFixed(2)}/month ({
            Math.round(((regionData[regionData.length-1]?.totalCost - regionData[0]?.totalCost) / regionData[0]?.totalCost) * 100)
          }%).
        </p>
      </div>
    </div>
  );
};

export default RegionComparisonChart;