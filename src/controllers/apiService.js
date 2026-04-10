import axios from 'axios';

// Configuración global de nuestro cliente Axios usando la variable de entorno
const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api', // Aseguramos que apunte a Express (4000) o VITE env
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Inyección de Token
apiService.interceptors.request.use((config) => {
    // Buscar la bóveda de sesión
    const session = localStorage.getItem('dms_session');
    if (session) {
        const { token } = JSON.parse(session);
        if (token) {
             // Inyectar JWT
             config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => Promise.reject(error));

// Interceptor de Respuestas
apiService.interceptors.response.use(
  (response) => response.data, 
  (error) => {
    console.error("API Error: ", error.response?.data || error.message);
    const apiException = new Error(error.response?.data?.error || "Error crítico conectando con el servidor");
    return Promise.reject(apiException);
  }
);

export default apiService;
