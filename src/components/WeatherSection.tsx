import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { WeatherSectionProps, WeatherCard as WeatherCardType, WeatherDataState, City } from '../types';
import WeatherCard from './WeatherCard';
import CitySelector from './CitySelector';
import { BackgroundLines } from '../components/ui/background-lines';
import { FaPlus, FaSearch, FaMapMarkerAlt, FaSync, FaChevronDown, FaChevronUp, FaBell, FaTimes } from 'react-icons/fa';

const API_KEY = import.meta.env.VITE_API_KEY;

function WeatherSection({ isExtension }: WeatherSectionProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLocationSearch, setShowLocationSearch] = useState<boolean>(false);
  
  const [weatherCards, setWeatherCards] = useState<WeatherCardType[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherDataState>({});
  const [suggestedLocations, setSuggestedLocations] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  
  // Load weather cards from storage when component mounts
  useEffect(() => {
    const loadWeatherCards = async (): Promise<void> => {
      // Default cities to use if no saved cards exist
      const defaultCards = [
        { id: uuidv4(), city: 'New York', country: 'US' },
        { id: uuidv4(), city: 'London', country: 'UK' },
        { id: uuidv4(), city: 'Tokyo', country: 'JP' }
      ];
      
      if (isExtension) {
        // Use Chrome storage API
        chrome.storage.local.get(['weatherCards'], (result: { weatherCards?: WeatherCardType[] }) => {
          if (result.weatherCards && result.weatherCards.length > 0) {
            setWeatherCards(result.weatherCards);
          } else {
            // Use default cards if no saved cards exist
            setWeatherCards(defaultCards);
            // Save default cards to storage
            chrome.storage.local.set({ weatherCards: defaultCards });
          }
        });
      } else {
        // Fallback to localStorage for development
        const savedCards = localStorage.getItem('weatherCards');
        if (savedCards) {
          const parsedCards = JSON.parse(savedCards);
          if (parsedCards.length > 0) {
            setWeatherCards(parsedCards);
          } else {
            // Use default cards if saved cards array is empty
            setWeatherCards(defaultCards);
            localStorage.setItem('weatherCards', JSON.stringify(defaultCards));
          }
        } else {
          // No saved cards at all, use defaults
          setWeatherCards(defaultCards);
          localStorage.setItem('weatherCards', JSON.stringify(defaultCards));
        }
      }
    };
    
    loadWeatherCards();
  }, [isExtension]);

  // Save weather cards whenever they change
  useEffect(() => {
    if (weatherCards.length > 0) {
      if (isExtension) {
        // Use Chrome storage API
        chrome.storage.local.set({ weatherCards });
      } else {
        // Fallback to localStorage for development
        localStorage.setItem('weatherCards', JSON.stringify(weatherCards));
      }
    }
  }, [weatherCards, isExtension]);
  
  // Load suggested locations from storage
  useEffect(() => {
    if (isExtension) {
      // Load suggested locations from Chrome storage
      chrome.runtime.sendMessage({ action: 'getSuggestedLocations' }, (response: { locations?: City[] }) => {
        if (response && response.locations) {
          setSuggestedLocations(response.locations);
        }
      });
    }
  }, [isExtension]);

  // Fetch weather data for all cards
  useEffect(() => {
    const fetchWeatherData = async (): Promise<void> => {
      for (const card of weatherCards) {
        try {
          if (isExtension) {
            // Use Chrome runtime messaging to communicate with background script
            chrome.runtime.sendMessage(
              { 
                action: 'fetchWeather', 
                city: card.city || card.name, 
                country: card.country 
              },
              (response: { success?: boolean; data?: any; error?: string }) => {
                if (response && response.success) {
                  // Update the weather data for this card
                  setWeatherData(prevData => ({
                    ...prevData,
                    [card.id]: response.data
                  }));
                } else {
                  console.error(`Error fetching weather for ${card.city || card.name}:`, response?.error || 'Unknown error');
                  // Create an empty WeatherData object with error flag
                  setWeatherData(prevData => ({
                    ...prevData,
                    [card.id]: undefined
                  }));
                }
              }
            );
          } else {
            // For development, use direct API call
            const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${card.city || card.name}`);
            console.log(response.data);
            
            if (response.data && response.data.current) {
              const current = response.data.current;
              setWeatherData(prevData => ({
                ...prevData,
                [card.id]: {
                  temp: current.temp_c,
                  condition: current.condition.text,
                  humidity: current.humidity,
                  windSpeed: current.wind_kph,
                  feelsLike: current.feelslike_c,
                  pressure: current.pressure_mb,
                  timestamp: Date.now(),
                  localTime: response.data.location?.localtime || '',
                  timezone: response.data.location?.tz_id || ''
                }
              }));
            }
          }
        } catch (error) {
          console.error(`Error fetching weather for ${card.city || card.name}:`, error);
          setWeatherData(prevData => ({
            ...prevData,
            [card.id]: { error: true } as any
          }));
        }
      }
    };
    
    fetchWeatherData();
    
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [weatherCards, isExtension]);

  // Add a suggested location to weather cards
  const addSuggestedLocation = (location: City): void => {
    const newCard = {
      id: uuidv4(),
      city: location.city || location.name,
      name: location.name,
      country: location.country,
      lat: location.lat,
      lon: location.lon
    };
    
    // Check if card already exists
    const exists = weatherCards.some(card => 
      (card.city && location.city && card.city.toLowerCase() === location.city.toLowerCase()) || 
      (card.name && location.name && card.name.toLowerCase() === location.name.toLowerCase())
    );
    
    if (!exists) {
      setWeatherCards([...weatherCards, newCard]);
    }
  };

  // Delete a weather card
  const deleteWeatherCard = (id: string): void => {
    setWeatherCards(weatherCards.filter(card => card.id !== id));
  };

  // Handle city selection from CitySelector
  const handleCitySelect = (selectedCity: City): void => {
    const newCard = {
      id: uuidv4(),
      city: selectedCity.city || selectedCity.name,
      name: selectedCity.name,
      country: selectedCity.country,
      lat: selectedCity.lat,
      lon: selectedCity.lon
    };
    setWeatherCards([...weatherCards, newCard]);
  };

  // Handle Google search
  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
      setSearchQuery('');
    }
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* No background bubbles */}
      
      {/* Search Bar with Controls */}
      <div className="mb-4 relative z-30">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex flex-col gap-4">
            {/* Top row with button and search */}
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <div className="flex gap-2">
                <button 
                  type="button"
                  className={`${showLocationSearch ? 'px-2 py-2 bg-blue-600/50' : 'px-3 py-2'} rounded-full bg-blue-500 hover:bg-blue-500/50 transition-all duration-300 text-white flex-shrink-0 flex items-center gap-2`}
                  onClick={() => setShowLocationSearch(!showLocationSearch)}
                  title="Add location"
                >
                  {showLocationSearch ? (
                    <FaTimes size={16} />
                  ) : (
                    <>
                      <FaMapMarkerAlt size={16} />
                      <span className="text-sm font-medium">Add Location</span>
                    </>
                  )}
                </button>
                
                {isExtension && (
                  <button 
                    type="button"
                    className="p-2 rounded-full bg-blue-500/30 hover:bg-blue-500/50 transition-colors text-white flex-shrink-0"
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    title="Show suggested locations"
                  >
                    <FaBell size={16} />
                  </button>
                )}
              </div>
              
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search Google or type a URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-10 bg-white/20 text-white placeholder-white/70 rounded-full outline-none focus:ring-2 focus:ring-white/30 transition-all"
                  aria-label="Search for a city"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500/50 p-2 rounded-full hover:bg-blue-500/70 transition-all text-white"
                  aria-label="Search"
                >
                  <FaSearch size={14} />
                </button>
              </div>
            </form>
            
            {/* Location Selector (appears in the same container) */}
            <div className={`overflow-hidden transition-all duration-300 ${showLocationSearch ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-4 animate-fadeInScale">
                <CitySelector onCitySelect={(city) => {
                  handleCitySelect(city);
                  setShowLocationSearch(false);
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Suggested Locations Panel */}
      {isExtension && showSuggestions && suggestedLocations.length > 0 && (
        <div className="p-4 mb-4 rounded-lg bg-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-2">Suggested Locations</h3>
          <p className="text-sm text-white/70 mb-3">These locations were detected from web pages you visited</p>
          <div className="flex flex-wrap gap-2">
            {suggestedLocations.map((location, index) => (
              <button
                key={index}
                onClick={() => addSuggestedLocation(location)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors"
              >
                {location.city || location.name}, {location.country}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* No floating Add Location button needed anymore */}
      
      {/* Weather Cards */}
      <div className="mt-6 flex-grow relative bg-white/5 rounded-xl p-4">
        <div className="absolute inset-0 z-0 rounded-xl overflow-hidden">
          <BackgroundLines className="h-full w-full" svgOptions={{ duration: 8 }}>
            <div></div>
          </BackgroundLines>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 relative z-10">
          {weatherCards.map((card, index) => (
            <div 
              key={card.id}
              className="flex justify-center"
              style={{ animation: `fadeInScale 0.5s ease-out ${index * 0.1}s both` }}
            >
              <WeatherCard 
                card={card} 
                weatherData={weatherData[card.id]} 
                onDelete={deleteWeatherCard} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeatherSection;
