import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

// ===== API SERVICE =====
export const apiService = {
  async get(endpoint, headers = {}) {
    try {
      const res = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        withCredentials: true // Important: sends cookies
      });
      return res.data;
    } catch (err) {
      console.error(`GET ${endpoint} error:`, err.message);
      if (err.response?.status === 401) {
        console.error('Authentication required');
      }
      return null;
    }
  },
  
  async post(endpoint, data, headers = {}) {
    try {
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        withCredentials: true // Important: sends cookies
      });
      return res.data;
    } catch (err) {
      console.error(`POST ${endpoint} error:`, err.message);
      if (err.response?.status === 401) {
        console.error('Authentication required - you may need to login to the backend');
      }
      throw err;
    }
  },
  
  async put(endpoint, data, headers = {}) {
    try {
      const res = await axios.put(`${API_BASE_URL}${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        withCredentials: true // Important: sends cookies
      });
      return res.data;
    } catch (err) {
      console.error(`PUT ${endpoint} error:`, err.message);
      if (err.response?.status === 401) {
        console.error('Authentication required');
      }
      throw err;
    }
  },
  
  async delete(endpoint, headers = {}) {
    try {
      const res = await axios.delete(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        withCredentials: true // Important: sends cookies
      });
      return res.data;
    } catch (err) {
      console.error(`DELETE ${endpoint} error:`, err.message);
      if (err.response?.status === 401) {
        console.error('Authentication required');
      }
      throw err;
    }
  },
};

// module.exports = apiService;
