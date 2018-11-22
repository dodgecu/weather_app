import { api } from "./api";

api.getByCoordinates().then(data => console.log(data));
api.getByID().then(data => console.log(data));
