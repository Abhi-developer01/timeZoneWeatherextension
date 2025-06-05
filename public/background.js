// Background script for the Weather Extension

// API key for WeatherAPI.com
const API_KEY = import.meta.env.VITE_API_KEY;

// Cache for weather data to reduce API calls
const weatherCache = {
  data: {},
  timestamp: {},
  // Cache expiration time in milliseconds (30 minutes)
  expirationTime: 30 * 60 * 1000
};

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Weather Extension installed');
  
  // Initialize default weather cards if not already set
  chrome.storage.local.get(['weatherCards'], (result) => {
    if (!result.weatherCards) {
      const defaultCards = [
        { id: crypto.randomUUID(), city: 'New York', country: 'US' },
        { id: crypto.randomUUID(), city: 'London', country: 'UK' },
        { id: crypto.randomUUID(), city: 'Tokyo', country: 'JP' }
      ];
      
      chrome.storage.local.set({ weatherCards: defaultCards });
    }
  });
  
  // Initialize suggested locations array if not already set
  chrome.storage.local.get(['suggestedLocations'], (result) => {
    if (!result.suggestedLocations) {
      chrome.storage.local.set({ suggestedLocations: [] });
    }
  });
});

// Listen for messages from the popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle weather data requests from popup
  if (request.action === 'fetchWeather') {
    fetchWeatherData(request.city, request.country)
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Indicates we'll respond asynchronously
  }
  
  // Handle detected locations from content script
  if (request.action === 'detectedLocations' && request.locations && request.locations.length > 0) {
    handleDetectedLocations(request.locations, sender.tab);
  }
  
  // Handle request for suggested locations
  if (request.action === 'getSuggestedLocations') {
    chrome.storage.local.get(['suggestedLocations'], (result) => {
      sendResponse({ locations: result.suggestedLocations || [] });
    });
    return true; // Indicates we'll respond asynchronously
  }
  
  // Handle adding a suggested location to weather cards
  if (request.action === 'addSuggestedLocation' && request.location) {
    addLocationToWeatherCards(request.location);
    sendResponse({ success: true });
  }
});

// Function to handle detected locations from content script
function handleDetectedLocations(locations, tab) {
  // Get current suggested locations
  chrome.storage.local.get(['suggestedLocations', 'weatherCards'], (result) => {
    const currentSuggestions = result.suggestedLocations || [];
    const weatherCards = result.weatherCards || [];
    
    // Filter out locations that are already in weather cards
    const existingCities = weatherCards.map(card => card.city.toLowerCase());
    
    // Add new locations to suggestions, avoiding duplicates
    let newLocationsAdded = false;
    
    locations.forEach(location => {
      // Clean up the location name
      const cleanLocation = location.trim();
      const locationLower = cleanLocation.toLowerCase();
      
      // Check if this location is already in weather cards or suggestions
      if (!existingCities.includes(locationLower) && 
          !currentSuggestions.some(item => item.city.toLowerCase() === locationLower)) {
        
        // Add to suggestions with a timestamp
        currentSuggestions.push({
          city: cleanLocation,
          country: 'US', // Default country code
          source: tab ? tab.url : 'unknown',
          timestamp: new Date().toISOString()
        });
        
        newLocationsAdded = true;
      }
    });
    
    // Keep only the 10 most recent suggestions
    const recentSuggestions = currentSuggestions
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
    
    // Save updated suggestions
    if (newLocationsAdded) {
      chrome.storage.local.set({ suggestedLocations: recentSuggestions });
      
      // Show notification about new locations
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Weather Extension',
        message: `Detected ${locations.length} location(s) on this page. Check the extension for weather details!`,
        priority: 1
      });
    }
  });
}

// Function to add a suggested location to weather cards
function addLocationToWeatherCards(location) {
  chrome.storage.local.get(['weatherCards', 'suggestedLocations'], (result) => {
    const weatherCards = result.weatherCards || [];
    const suggestedLocations = result.suggestedLocations || [];
    
    // Add the location to weather cards
    weatherCards.push({
      id: crypto.randomUUID(),
      city: location.city,
      country: location.country || 'US'
    });
    
    // Remove the location from suggested locations
    const updatedSuggestions = suggestedLocations.filter(
      item => item.city.toLowerCase() !== location.city.toLowerCase()
    );
    
    // Save the updated data
    chrome.storage.local.set({ 
      weatherCards: weatherCards,
      suggestedLocations: updatedSuggestions
    });
  });
}

// Function to fetch weather data from WeatherAPI.com
async function fetchWeatherData(city, country) {
  // Create a query string based on city and country
  const query = country ? `${city},${country}` : city;
  const cacheKey = query.toLowerCase();
  
  // Check if we have cached data that's still valid
  const now = Date.now();
  if (weatherCache.data[cacheKey] && 
      (now - weatherCache.timestamp[cacheKey] < weatherCache.expirationTime)) {
    console.log(`Using cached weather data for ${query}`);
    return weatherCache.data[cacheKey];
  }
  
  try {
    console.log(`Fetching fresh weather data for ${query}`);
    
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(query)}`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId); // Clear the timeout if the request completes in time
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Weather API error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    
    // Format the weather data
    const weatherData = {
      condition: data.current.condition.text,
      description: data.current.condition.text,
      temp: Math.round(data.current.temp_c),
      humidity: data.current.humidity,
      windSpeed: Math.round(data.current.wind_kph),
      icon: data.current.condition.icon,
      timestamp: new Date().toLocaleTimeString()
    };
    
    // Cache the data
    weatherCache.data[cacheKey] = weatherData;
    weatherCache.timestamp[cacheKey] = now;
    
    return weatherData;
  } catch (error) {
    console.error(`Error fetching weather data for ${query}:`, error);
    
    // If we have stale cached data, return it with a warning
    if (weatherCache.data[cacheKey]) {
      const staleData = { ...weatherCache.data[cacheKey] };
      staleData.stale = true;
      staleData.timestamp = 'Data may be outdated';
      return staleData;
    }
    
    // Otherwise, throw the error
    throw error;
  }
}
