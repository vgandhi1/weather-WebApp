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

2. **Configure API Key**
   - Sign up for a free account at [OpenWeatherMap](https://openweathermap.org/api).
   - Generate an API Key.
   - Create a `.env` file in the root directory:
     ```env
     VITE_OPENWEATHER_API_KEY=your_api_key_here
     ```

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
The output will be in the `dist` folder.
