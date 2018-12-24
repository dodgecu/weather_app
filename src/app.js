/**
 * Main APP js
 *
 */
import Weather from "./Api/Api";
import { storage } from "./Storage/Storage";
import { ui } from "./UI/UI";



// Local Storage, unit data
const location = storage.getLocationData();
location.unit === "metric"
  ? document.getElementById('btn-unit').value = "°C"
  : document.getElementById('btn-unit').value = "°F";


// Instantiate weather api
const api = new Weather(location.city, location.unit, location.id);



// Load event listeners
document.addEventListener("DOMContentLoaded", loadWeather);
document.getElementById("mainSearch").addEventListener("keyup", accurateSearch);
document
  .getElementById("citySearch")
  .addEventListener("submit", getWeatherBySearch);
document.querySelector("#btn-unit").addEventListener("click", toggleState);
document
  .querySelector(".currLocation")
  .addEventListener("click", changeGeoLocation);
document.querySelector(".link1").addEventListener("click", currTabWeather);
document.querySelector(".link2").addEventListener("click", tabForecast);

// Get accurate search results/ pass them to main search
function accurateSearch() {
  const city = document.getElementById("mainSearch").value;
  api.changeLocation(city, api.id);
  storage.setLocationData(city, api.id, location.unit);
  api
    .searchAccuracy()
    .then(res => ui.searchAccurate(res))
    .catch(err => console.error(err));
}

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
  const cityId = inputData
    .split(" ")
    .filter((item, _, self) => item === self[self.length - 1]);
  const setId = parseInt(cityId);
  if (inputData !== "") {
    api.changeLocation(api.city, setId);
    storage.setLocationData(api.city, setId, location.unit);
    api
      .getCurrentByID()
      .then(res => {
        res.cod === "400" || res.cod === "404"
          ? ui.popErrs()
          : ui.showCurrent(res);
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
      storage.setLocationData(res.name, res.id, location.unit);
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
function toggleState() {
  if (location.unit === "imperial") {
    storage.setLocationData(location.city, location.id, "metric");
    document.getElementById('btn-unit').value = "°C";
    setTimeout(() => window.location.reload(), 500);
  }

  if (location.unit === "metric") {
    storage.setLocationData(location.city, location.id, "imperial");
    document.getElementById('btn-unit').value = "°F";
    setTimeout(() => window.location.reload(), 500);
  }
}

window.onload = function () {
  setTimeout(() => document.querySelector('#preloader').style.display = 'none', 2000);
};


