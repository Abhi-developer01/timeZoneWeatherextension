import React from "react";
import { FaSun, FaCloud, FaCloudRain, FaSnowflake, FaBolt, FaSmog, FaQuestion, FaTimes, FaWater, FaWind, FaTemperatureHigh, FaCompress, FaClock } from "react-icons/fa";
import { WeatherCardProps } from "../types";

function WeatherCard({ card, weatherData, onDelete }: WeatherCardProps): React.ReactElement {
  // Get weather icon based on condition
  const getWeatherIcon = (condition?: string): React.ReactElement => {
    const conditionLower = condition ? condition.toLowerCase() : '';
    
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
      return <FaSun className="w-10 h-10 text-yellow-500" />;
    } else if (conditionLower.includes('cloud')) {
      return <FaCloud className="w-10 h-10 text-gray-400" />;
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return <FaCloudRain className="w-10 h-10 text-gray-500" />;
    } else if (conditionLower.includes('snow') || conditionLower.includes('ice')) {
      return <FaSnowflake className="w-10 h-10 text-blue-200" />;
    } else if (conditionLower.includes('thunder') || conditionLower.includes('lightning')) {
      return <FaBolt className="w-10 h-10 text-yellow-400" />;
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
      return <FaSmog className="w-10 h-10 text-gray-300" />;
    } else {
      return <FaQuestion className="w-10 h-10 text-gray-400" />;
    }
  };
  
  // Format time from timestamp
  const formatTime = (timestamp?: number): string => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format local time string
  const formatLocalTime = (timeString?: string): string => {
    if (!timeString) return '';
    // The timeString format is typically '2023-05-30 14:30'
    const parts = timeString.split(' ');
    if (parts.length !== 2) return timeString;
    
    // Just return the time part
    const timePart = parts[1];
    // Convert to 12-hour format with AM/PM
    try {
      const [hours, minutes] = timePart.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
      return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (e) {
      return timePart;
    }
  };
  
  if (!weatherData) {
    return (
      <div className="min-w-[200px] max-w-[240px] m-1 shadow-md bg-gradient-to-br from-white to-gray-100 transition-all duration-300 border border-gray-100/30 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg">
        {/* Card header */}
        <div className="flex justify-between items-center py-2 px-4 relative z-10">
          <div>
            <h3 className="font-bold text-sm">{card.name || card.city}</h3>
            <p className="text-xs text-gray-600">{card.country}</p>
          </div>
          <button 
            onClick={() => onDelete(card.id)} 
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes className="w-3 h-3 text-gray-500" />
          </button>
        </div>
        
        <hr className="border-gray-200" />
        
        {/* Card content */}
        <div className="pt-3 px-4 pb-2 relative z-10">
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute w-[150px] h-[150px] rounded-full bg-gradient-radial from-transparent to-white/80 top-[-75px] right-[-75px] opacity-40 animate-float-slow"></div>
        <div className="absolute w-[100px] h-[100px] rounded-full bg-gradient-radial from-blue-200/30 to-transparent bottom-[-50px] left-[-50px] opacity-30 animate-float-slow-reverse"></div>
      </div>
    );
  }

  if (weatherData.error) {
    return (
      <div className="min-w-[200px] max-w-[240px] m-1 shadow-md bg-gradient-to-br from-white to-gray-100 transition-all duration-300 border border-gray-100/30 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg">
        {/* Card header */}
        <div className="flex justify-between items-center py-2 px-4 relative z-10">
          <div>
            <h3 className="font-bold text-sm">{card.name || card.city}</h3>
            <p className="text-xs text-gray-600">{card.country}</p>
          </div>
          <button 
            onClick={() => onDelete(card.id)} 
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes className="w-3 h-3 text-gray-500" />
          </button>
        </div>
        
        <hr className="border-gray-200" />
        
        {/* Card content */}
        <div className="pt-3 px-4 pb-2 relative z-10">
          <div className="flex flex-col items-center mb-3">
            <p className="text-sm text-red-600">Error loading weather data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full shadow-md bg-gradient-to-br from-blue-500/30 to-purple-500/30 transition-all duration-300 border border-white/20 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg backdrop-blur-sm rounded-lg">
      {/* Card header */}
      <div className="flex justify-between items-center py-2 px-4 relative z-10">
        <div>
          <h3 className="font-bold text-sm text-white">{card.name || card.city}</h3>
          <p className="text-xs text-white/70">{card.country}</p>
        </div>
        <button 
          onClick={() => onDelete(card.id)} 
          className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
        >
          <FaTimes className="w-3 h-3" />
        </button>
      </div>
      
      <hr className="border-white/10" />
      
      {/* Card content */}
      <div className="pt-3 px-4 pb-2 relative z-10">
        <div className="flex flex-col items-center mb-2">
          <div className="transform scale-90 -mb-2 text-white">
            {getWeatherIcon(weatherData.condition)}
          </div>
          <div className="font-bold text-3xl leading-tight text-white">
            {weatherData.temp}°C
          </div>
          <div className="flex flex-col items-center">
            <span className="mt-0.5 bg-white/10 text-white font-medium border border-white/20 text-xs px-2 py-0.5 rounded-full">
              {weatherData.condition}
            </span>
            {weatherData.localTime && (
              <div className="mt-1 flex items-center gap-1.5">
                <FaClock className="text-blue-300 w-3 h-3" />
                <span className="text-xs text-white/90 font-medium">
                  {formatLocalTime(weatherData.localTime)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <hr className="my-2 opacity-20 border-white/20" />
        
        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
          <div className="flex items-center gap-1">
            <FaWater className="text-blue-300 w-2.5 h-2.5" />
            <span className="text-xs text-white/80">
              {weatherData.humidity}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaWind className="text-blue-300 w-2.5 h-2.5" />
            <span className="text-xs text-white/80">
              {weatherData.windSpeed} km/h
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaTemperatureHigh className="text-blue-300 w-2.5 h-2.5" />
            <span className="text-xs text-white/80">
              Feels: {weatherData.feelsLike || weatherData.temp}°C
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaCompress className="text-blue-300 w-2.5 h-2.5" />
            <span className="text-xs text-white/80">
              {weatherData.pressure || 'N/A'} hPa
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-center mt-2 gap-1">
          <FaClock className="text-white/60 w-2.5 h-2.5" />
          <span className="text-white/60 text-[10px]">
            {weatherData.stale ? 'Data may be outdated' : `Updated: ${formatTime(weatherData.timestamp)}`}
          </span>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute w-[150px] h-[150px] rounded-full bg-gradient-radial from-transparent to-white/80 top-[-75px] right-[-75px] opacity-40 animate-float-slow"></div>
      <div className="absolute w-[100px] h-[100px] rounded-full bg-gradient-radial from-blue-200/30 to-transparent bottom-[-50px] left-[-50px] opacity-30 animate-float-slow-reverse"></div>
    </div>
  );
}

export default WeatherCard;
