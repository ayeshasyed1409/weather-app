
const API_KEY = "f7476eddafa749e0816193507261210";

const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const message = document.getElementById("message");
const weatherResult = document.getElementById("weather-result");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name.";
        weatherResult.hidden = true;
        return;
    }

    message.textContent = "Fetching weather...";
    message.style.color = "#087fc9";
    weatherResult.hidden = true;
    searchBtn.disabled = true;

    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=yes`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error?.message || "Unable to fetch weather data."
            );
        }

        // Location details
        document.getElementById("city-name").textContent =
            `${data.location.name}, ${data.location.country}`;

        document.getElementById("local-time").textContent =
            `Local time: ${data.location.localtime}`;

        // Temperature
        document.getElementById("temperature").textContent =
            `${data.current.temp_c} °C`;

        // Weather condition and icon
        document.getElementById("condition").textContent =
            data.current.condition.text;

        document.getElementById("weather-icon").src =
            "https:" + data.current.condition.icon;

        document.getElementById("weather-icon").alt =
            data.current.condition.text;

        // Additional details
        document.getElementById("feels-like").textContent =
            `${data.current.feelslike_c} °C`;

        document.getElementById("humidity").textContent =
            `${data.current.humidity}%`;

        document.getElementById("wind").textContent =
            `${data.current.wind_kph} km/h`;

        // Show results
        message.textContent = "";
        weatherResult.hidden = false;

    } catch (error) {
        console.error("Weather API error:", error);

        message.style.color = "#c0392b";
        message.textContent =
            error instanceof TypeError
                ? "Network error. Check your internet connection or browser console."
                : error.message;

        weatherResult.hidden = true;

    } finally {
        searchBtn.disabled = false;
    }
});
