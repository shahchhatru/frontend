import axios from "axios";
import { API_BASE_URL } from "@/constants";


const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  apiClient.interceptors.request.use(
    (config) => {
      console.log({authtoken:localStorage.getItem("accessToken")})
      const token: string | null = localStorage.getItem("accessToken"); // Or retrieve the token from a more secure place
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  export default apiClient;


