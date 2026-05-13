import axios from "axios";
import { API_URL } from "@/services/api";

import {
  getAccessToken,
  saveAccessToken,
  deleteAccessToken,
} from "@/services/authStorage";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const publicApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await refreshApi.post("/token/refresh");

        const newAccessToken = response.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Missing refreshed access token");
        }

        await saveAccessToken(newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.log("Refresh failed", refreshError);

        await deleteAccessToken();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
