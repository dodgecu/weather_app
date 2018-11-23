import { api } from "./api/api";
import { throws } from "assert";

document.getElementById("citySearch").addEventListener("submit", e => {
  const city = document.getElementById("mainSearch").value;
  api.changeLocation(city);
  api.getCurrentByID().then(data => console.log(data));
  e.preventDefault();
});

document.querySelector("#btn").addEventListener("click", toggleState);

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

const loadWeather = () => {
  api.getByCoordinates().then(data => console.log(data));
};

//loadWeather();
