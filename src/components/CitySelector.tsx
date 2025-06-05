import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CitySelectorProps, City } from '../types';
import { FaSearch, FaSpinner } from 'react-icons/fa';

interface CitySearchResult extends City {
  id: string;
  region: string;
  lat: number;
  lon: number;
  displayName: string;
}

function CitySelector({ onCitySelect }: CitySelectorProps): React.ReactElement {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<CitySearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // API key for WeatherAPI.com
  const API_KEY = import.meta.env.VITE_API_KEY;
  
  // Fetch city suggestions when query changes
  useEffect(() => {
    // Clear suggestions if query is empty
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    
    // Set a timeout to avoid making API calls on every keystroke
    const timeoutId = setTimeout(() => {
      fetchCitySuggestions(query);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [query]);
  
  // Function to fetch city suggestions from WeatherAPI.com
  const fetchCitySuggestions = async (searchQuery: string): Promise<void> => {
    if (searchQuery.length < 3) return; // Don't search for very short queries
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('https://api.weatherapi.com/v1/search.json', {
        params: {
          key: API_KEY,
          q: searchQuery
        }
      });
      
      // Format the suggestions
      const formattedSuggestions: CitySearchResult[] = response.data.map((item: any) => ({
        id: `${item.id}`,
        name: item.name,
        city: item.name,
        region: item.region,
        country: item.country,
        lat: item.lat,
        lon: item.lon,
        displayName: `${item.name}, ${item.region}, ${item.country}`
      }));
      
      setSuggestions(formattedSuggestions);
    } catch (err) {
      console.error('Error fetching city suggestions:', err);
      setError('Failed to fetch suggestions. Please try again.');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle selection of a city
  const handleCitySelect = (suggestion: CitySearchResult): void => {
    onCitySelect({
      city: suggestion.city,
      country: suggestion.country,
      name: suggestion.name
    });
    setQuery(''); // Clear the input after selection
    setSuggestions([]); // Clear suggestions
  };
  
  return (
    <div className="w-full" role="search" aria-label="Search for a city">
      <div className="relative">
        <label htmlFor="city-search" className="sr-only">Search for a city</label>
        <input
          id="city-search"
          type="search"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-10 bg-white/20 text-white placeholder-white/70 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
          aria-autocomplete="list"
          aria-controls={suggestions.length > 0 ? "city-suggestions" : undefined}
          aria-expanded={suggestions.length > 0}
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" aria-hidden="true">
          <FaSearch />
        </span>
        {isLoading && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 animate-spin" aria-hidden="true">
            <FaSpinner />
          </span>
        )}
      </div>
      
      {error && (
        <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm" role="alert">
          {error}
        </div>
      )}
      
      {suggestions.length > 0 && (
        <ul 
          id="city-suggestions"
          className="mt-1 max-h-60 overflow-auto bg-blue-500/30 backdrop-blur-sm border border-white/20 rounded-md shadow-lg z-10"
          role="listbox"
          aria-label="City suggestions"
        >
          {suggestions.map((suggestion) => (
            <li 
              key={suggestion.id}
              onClick={() => handleCitySelect(suggestion)}
              className="px-4 py-2 text-white hover:bg-blue-600/50 cursor-pointer transition-colors"
              role="option"
              aria-selected="false"
            >
              {suggestion.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CitySelector;
