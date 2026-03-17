import axios from 'axios';

const api = axios.create({
    // ✅ Use relative path so Nginx handles routing
    baseURL: import.meta.env.VITE_API_URL || '/api/',
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;