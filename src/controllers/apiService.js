import axios from 'axios';

// Configuración global de nuestro cliente Axios usando la variable de entorno
const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores (opcional para el futuro)
apiService.interceptors.response.use(
  (response) => response.data, // Solo devolvemos los datos
  (error) => {
    // Aquí puedes manejar errores globales, ej. si en el futuro usamos JWT
    console.error("API Error: ", error);
    return Promise.reject(error);
  }
);

export default apiService;
