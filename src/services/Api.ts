import axios from "axios";

const api = axios.create({
  baseURL: "http://89.169.183.192:8080",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
