// Content script for Weather Extension
// This script runs in the context of web pages

// Listen for messages from the extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    // Get the current page title and URL
    const pageInfo = {
      title: document.title,
      url: window.location.href
    };
    
    // Send the information back to the popup
    sendResponse(pageInfo);
  }
  
  // Return true to indicate we'll respond asynchronously
  return true;
});

// Function to detect location mentions on the page
function detectLocationMentions() {
  const text = document.body.innerText;
  const locationRegex = /\b(?:weather in|temperature in|forecast for) ([A-Z][a-z]+(?: [A-Z][a-z]+)*)\b/gi;
  
  const matches = [];
  let match;
  
  while ((match = locationRegex.exec(text)) !== null) {
    if (match[1] && !matches.includes(match[1])) {
      matches.push(match[1]);
    }
  }
  
  if (matches.length > 0) {
    // Send detected locations to the extension
    chrome.runtime.sendMessage({
      action: 'detectedLocations',
      locations: matches
    });
  }
}

// Run the location detection after the page has fully loaded
window.addEventListener('load', () => {
  // Wait a bit to ensure all dynamic content is loaded
  setTimeout(detectLocationMentions, 1500);
});
