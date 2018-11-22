import { api } from "./api";

document.querySelector(".second").addEventListener("click", () => {
  const city = document.getElementById("main").value;
  api.changeLocation(city);
  api.getCurrentByID().then(data => console.log(data));
});

const loadWeather = () => {
  api.getCurrentByID().then(data => console.log(data));
};
