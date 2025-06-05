const fs = require('fs');
const path = require('path');

// Create the icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Simple function to create a placeholder icon
function createPlaceholderIcon(size) {
  // Create a simple HTML canvas with the icon
  const html = `
    <html>
      <body>
        <canvas id="canvas" width="${size}" height="${size}"></canvas>
        <script>
          const canvas = document.getElementById('canvas');
          const ctx = canvas.getContext('2d');
          
          // Background
          ctx.fillStyle = '#4facfe';
          ctx.fillRect(0, 0, ${size}, ${size});
          
          // Sun
          ctx.fillStyle = '#ffdd00';
          ctx.beginPath();
          ctx.arc(${size * 0.35}, ${size * 0.35}, ${size * 0.2}, 0, Math.PI * 2);
          ctx.fill();
          
          // Cloud
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(${size * 0.65}, ${size * 0.45}, ${size * 0.2}, 0, Math.PI * 2);
          ctx.arc(${size * 0.45}, ${size * 0.45}, ${size * 0.15}, 0, Math.PI * 2);
          ctx.fill();
          
          // Convert to data URL
          const dataUrl = canvas.toDataURL('image/png');
          document.body.innerHTML = dataUrl;
        </script>
      </body>
    </html>
  `;
  
  // Write the HTML file
  fs.writeFileSync(path.join(__dirname, `icon${size}.html`), html);
  console.log(`Created HTML template for icon${size}.png. Please open in a browser and save the data URL as a PNG file.`);
}

// Create placeholder icons for different sizes
createPlaceholderIcon(16);
createPlaceholderIcon(48);
createPlaceholderIcon(128);

console.log('\nInstructions:');
console.log('1. Open each HTML file in a browser');
console.log('2. Right-click on the data URL and save the image');
console.log('3. Save as icon16.png, icon48.png, and icon128.png in the public/icons directory');
