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
    this.days = {
      first: document.querySelector(".first_day"),
      scnd: document.querySelector(".scnd_day"),
      thrd: document.querySelector(".thrd_day"),
      frth: document.querySelector(".frth_day"),
      ffth: document.querySelector(".ffth_day")
    };
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
    const getTime = time
      .toUTCString()
      .split(" ")
      .filter((_, i) => i === 4);
    const getDate = time
      .toUTCString()
      .split(" ")
      .slice(0, 4);
    if (dateTime) {
      return `${getDate.join(" ")}`;
    }
    if (!dateTime) {
      return `${getTime.toString()}`;
    }
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
    const objData = [data];
    const weather = objData.map(el => el.weather);
    document.querySelector(".days-tab").style.display = "none";
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
    const objData = [data];
    this.icon.innerHTML = "";
    this.details.innerHTML = "";
    this.main_temp.innerHTML = `<h3>5 Day</h3>`;
    this.sec_data.innerHTML = `<h5>3 Hour Forecast</h5>`;
    document.querySelector(".days-tab").style.display = "flex";
    objData.map(
      location =>
        (this.city.innerHTML = `${location.city.name}, ${
          location.city.country
          }`)
    );
    const weatherList = objData.map(date => date.list);
    const dayCount = weatherList[0]
      .map(element => element.dt_txt)
      .map(time => time.split(" ").filter((_, i) => i !== 1))
      .reduce((acc, iterator) => acc.concat(iterator), [])
      .reduce((prev, curr) => {
        prev[curr] ? prev[curr]++ : (prev[curr] = 1);
        return prev;
      }, {});
    const countedDays = Object.values(dayCount);
    const today = weatherList[0].slice(0, countedDays[0]),
      tomorrow = weatherList[0].slice(today.length, today.length + countedDays[1]),
      thirdDay = weatherList[0].slice(tomorrow.length + today.length, tomorrow.length + today.length + countedDays[2]),
      fourthDay = weatherList[0].slice(tomorrow.length * 2 + today.length, tomorrow.length * 2 + today.length + countedDays[3]),
      fifthDay = weatherList[0].slice(tomorrow.length * 3 + today.length, tomorrow.length * 3 + today.length + countedDays[4]),
      sixthDay = weatherList[0].slice(tomorrow.length * 4 + today.length, tomorrow.length * 4 + today.length + countedDays[5]);

    tomorrow.map(day => this.days.first.textContent = this.timeStamp(day.dt, true));
    thirdDay.map(day => this.days.scnd.textContent = this.timeStamp(day.dt, true));
    fourthDay.map(day => this.days.thrd.textContent = this.timeStamp(day.dt, true));
    fifthDay.map(day => this.days.frth.textContent = this.timeStamp(day.dt, true));
    sixthDay.map(day => this.days.ffth.textContent = this.timeStamp(day.dt, true));

    this.renderForecast(today);
    this.days.first.addEventListener("click", () => {
      this.renderForecast(tomorrow);
      this.days.first.parentNode.classList.add('active');
    });
    this.days.scnd.addEventListener("click", () => {
      this.renderForecast(thirdDay);
      this.days.scnd.parentNode.classList.add('active');
    });
    this.days.thrd.addEventListener("click", () => {
      this.renderForecast(fourthDay);
      this.days.thrd.parentNode.classList.add('active');
    });
    this.days.frth.addEventListener("click", () => {
      this.renderForecast(fifthDay);
      this.days.frth.parentNode.classList.add('active');
    });
    this.days.ffth.addEventListener("click", () => {
      this.renderForecast(sixthDay);
      this.days.ffth.parentNode.classList.add('active');
    });
  }


  /**
   * @param {array} foreCastData
   *
   */
  renderForecast(foreCastData) {
    this.details.innerHTML = "";
    for (let node in this.days) {
      this.days[node].parentNode.classList.remove("active");
    }
    foreCastData.forEach(item => {
      const icon = item.weather.map(i => `<img src='//openweathermap.org/img/w/${i.icon}.png'>`);
      this.details.innerHTML += `
        <tr>
        <th class="main-row" scope="row">
        <span class="forecast_time">${this.timeStamp(item.dt, false)}</span>
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
  }


  /**
   * Error popups
   *,
   */
  popErrs() {
    const message = document.querySelector(".city_err");
    message.style.display = "block";
    setTimeout(() => (message.style.display = "none"), 2000);
  }
}
export const ui = new UI();
