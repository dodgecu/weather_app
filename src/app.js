import { api } from "./api";

//api.getByCoordinates().then(data => console.log(data));
//api.getCurrentByID().then(data => console.log(data));
api.getForecastByCoordinates().then(data => console.log(data));
