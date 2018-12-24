class Storage {
    constructor() {
        this.city;
        this.id;
        this.unit;
        this.defaultCity = "Miami";
        this.defaultId = 4164138;
        this.defaultUnit = "metric";
    }

    getLocationData() {
        if (localStorage.getItem('city') === null) {
            this.city = this.defaultCity;
        } else {
            this.city = localStorage.getItem('city');
        }
        if (localStorage.getItem('unit') === null) {
            this.unit = this.defaultUnit;
        } else {
            this.unit = localStorage.getItem('unit');
        }
        if (localStorage.getItem('id') === null) {
            this.id = this.defaultId;
        } else {
            this.id = localStorage.getItem('id');
        }
        return {
            city: this.city,
            unit: this.unit,
            id: this.id
        }
    }

    setLocationData(city, id, unit) {
        localStorage.setItem("city", city);
        localStorage.setItem("id", id);
        localStorage.setItem("unit", unit);
    }
}
export const storage = new Storage();