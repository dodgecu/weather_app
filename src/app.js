/**
 * Main APP js
 *
 */
import { api } from "./Api/Api";
import { ui } from "./UI/UI";

// Load event listeners
document.addEventListener("DOMContentLoaded", loadWeather);
document
  .getElementById("citySearch")
  .addEventListener("submit", getWeatherBySearch);
document.querySelector("#btn").addEventListener("click", toggleState);
document
  .querySelector(".currLocation")
  .addEventListener("click", changeGeoLocation);
document
  .getElementById("pills-home-tab")
  .addEventListener("click", currTabWeather);
document
  .getElementById("pills-profile-tab")
  .addEventListener("click", tabForecast);

// Get weather from submit form
function getWeatherBySearch(e) {
  e.preventDefault();
  const city = document.getElementById("mainSearch").value;
  api.changeLocation(city);
  api
    .getCurrentByID()
    .then(res =>
      res.cod === "400" || res.cod === "404"
        ? console.log("City Not Found")
        : ui.showForecast(res)
    )
    .catch(err => console.log(err));
}

// Load weather by current geolocation. Set city id to that location
function changeGeoLocation() {
  api
    .getByCoordinates()
    .then(res => {
      api.changeLocation(res.name);
      ui.showCurrent(res);
    })
    .catch(err => console.error(err));
}

// Load current weather by tabs
function currTabWeather() {
  api
    .getCurrentByID()
    .then(res =>
      res.cod === "400" || res.cod === "404"
        ? console.log("City Not Found")
        : ui.showCurrent(res)
    )
    .catch(err => console.log(err));
}

// Load forecast weather by tabs
function tabForecast() {
  api
    .getForecastByCity()
    .then(res => ui.showForecast(res))
    .catch(err => console.log(err));
}

// Default weather data (dom loaded)
function loadWeather() {
  api
    .getCurrentByID()
    .then(data => ui.showCurrent(data))
    .catch(err => console.error(err));
}

// Temperature (UNIT) button
function toggleState(e) {
  const self = e.target;
  self.classList.toggle("metric");
  self.classList.toggle("imperial");
  if (self.classList.contains("metric")) {
    self.value = "°C";
    api.changeUnit("metric");
  }
  if (self.classList.contains("imperial")) {
    self.value = "°F";
    api.changeUnit("imperial");
  }
}
