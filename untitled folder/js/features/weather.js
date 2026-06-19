/** Weather feature — mountable async REST module for SPA routes */
export function initWeatherApp() {
  var GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
  var WEATHER_API = "https://api.open-meteo.com/v1/forecast";
  var WMO = { 0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast", 45: "Fog", 61: "Rain", 63: "Moderate rain", 80: "Showers", 95: "Thunderstorm" };

  var els = {
    form: document.getElementById("weather-search-form"),
    input: document.getElementById("weather-city-input"),
    submitBtn: document.getElementById("weather-search-btn"),
    loading: document.getElementById("weather-loading"),
    error: document.getElementById("weather-error"),
    dashboard: document.getElementById("weather-dashboard"),
    live: document.getElementById("weather-live-region"),
    cityName: document.getElementById("weather-city-name"),
    country: document.getElementById("weather-country"),
    condition: document.getElementById("weather-condition"),
    updated: document.getElementById("weather-updated"),
    temperature: document.getElementById("weather-temperature"),
    tempUnit: document.getElementById("weather-temp-unit"),
    humidity: document.getElementById("weather-humidity"),
    wind: document.getElementById("weather-wind"),
    windUnit: document.getElementById("weather-wind-unit"),
    feelsLike: document.getElementById("weather-feels-like"),
  };

  if (!els.form) return function () {};

  function setView(state) {
    els.loading.hidden = state !== "loading";
    els.error.hidden = state !== "error";
    els.dashboard.hidden = state !== "success";
    els.submitBtn.disabled = state === "loading";
    els.input.disabled = state === "loading";
  }

  async function fetchJson(url) {
    var response;
    try { response = await fetch(url); } catch (e) { throw new Error("Network request failed. Check your connection."); }
    if (!response.ok) throw new Error("Weather service error (HTTP " + response.status + ").");
    return response.json();
  }

  async function handleSearch(event) {
    event.preventDefault();
    var city = els.input.value.trim();
    if (!city) { els.error.textContent = "Please enter a city name."; setView("error"); return; }
    setView("loading");
    try {
      var geo = await fetchJson(GEOCODING_API + "?" + new URLSearchParams({ name: city, count: "1", language: "en", format: "json" }));
      if (!geo.results || !geo.results.length) throw new Error('No city found for "' + city + '".');
      var loc = geo.results[0];
      var weather = await fetchJson(WEATHER_API + "?" + new URLSearchParams({
        latitude: String(loc.latitude), longitude: String(loc.longitude),
        current: "temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code", timezone: "auto",
      }));
      var c = weather.current, u = weather.current_units;
      els.cityName.textContent = loc.name + (loc.admin1 ? ", " + loc.admin1 : "");
      els.country.textContent = loc.country || "";
      els.condition.textContent = WMO[c.weather_code] || "Unknown";
      els.updated.textContent = "Last updated: " + new Date(c.time).toLocaleString();
      els.temperature.textContent = Math.round(c.temperature_2m);
      els.tempUnit.textContent = u.temperature_2m || "°C";
      els.humidity.textContent = c.relative_humidity_2m + "%";
      els.wind.textContent = Math.round(c.wind_speed_10m * 10) / 10;
      els.windUnit.textContent = u.wind_speed_10m || "km/h";
      els.feelsLike.textContent = "Feels like " + Math.round(c.apparent_temperature) + (u.apparent_temperature || "°C");
      setView("success");
    } catch (err) {
      els.error.textContent = err.message;
      setView("error");
    }
  }

  els.form.addEventListener("submit", handleSearch);
  return function () { els.form.removeEventListener("submit", handleSearch); };
}
