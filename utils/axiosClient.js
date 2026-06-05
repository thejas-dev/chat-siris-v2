import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./authToken";
import { tokenRefreshRoute } from "./ApiRoutes";
import { reconnectSocketWithToken } from "../service/socket";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GATEWAY_BASE,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          tokenRefreshRoute,
          {},
          { withCredentials: true },
        );

        if (data?.accessToken) {
          setAccessToken(data.accessToken);
          reconnectSocketWithToken();
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return client(originalRequest);
        }
      } catch {
        clearAccessToken();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default client;
