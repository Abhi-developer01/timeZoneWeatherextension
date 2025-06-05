// Type definitions for the Weather Extension

// Props interfaces
export interface WeatherSectionProps {
  isExtension: boolean;
}

export interface WeatherCardProps {
  card: WeatherCard;
  weatherData?: WeatherData;
  onDelete: (id: string) => void;
}

export interface CitySelectorProps {
  onCitySelect: (city: City) => void;
}

export interface StickyNotesProps {
  isExtension: boolean;
  fixedLayout?: boolean;
}

export interface StickyNoteProps {
  note: StickyNote;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  onDragEnd: (id: string, position: { x: number; y: number }) => void;
  onColorChange: (id: string, color: string) => void;
}

export interface BackgroundLinesProps {
  children: React.ReactNode;
  className?: string;
  svgOptions?: {
    duration?: number;
  };
}

// Data interfaces
export interface WeatherCard {
  id: string;
  city?: string;
  country: string;
  name?: string;
  lat?: number;
  lon?: number;
}

export interface StickyNote {
  id: string;
  content: string;
  position: {
    x: number;
    y: number;
  };
  color: string;
  createdAt: number;
}

export interface City {
  city: string;
  country: string;
  name?: string;
  lat?: number;
  lon?: number;
  region?: string;
}

export interface WeatherData {
  location?: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current?: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
  // Simplified properties used in the WeatherCard component
  error?: boolean;
  temp?: number;
  condition?: string;
  humidity?: number;
  windSpeed?: number;
  feelsLike?: number;
  pressure?: number;
  timestamp?: number;
  stale?: boolean;
  localTime?: string;
  timezone?: string;
}

// State interfaces
export interface WeatherDataState {
  [key: string]: WeatherData | undefined;
}

export interface StickyNotesState {
  [key: string]: StickyNote;
}
