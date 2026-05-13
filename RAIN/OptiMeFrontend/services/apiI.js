import axios from "axios";
import { API_URL } from "@/services/api";

import {
  getAccessToken,
  saveAccessToken,
  deleteAccessToken,
} from "@/services/authStorage";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

const refreshApi = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

api.interceptors.request.use(
  async (config) => {
    console.log("TOKEN that should be gotten", await getAccessToken());
    const token = await getAccessToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

api.interceptors.response.use(
   (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response = await refreshApi.post(
          "/token/refresh"
        );

        const newAccessToken =
          response.data.accessToken;

        console.log("newAccessToken", newAccessToken);

        await saveAccessToken(
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (err) {
        console.log("Refresh failed");

        await deleteAccessToken();

        // logout user here
      }
    }

    return Promise.reject(error);
  }
);

export default api;