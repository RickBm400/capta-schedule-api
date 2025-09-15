import axios, { type AxiosInstance } from 'axios';

const _httpInstance: AxiosInstance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default _httpInstance;
