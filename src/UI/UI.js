import { api } from "../Api/Api";

class UI {
  constructor() {
    this.city = document.querySelector(".city");
    this.icon = document.querySelector(".icon_desc");
    this.secData = document.querySelector(".sec_data");
    this.main_temp = document.querySelector(".temp_wrapper");
  }

  unitSign() {
    if (api.unit === "imperial") return ["mi/h", "°F"];
    if (api.unit === "metric") return ["m/sec", "°C"];
  }

  timeStamp(mils) {
    const time = new Date(mils * 1000);
    return `<span class="t_date">${time.toDateString()}</span> <span class="t_time">${time.toLocaleTimeString()}</span>`;
  }

  showCurrent(data) {
    // Wrap json up in array. No need to encapsulate each object entry in array (Object.entries method) Not sure if this is a correct way to do this.
    const objData = [data];

    // Show weather conditions data
    const weather = objData.map(el => el.weather);
    weather.map(el => {
      el.map(item => {
        this.icon.innerHTML = `<img src='//openweathermap.org/img/w/${
          item.icon
        }.png'>`;
        this.secData.innerHTML = `<span class="main_desc">${
          item.main
        }</span> / <span class="sec_desc">${item.description}</span>`;
      });
    });

    // Show main temperatures
    objData.map(item => {
      this.city.innerHTML = `${item.name}, ${item.sys.country}`;
      this.main_temp.innerHTML = `
      <div class="main_temp">${Math.floor(
        item.main.temp
      )}</div> <span class="main_temp_unit">${this.unitSign()[1]}</span>
      <div class="temp_details">
      <span class="max_temp">${
        item.main.temp_max
      }<span class="main_temp_unit">${
        this.unitSign()[1]
      }</span></span> <span class="min_temp">${
        item.main.temp_min
      }<span class="main_temp_unit">${this.unitSign()[1]}</span></span>  
      </div>
    `;
      this.secData.innerHTML += `<i class="fa fa-tint"></i>${
        item.main.humidity
      }%`;

      /* this.main.innerHTML = `Updated: ${this.timeStamp(
        item.dt
      )} <hr />Temperature: ${Math.floor(item.main.temp)} ${
        this.unitSign()[1]
      }  <hr /> Max: ${item.main.temp_max}${this.unitSign()[1]} Min: ${
        item.main.temp_min
      } ${this.unitSign()[1]}  <hr /> Humidity: ${
        item.main.humidity
      }%  <hr /> Pressure: ${item.main.pressure}hPa,  <hr /> Wind Direction: ${
        item.wind.deg
      }, Wind Speed: ${item.wind.speed} ${
        this.unitSign()[0]
      } <hr /><div class="sun_s_r"> Sunset: ${this.timeStamp(
        item.sys.sunset
      )}, Sunrise: ${this.timeStamp(item.sys.sunrise)}</div>`;
      this.city.innerHTML = `${item.name}, ${item.sys.country}`;*/
    });
    console.log(objData);
  }

  showForecast(data) {
    // Wrap json up in array. No need to encapsulate each object entry in array (Object.entries method) Not sure if this is a correct way to do this.
    const objData = [data];
    this.main.innerHTML = "";
    this.icon.innerHTML = "";
    this.description.innerHTML = "";
    console.log(objData);
  }

  popErrs() {
    const message = document.querySelector(".city_err");
    message.style.display = "block";
    setTimeout(() => (message.style.display = "none"), 2000);
  }
}
export const ui = new UI();
