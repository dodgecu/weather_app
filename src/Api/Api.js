/**
 * @param { string } city (constructor)
 * @param { string } unit (constructor)
 * openweathermap.org api calls
 *
 */

class Weather {
  constructor(city, unit, id) {
    this.apiKey = "89d6c76fa5a8f6b08d8ec01b6ad1d355";
    this.base = "https://api.openweathermap.org/";
    this.city = city;
    this.unit = unit;
    this.id = id;
  }

  /**
   * Search by %like param
   *
   */
  async searchAccuracy() {
    const response = await fetch(
      `${this.base}data/2.5/find?q=${this.city}&type=like&cnt=5&APPID=${
      this.apiKey
      }`
    );
    return await response.json();
  }

  /**
   * Get current weather data
   *
   */

  async getCurrentByID() {
    const response = await fetch(
      `${this.base}data/2.5/weather?id=${this.id}&units=${this.unit}&APPID=${
      this.apiKey
      }`
    );
    return await response.json();
  }

  /**
   * Get forecast
   *
   */
  async getForecastByCity() {
    const response = await fetch(
      `${this.base}data/2.5/forecast?id=${this.id}&units=${this.unit}&APPID=${
      this.apiKey
      }`
    );
    return await response.json();
  }

  /**
   * Get current weather by coordinates
   *
   */
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

  /**
   *
   * @param {string} city
   * @param {number} id
   */
  changeLocation(city, id) {
    this.city = city;
    this.id = id;
  }

  /**
   *
   * @param { string } unit
   */
  changeUnit(unit) {
    this.unit = unit;
  }
}

export const api = new Weather("London", "metric", 2643743);
