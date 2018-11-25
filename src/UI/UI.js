import { api } from "../Api/Api";

class UI {
  constructor() {
    this.city = document.querySelector(".city");
    this.icon = document.querySelector(".icon_desc");
    this.sec_data = document.querySelector(".sec_data");
    this.main_temp = document.querySelector(".temp_wrapper");
    this.details = document.querySelector(".details .table tbody");
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
        this.sec_data.innerHTML = `<span class="main_desc">${
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
      <span class="max_temp">${Math.floor(
        item.main.temp_max
      )}<span class="main_temp_unit">${
        this.unitSign()[1]
      }</span></span> <span class="min_temp">${Math.floor(
        item.main.temp_min
      )}<span class="main_temp_unit">${this.unitSign()[1]}</span></span>  
      </div>
    `;
      this.sec_data.innerHTML += `<i class="fa fa-tint"></i>${
        item.main.humidity
      }%`;
      this.details.innerHTML = `
        <tr>
          <th scope="row">Clouds:</th>
          <td>${item.clouds.all}%</td>
        </tr>
        <tr>
          <th scope="row">Pressure:</th>
          <td>${item.main.pressure}hPa</td>
        </tr>
        <tr>
          <th scope="row">Wind Direction:</th>
          <td>${item.wind.deg}</td>
        </tr>
        <tr>
          <th scope="row">Wind Speed:</th>
          <td>${item.wind.speed} ${this.unitSign()[0]}</td>
        </tr>
        <tr>
        <th scope="row">Sunset:</th>
        <td>${this.timeStamp(item.sys.sunset)}</td>
      </tr>
      <tr>
        <th scope="row">Sunrise:</th>
        <td> ${this.timeStamp(item.sys.sunrise)}</td>
      </tr>
    <div class="last_updated">Last updated: ${this.timeStamp(item.dt)}</div>`;
    });
  }

  showForecast(data) {
    // Wrap json up in array. No need to encapsulate each object entry in array (Object.entries method) Not sure if this is a correct way to do this.
    const objData = [data];

    // Clear the page from current weather data
    this.icon.innerHTML = "";
    this.details.innerHTML = "";

    // Add titles and city/country
    this.main_temp.innerHTML = `5 Day`;
    this.sec_data.innerHTML = `3 Hour Forecast`;
    objData.map(item => {
      this.city.innerHTML = `${item.city.name}, ${item.city.country}`;
    });

    // Get hourly list

    const dataList = objData.map(el => el.list);
    dataList.forEach(arr => {
      arr.forEach((item, i, self) => {
        console.log(item);
        this.details.innerHTML += `<tr>
        <th scope="row">${this.timeStamp(item.dt)} ${item.weather.map(
          i => i.description
        )}</th>
        <td>clounds: ${item.clouds.all}%, wind speed: ${item.wind.speed}${
          this.unitSign()[0]
        }, ${Math.floor(item.main.temp)}${this.unitSign()[1]}, ${
          item.main.humidity
        }%, ${Math.floor(item.main.pressure)}hPa</td>
      </tr>`;
      });
    });
  }

  popErrs() {
    const message = document.querySelector(".city_err");
    message.style.display = "block";
    setTimeout(() => (message.style.display = "none"), 2000);
  }
}
export const ui = new UI();
