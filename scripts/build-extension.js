const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');


// Copy manifest.json and background.js to the dist folder
console.log('\nCopying extension files to dist folder...');
const publicDir = path.join(__dirname, '../public');
const distDir = path.join(__dirname, '../dist');

// Copy manifest.json
fs.copyFileSync(
  path.join(publicDir, 'manifest.json'),
  path.join(distDir, 'manifest.json')
);
console.log('Copied manifest.json');

// Copy background.js
fs.copyFileSync(
  path.join(publicDir, 'background.js'),
  path.join(distDir, 'background.js')
);
console.log('Copied background.js');

// Copy content.js
fs.copyFileSync(
  path.join(publicDir, 'content.js'),
  path.join(distDir, 'content.js')
);
console.log('Copied content.js');

// Create icons directory in dist if it doesn't exist
const distIconsDir = path.join(distDir, 'icons');
if (!fs.existsSync(distIconsDir)) {
  fs.mkdirSync(distIconsDir, { recursive: true });
}

// Copy icon files
const iconFiles = ['icon16.png', 'icon48.png', 'icon128.png'];
iconFiles.forEach(iconFile => {
  fs.copyFileSync(
    path.join(publicDir, 'icons', iconFile),
    path.join(distIconsDir, iconFile)
  );
  console.log(`Copied ${iconFile}`);
});

console.log('\nExtension build completed! The extension is ready in the dist folder.');
console.log('\nTo load the extension in Chrome:');
console.log('1. Open Chrome and go to chrome://extensions');
console.log('2. Enable "Developer mode" (toggle in the top right)');
console.log('3. Click "Load unpacked" and select the dist folder');
console.log('\nNOTE: Remember to replace "YOUR_API_KEY" in background.js with your actual OpenWeatherMap API key.');
