/**
 * Weather Dashboard — async Fetch API with geocoding + forecast
 * Uses Open-Meteo public REST APIs (no API key required).
 */
(function () {
  "use strict";

  var GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
  var WEATHER_API = "https://api.open-meteo.com/v1/forecast";

  var WMO_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  var elements = {};

  function init() {
    elements.app = document.getElementById("weather-app");
    if (!elements.app) return;

    elements.form = document.getElementById("weather-search-form");
    elements.input = document.getElementById("weather-city-input");
    elements.submitBtn = document.getElementById("weather-search-btn");
    elements.loading = document.getElementById("weather-loading");
    elements.error = document.getElementById("weather-error");
    elements.dashboard = document.getElementById("weather-dashboard");
    elements.liveRegion = document.getElementById("weather-live-region");

    elements.cityName = document.getElementById("weather-city-name");
    elements.country = document.getElementById("weather-country");
    elements.condition = document.getElementById("weather-condition");
    elements.updated = document.getElementById("weather-updated");
    elements.temperature = document.getElementById("weather-temperature");
    elements.tempUnit = document.getElementById("weather-temp-unit");
    elements.humidity = document.getElementById("weather-humidity");
    elements.wind = document.getElementById("weather-wind");
    elements.windUnit = document.getElementById("weather-wind-unit");
    elements.feelsLike = document.getElementById("weather-feels-like");

    elements.form.addEventListener("submit", handleSearch);
  }

  function announce(message) {
    if (elements.liveRegion) {
      elements.liveRegion.textContent = message;
    }
  }

  function setView(state) {
    elements.loading.hidden = state !== "loading";
    elements.error.hidden = state !== "error";
    elements.dashboard.hidden = state !== "success";

    elements.submitBtn.disabled = state === "loading";
    elements.input.disabled = state === "loading";
  }

  function showError(message) {
    elements.error.textContent = message;
    setView("error");
    announce(message);
  }

  async function fetchJson(url) {
    var response;

    try {
      response = await fetch(url);
    } catch (error) {
      throw new Error(
        "Network request failed. Check your internet connection and try again."
      );
    }

    if (!response.ok) {
      throw new Error(
        "Weather service returned an error (HTTP " + response.status + "). Please try again later."
      );
    }

    try {
      return await response.json();
    } catch (error) {
      throw new Error("Received invalid data from the weather service.");
    }
  }

  async function geocodeCity(cityName) {
    var params = new URLSearchParams({
      name: cityName,
      count: "1",
      language: "en",
      format: "json",
    });

    var data = await fetchJson(GEOCODING_API + "?" + params.toString());

    if (!data.results || data.results.length === 0) {
      throw new Error(
        'No city found for "' + cityName + '". Check the spelling and try again.'
      );
    }

    return data.results[0];
  }

  async function fetchWeather(latitude, longitude) {
    var params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current:
        "temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code",
      timezone: "auto",
    });

    return fetchJson(WEATHER_API + "?" + params.toString());
  }

  function getConditionText(code) {
    return WMO_CODES[code] || "Unknown conditions";
  }

  function formatUpdatedTime(isoString) {
    try {
      return new Date(isoString).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (error) {
      return isoString;
    }
  }

  function renderDashboard(location, weather) {
    var current = weather.current;
    var units = weather.current_units;

    if (!current || !units) {
      throw new Error("Weather data is incomplete. Please try another city.");
    }

    var admin = location.admin1 ? ", " + location.admin1 : "";

    elements.cityName.textContent = location.name + admin;
    elements.country.textContent = location.country || "";
    elements.condition.textContent = getConditionText(current.weather_code);
    elements.updated.textContent =
      "Last updated: " + formatUpdatedTime(current.time);

    elements.temperature.textContent = Math.round(current.temperature_2m);
    elements.tempUnit.textContent = units.temperature_2m || "°C";
    elements.humidity.textContent = current.relative_humidity_2m + "%";
    elements.wind.textContent = Math.round(current.wind_speed_10m * 10) / 10;
    elements.windUnit.textContent = units.wind_speed_10m || "km/h";
    elements.feelsLike.textContent =
      "Feels like " +
      Math.round(current.apparent_temperature) +
      (units.apparent_temperature || "°C");

    setView("success");

    announce(
      "Weather loaded for " +
        location.name +
        ". " +
        getConditionText(current.weather_code) +
        ", " +
        Math.round(current.temperature_2m) +
        (units.temperature_2m || "°C") +
        "."
    );
  }

  async function getWeatherByCity(cityName) {
    var location = await geocodeCity(cityName);
    var weather = await fetchWeather(location.latitude, location.longitude);
    return { location: location, weather: weather };
  }

  async function handleSearch(event) {
    event.preventDefault();

    var cityName = elements.input.value.trim();
    if (!cityName) {
      showError("Please enter a city name.");
      elements.input.focus();
      return;
    }

    setView("loading");
    elements.error.textContent = "";
    announce("Loading weather for " + cityName);

    try {
      var result = await getWeatherByCity(cityName);
      renderDashboard(result.location, result.weather);
    } catch (error) {
      showError(error.message || "Something went wrong. Please try again.");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
