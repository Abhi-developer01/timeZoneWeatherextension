# Weather Extension

A feature-rich browser extension that provides weather information for multiple locations, allows you to create sticky notes, and includes a Google search feature - all with beautiful background gradients.

## Features

- **Weather Cards**: View weather information for multiple cities with real-time data from OpenWeatherMap API
- **Sticky Notes**: Create, edit, and position colorful sticky notes anywhere on the interface
- **Google Search**: Quickly search Google directly from the extension
- **Beautiful UI**: Gradient backgrounds that can be changed with a click
- **Responsive Design**: Works well on different screen sizes

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- An OpenWeatherMap API key (get one for free at [OpenWeatherMap](https://openweathermap.org/api))

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
   This will start the app in development mode, accessible at http://localhost:5173 (or another port if 5173 is in use).

## Building the Extension

1. Replace `YOUR_API_KEY` in `public/background.js` with your actual OpenWeatherMap API key.

2. Build the extension:
   ```
   npm run build-extension
   ```
   This will create a `dist` folder with the packaged extension.

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable Developer mode (toggle in the top right)
   - Click 'Load unpacked' and select the `dist` folder

## How to Use

### Weather Cards

- The extension comes with default weather cards for New York, London, and Tokyo
- Add new locations by entering a city name and country code in the 'Add Location' form
- Remove locations by clicking the trash icon on any weather card

### Sticky Notes

- Click the '+' button in the bottom right to add a new sticky note
- Drag notes to position them anywhere on the screen
- Edit note content by typing in the textarea
- Delete notes by clicking the trash icon on each note

### Google Search

- Enter your search query in the search box at the top
- Press Enter or click the search icon to search Google in a new tab

### Changing Backgrounds

- Click on the 'Weather Extension' title to cycle through different gradient backgrounds

## Technical Details

- Built with React and Vite
- Uses Chrome Storage API for data persistence in extension mode
- Falls back to localStorage when running in development mode
- Implements real weather data fetching through the background script
- Responsive design with Tailwind CSS and custom styling

## License

MIT

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
#   t i m e Z o n e W e a t h e r e x t e n s i o n  
 