import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SHIP_ROCKET_URL = process.env.NEXT_PUBLIC_SHIP_ROCKET_URL;
// const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const axiosShipRocket = axios.create({
  baseURL: SHIP_ROCKET_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
