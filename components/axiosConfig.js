import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://soulhousing-api.anchorstech.net/api',
});

export default instance;