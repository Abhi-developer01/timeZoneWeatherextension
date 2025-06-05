const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sourceIconPath = path.join(__dirname, '../public/icons/weather.png');
const outputDir = path.join(__dirname, '../public/icons');

const iconsToGenerate = [
  { name: 'icon16.png', width: 16, height: 16 },
  { name: 'icon48.png', width: 48, height: 48 },
  { name: 'icon128.png', width: 128, height: 128 },
];

async function generateIcons() {
  if (!fs.existsSync(sourceIconPath)) {
    console.error(`Error: Source icon not found at ${sourceIconPath}`);
    console.error('Please ensure public/icons/weather.png exists.');
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Generating icons from ${sourceIconPath} to ${outputDir}`);

  for (const icon of iconsToGenerate) {
    const outputPath = path.join(outputDir, icon.name);
    try {
      await sharp(sourceIconPath)
        .resize(icon.width, icon.height)
        .toFile(outputPath);
      console.log(`Successfully generated ${outputPath} (${icon.width}x${icon.height})`);
    } catch (err) {
      console.error(`Error generating ${icon.name}:`, err);
    }
  }
  console.log('Icon generation complete.');
}

generateIcons();
