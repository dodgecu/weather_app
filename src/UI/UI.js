import { api } from "../Api/Api";

class UI {
  constructor() {
    this.city = document.querySelector(".city");
    this.icon = document.querySelector(".icon_desc");
    this.sec_data = document.querySelector(".sec_data");
    this.mainSearch = document.querySelector("#mainSearch");
    this.main_temp = document.querySelector(".temp_wrapper");
    this.accSearch = document.querySelector(".accurate_search");
    this.details = document.querySelector(".details .table tbody");
  }

  /**
   * Get metric/imperial units
   *
   */
  unitSign() {
    if (api.unit === "imperial") return ["mi/h", "°F"];
    if (api.unit === "metric") return ["m/sec", "°C"];
  }

  /**
   * Unix Timestamp
   * @param {number} mils
   * @param {boolean} dateTime (false - get only time, true - get only date)
   *
   */
  timeStamp(mils, dateTime) {
    const time = new Date(mils * 1000);
    if (dateTime === true) {
      return `<span class="t_date">${time.toDateString()}`;
    } else if (dateTime === false) {
      return `<span class="t_time">${time.toLocaleTimeString()}`;
    }
    return `<span class="t_date">${time.toDateString()}</span> <span class="t_time">${time.toLocaleTimeString()}</span>`;
  }

  /**
   *
   * @param {json data} data
   */
  searchAccurate(data) {
    const resData = [data];
    this.accSearch.style.display = "block";
    resData.map(el => {
      if (el.cod === "400") {
        this.accSearch.innerHTML = `<li class="list-group-item list-group-item-dark">${
          el.message
          }</li>`;
        //setTimeout(() => this.accSearch.style.display = "none", 2000);
      } else {
        this.accSearch.innerHTML = "";
        el.list.forEach(result => {
          this.accSearch.innerHTML += `<li class="search_autocomplete list-group-item list-group-item-dark">${
            result.name
            }, ${result.sys.country}, ${result.id}</li>`;
          const elements = document.querySelectorAll(".search_autocomplete");
          elements.forEach(item => {
            item.addEventListener("mouseover", e => {
              const self = e.target.innerHTML;
              this.mainSearch.value = `${self}`;
            });
            item.addEventListener("click", e => {
              const self = e.target.innerHTML;
              this.mainSearch.value = `${self}`;
              this.accSearch.style.display = "none";
            });
          });
        });
      }
    });
  }

  /**
   * @param {json data} data
   *
   * Show current temp
   */
  showCurrent(data) {
    // Wrap json up in array. No need to encapsulate each object entry in array (Object.entries method) Not sure if this is a correct way to do this.
    const objData = [data];

    // Show weather conditions data
    const weather = objData.map(el => el.weather);
    weather.map(el => {
      el.map(item => {
        this.icon.innerHTML = `<img src='//openweathermap.org/img/w/${item.icon}.png'>`;
        this.sec_data.innerHTML = `<span class="main_desc">${item.main}</span> / <span class="sec_desc">${item.description}</span>`;
      });
    });

    // Show main temperatures
    objData.map(item => {
      this.city.innerHTML = `${item.name}, ${item.sys.country}`;
      this.main_temp.innerHTML = `
      <div class="main_temp">${Math.floor(item.main.temp)}</div> 
      <span class="main_temp_unit">${this.unitSign()[1]}</span>
      <div class="temp_details">
      <span class="max_temp">${Math.floor(item.main.temp_max)}
      <span class="main_temp_unit">${this.unitSign()[1]}</span>
      </span> <span class="min_temp">${Math.floor(item.main.temp_min)}
      <span class="main_temp_unit">${this.unitSign()[1]}</span></span>  
      </div>
    `;
      // Show foirecast list details
      this.sec_data.innerHTML += `<i class="fa fa-tint"></i>${item.main.humidity}%`;
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
        <td>${this.timeStamp(item.sys.sunset, false)}</td>
      </tr>
      <tr>
        <th scope="row">Sunrise:</th>
        <td> ${this.timeStamp(item.sys.sunrise, false)}</td>
      </tr>
    <div class="last_updated">Last updated: ${this.timeStamp(item.dt)}</div>`;
    });
  }

  /**
   * @param {json data} data
   *
   * Show weather forecast
   */
  showForecast(data) {
    // Wrap json up in array. No need to encapsulate each object entry in array (Object.entries method) Not sure if this is a correct way to do this.
    const objData = [data];

    // Clear the page from current weather data
    this.icon.innerHTML = "";
    this.details.innerHTML = "";

    // Add titles and city/country
    this.main_temp.innerHTML = `<h3>5 Day</h3>`;
    this.sec_data.innerHTML = `<h5>3 Hour Forecast</h5>`;
    objData.map(
      item => (this.city.innerHTML = `${item.city.name}, ${item.city.country}`)
    );

    // Get hourly list
    const dataList = objData.map(el => el.list);
    dataList.forEach(arr => {
      arr.forEach((item, i) => {
        const icon = item.weather.map(i => `<img src='//openweathermap.org/img/w/${i.icon}.png'>`);
        this.details.innerHTML += `
        <tr>
        <th class="main-row" scope="row">
        <span class="forecast_time">${
          i % 8 === 0
            ? this.timeStamp(item.dt, true)
            : this.timeStamp(item.dt, false)
          }</span>
        ${icon}
        <span class="forecast_desc">${item.weather.map(i => i.description)}</span>
        </th>
        <td class="forecast_data">
          <span class="forcast_temp">${Math.floor(item.main.temp)}<span class="forecast_unit">${this.unitSign()[1]}</span></span>
          <span class="forecast_clouds"><i class="fa fa-soundcloud"></i> ${item.clouds.all}%,</span> 
          <span class="forecast_wind"><i class="fas fa-wind"></i> ${item.wind.speed}${this.unitSign()[0]},</span>
          <span class="forecast_humid"><i class="fa fa-tint"></i> ${item.main.humidity}%,</span>
          <span class="forecast_press"><i cass="fa fa-tachometer"></i> ${Math.floor(item.main.pressure)}hPa</span>
        </td>
      </tr>`;
      });
    });
  }

  /**
   * Error popups
   *
   */
  popErrs() {
    const message = document.querySelector(".city_err");
    message.style.display = "block";
    setTimeout(() => (message.style.display = "none"), 2000);
  }
}
export const ui = new UI();
