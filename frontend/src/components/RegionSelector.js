import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import fallbackRegions from '../data/fallbackRegions';

const RegionSelector = ({ provider, selectedRegion, onChange }) => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [continentFilter, setContinentFilter] = useState('All');

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        const response = await apiService.getRegions(provider);
        setRegions(response.data);
        setFilteredRegions(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching regions:", err);
        // Use fallback regions if API call fails
        setRegions(fallbackRegions[provider] || []);
        setFilteredRegions(fallbackRegions[provider] || []);
        setError('Using default regions due to connection issue');
        setLoading(false);
      }
    };

    fetchRegions();
  }, [provider]);

  useEffect(() => {
    if (regions.length > 0) {
      if (continentFilter === 'All') {
        setFilteredRegions(regions);
      } else {
        setFilteredRegions(regions.filter(region => region.continent === continentFilter));
      }
    }
  }, [continentFilter, regions]);

  // Get unique continents
  const continents = ['All', ...new Set(regions.map(region => region.continent))].filter(Boolean);

  if (loading) return <div className="text-center py-3">Loading regions...</div>;
  
  // Error state still shows regions if we have fallback data
  if (error && regions.length === 0) return <div className="text-red-500 py-3">{error}</div>;

  return (
    <div className="space-y-3">
      {continents.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {continents.map(continent => (
            <button
              key={continent}
              className={`px-3 py-1 text-xs rounded-full ${
                continent === continentFilter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setContinentFilter(continent)}
            >
              {continent}
            </button>
          ))}
        </div>
      )}

      <select
        className="input-field"
        value={selectedRegion}
        onChange={(e) => onChange(e.target.value)}
      >
        {filteredRegions.map(region => (
          <option key={region.id} value={region.id}>
            {region.name} ({region.location || region.id})
          </option>
        ))}
      </select>
      
      {error && (
        <div className="text-xs text-orange-600">
          {error}
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        Select a region to calculate pricing based on that location's rates
      </div>
    </div>
  );
};

export default RegionSelector;