
import { useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
console.log("API key loaded:", Boolean(API_KEY));

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getWeather(e) {
    e.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    if (!API_KEY) {
      setError("API key is missing. Please configure your .env file.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const url =
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city.trim())}&aqi=no`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || "Unable to fetch weather data."
        );
      }

      setWeather(data);
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <section className="weather-card">
        <div className="brand">
          <span>🌦️</span>
          <span>SkyCast</span>
        </div>

        <h1>Weather Forecast</h1>
        <p className="subtitle">
          Discover the weather anywhere in the world.
        </p>

        <form className="search-form" onSubmit={getWeather}>
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="City name"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {weather && (
          <section className="weather-result">
            <p className="location">
              📍 {weather.location.name}, {weather.location.country}
            </p>

            <img
              className="weather-icon"
              src={`https:${weather.current.condition.icon}`}
              alt={weather.current.condition.text}
            />

            <h2 className="temperature">
              {Math.round(weather.current.temp_c)}°C
            </h2>

            <p className="condition">
              {weather.current.condition.text}
            </p>

            <div className="details">
              <div className="detail">
                <span>💧</span>
                <p>Humidity</p>
                <strong>{weather.current.humidity}%</strong>
              </div>

              <div className="detail">
                <span>💨</span>
                <p>Wind speed</p>
                <strong>{weather.current.wind_kph} km/h</strong>
              </div>

              <div className="detail">
                <span>🌡️</span>
                <p>Feels like</p>
                <strong>
                  {Math.round(weather.current.feelslike_c)}°C
                </strong>
              </div>
            </div>

            <p></p>
          </section>
        )}

        {!weather && !error && (
          <div className="empty-state">
            <span>🌍</span>
            <p>Your city's weather will appear here.</p>
          </div>
        )}

        <footer></footer>
      </section>
    </main>
  );
}

export default App;
