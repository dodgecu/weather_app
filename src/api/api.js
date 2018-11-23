/**
 *
 * openweathermap.org api calls
 *
 */
class Weather {
  constructor(city, unit) {
    this.apiKey = "89d6c76fa5a8f6b08d8ec01b6ad1d355";
    this.base = "https://api.openweathermap.org/";
    this.city = city;
    this.unit = unit;
  }

  // Get current weather data
  async getCurrentByID() {
    const init = await fetch(
        `${this.base}data/2.5/weather?q=${this.city}&APPID=${this.apiKey}`
      ),
      data = await init.json();
    // Convert city into ID to more precise (accoring to API docs: https://openweathermap.org/current)
    const response = await fetch(
      `${this.base}data/2.5/weather?id=${data.id}&units=${this.unit}&APPID=${
        this.apiKey
      }`
    );
    return await response.json();
  }

  // Get current weather by coordinates
  getCoordinates() {
    return new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej);
    });
  }

  getByCoordinates() {
    return this.getCoordinates().then(async data => {
      const response = await fetch(
        `${this.base}data/2.5/weather?lat=${data.coords.latitude}&lon=${
          data.coords.longitude
        }&units=${this.unit}&APPID=${this.apiKey}
      `
      );
      return await response.json();
    });
  }

  // Get forecast
  async getForecastByCity() {
    const init = await fetch(
        `${this.base}data/2.5/forecast?q=${this.city}&APPID=${this.apiKey}`
      ),
      data = await init.json();

    // Convert city into ID to more precise (accoring to API docs: https://openweathermap.org/current)
    const response = await fetch(
      `${this.base}data/2.5/forecast?id=${data.city.id}&units=${
        this.unit
      }&APPID=${this.apiKey}`
    );
    return await response.json();
  }

  // Get forecast by coordinates
  async getForecastByCoordinates() {
    return this.getCoordinates().then(async data => {
      const response = await fetch(
        `${this.base}data/2.5/forecast?lat=${data.coords.latitude}&lon=${
          data.coords.longitude
        }&units=${this.unit}&APPID=${this.apiKey}
      `
      );
      return await response.json();
    });
  }

  // Change location
  changeLocation(city) {
    this.city = city;
  }

  // Change location
  changeUnit(unit) {
    this.unit = unit;
  }
}

export const api = new Weather("London", "metric");
