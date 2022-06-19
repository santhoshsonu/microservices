import axios from 'axios';

const axiosClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server
    console.log(`API BASE URL: ${process.env.API_BASE_URL}`)
    return axios.create({
      baseURL: process.env.API_BASE_URL,
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: '/',
    });
  }
};

export default axiosClient;