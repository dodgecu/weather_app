/**
 * Main APP js
 *
 */
import { api } from "./api/api";

document.addEventListener("DOMContentLoaded", loadWeather);
document
  .getElementById("citySearch")
  .addEventListener("submit", getWeatherBySearch);
document.querySelector("#btn").addEventListener("click", toggleState);

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
        : console.log(res)
    )
    .catch(err => console.log(err));
}

// Load weather by current location. Set city to that location

document.querySelector(".currLocation").addEventListener("click", () => {
  api
    .getByCoordinates()
    .then(res => {
      api.changeLocation(res.name);
      console.log(res);
    })
    .catch(err => console.error(err));
});

// Load current weather by tabs
document.getElementById("pills-home-tab").addEventListener("click", () => {
  api
    .getCurrentByID()
    .then(res =>
      res.cod === "400" || res.cod === "404"
        ? console.log("City Not Found")
        : console.log(res)
    )
    .catch(err => console.log(err));
});

// Load forecast weather by tabs
document.getElementById("pills-profile-tab").addEventListener("click", () => {
  api
    .getForecastByCity()
    .then(res =>
      res.cod === "400" || res.cod === "404"
        ? console.log("City Not Found")
        : console.log(res)
    )
    .catch(err => console.log(err));
});

// Default weather data (dom loaded)
function loadWeather() {
  api
    .getCurrentByID()
    .then(data => console.log(data))
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
