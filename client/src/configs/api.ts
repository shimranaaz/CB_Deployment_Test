import axios from "axios";
import { store } from "../app/store";
import { logout } from "../app/features/authSlice";

// Define the RootState type based on your store structure
interface AuthState {
  token: string | null;
  user: any;
}

interface RootState {
  auth: AuthState;
}

console.log("VITE_BASE_URL:", import.meta.env.VITE_BASE_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const state = store.getState() as RootState;
    const token = state.auth.token || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log("Token expired or invalid");
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);

export default api;