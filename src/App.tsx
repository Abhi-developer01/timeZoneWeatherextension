import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./App.css";
import StickyNotes from "./components/StickyNotes";
import WeatherSection from "./components/WeatherSection";
import { BackgroundLines } from "./components/ui/background-lines";

function App(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [backgroundIndex, setBackgroundIndex] = useState<number>(() => {
    return Math.floor(Math.random() * 5); // 5 different backgrounds
  });
  const [isExtension, setIsExtension] = useState<boolean>(false);

  // Check if running as extension
  useEffect(() => {
    setIsExtension(typeof chrome !== 'undefined' && chrome.storage !== undefined);
  }, []);

  // Perform Google search
  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    if (isExtension) {
      // In extension context, use chrome.tabs API to open in a new tab
      chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}` });
    } else {
      // In development context, use window.open
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
    }
    
    // Clear the search query after search
    setSearchQuery('');
  };

  // Change background
  const changeBackground = (): void => {
    setBackgroundIndex((prevIndex) => (prevIndex + 1) % 5);
  };

  return (
    <div className="dark" data-theme="dark">
      <div className="absolute inset-0 overflow-hidden" style={{
        backgroundImage: 'url("/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <div className="min-h-screen p-2 box-border overflow-hidden relative">
        <main className="w-full relative z-10 px-4" id="main-content">
          <div
            className="flex flex-col gap-5 p-3 sm:p-5 rounded-xl bg-black/40 backdrop-blur-md shadow-lg border border-white/10 w-full"
            role="region"
            aria-label="Weather Extension Dashboard"
          >
            <h1 className="sr-only">Weather Extension Dashboard</h1>
            
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Left Section (75%) - Weather */}
              <div className="lg:w-[75%]">
                {/* Weather Section */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/5 h-[calc(100vh-8rem)] flex flex-col">
                  <WeatherSection isExtension={isExtension} />
                </div>
              </div>
              
              {/* Right Section (25%) - Notes */}
              <div className="lg:w-[25%] bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/5 h-[calc(100vh-8rem)] overflow-auto">
                <StickyNotes isExtension={isExtension} fixedLayout={true} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
