import axios from "axios";

const baseURL = "https://localhost:5000";
// const baseURL = "https://api.reid-avenue.tk";

export const apiInstance = axios.create({
  baseURL: baseURL,
});

apiInstance.defaults.withCredentials = true;
