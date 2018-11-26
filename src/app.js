/**
 * Main APP js
 *
 */
import { api } from "./Api/Api";
import { ui } from "./UI/UI";

// Load event listeners
document.addEventListener("DOMContentLoaded", loadWeather);
document.getElementById("citySearch").addEventListener("submit", getWeatherBySearch);
document.querySelector("#btn").addEventListener("click", toggleState);
document.querySelector(".currLocation").addEventListener("click", changeGeoLocation);
document.querySelector(".link1").addEventListener("click", currTabWeather);
document.querySelector(".link2").addEventListener("click", tabForecast);
document.getElementById("mainSearch").addEventListener('keyup', accurateSeearch);


// Get accurate search results/ pass them to main search
function accurateSeearch(e) {
  const city = document.getElementById("mainSearch").value;
  console.log(city);
  api.changeLocation(city, api.id);
  e.preventDefault();
  api.searchAccuracy()
    .then(res => ui.searchAccurate(res))
    .catch(err => console.error(err))
};


// Load current weather by tabs
function currTabWeather() {
  api
    .getCurrentByID()
    .then(res => ui.showCurrent(res))
    .catch(err => console.log(err));
}

// Load forecast weather by tabs
function tabForecast() {
  api
    .getForecastByCity()
    .then(res => ui.showForecast(res))
    .catch(err => console.log(err));
}

// Get weather from submit form
function getWeatherBySearch(e) {
  e.preventDefault();
  const inputData = document.getElementById("mainSearch").value;
  const cityId = inputData.split(' ').filter((item, i, self) => item === self[self.length - 1]);
  const setId = parseInt(cityId);
  if (inputData !== "") {
    api.changeLocation(api.city, setId);
    api
      .getCurrentByID()
      .then(res => {
        console.log(res);
        res.cod === "400" || res.cod === "404" ? ui.popErrs() : ui.showCurrent(res);
      })
      .catch(err => console.log(err));
  } else {
    ui.popErrs();
  }
}

// Load weather by current geolocation. Set city id to that location
function changeGeoLocation() {
  api
    .getByCoordinates()
    .then(res => {
      api.changeLocation(res.name, res.id);
      ui.showCurrent(res);
    })
    .catch(err => console.error(err));
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

