import axios from "axios";

// Interceptor para añadir el token de autorización a todas las solicitudes
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Obtén el token del almacenamiento local
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
