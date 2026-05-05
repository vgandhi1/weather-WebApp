# Weather Web App

A premium, responsive weather application built with React and Vite.

**[Live Demo](https://vgandhi1.github.io/weather-WebApp/)**

## Features
- **Real-time Weather**: Current conditions (Temperature, Humidity, Wind).
- **Forecast**: 5-day weather outlook.
- **Glassmorphism Design**: Modern UI with dynamic backgrounds.
- **Responsive**: Works seamlessly on desktop and mobile.

## Prerequisites
- **Node.js**: Version 18 or higher recommended.
- **npm**: Comes with Node.js.

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weather-app
   ```

2. **Configure API keys**
   - Sign up for a free account at [OpenWeatherMap](https://openweathermap.org/api).
   - Generate an API Key.
   - Create a `.env` file in the root directory:
     ```env
     VITE_OPENWEATHER_API_KEY=your_api_key_here
     ```
   - **News on GitHub Pages (static hosting):** The app cannot call NewsAPI.org from the browser, and there is no `/api/news` server on `github.io`. After a weather search, **local headlines** load via **Google News RSS** through [rss2json](https://rss2json.com/docs) (no key required for light use). For higher rss2json limits, add `VITE_RSS2JSON_API_KEY` to `.env` and rebuild.
   - **Optional — NewsAPI with a backend:** If you deploy with Cloudflare Workers, Nginx, or similar and proxy `/api/news` to NewsAPI, set `VITE_NEWS_API_KEY` so production can use that path first.

3. **Install dependencies**
   This command installs all required packages listed in `package.json`.
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view the app.

## Dependencies
The project relies on the following key packages:
- **react**: UI library.
- **react-dom**: React renderer for the DOM.
- **lucide-react**: Icon set.
- **vite**: Build tool and development server.

## Building for Production
To create a production build:
```bash
npm run build
```
The output is written to the **`weather`** folder (see `vite.config.js`). For a full deployment checklist and GitHub Pages steps, see [DEPLOYMENT.md](./DEPLOYMENT.md).
