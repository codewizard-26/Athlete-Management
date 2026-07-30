import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json"
    }
});

// Request interceptor: Automatically inject JWT token into authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Global handling for expired sessions (401) and server errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear invalid session token if unauthorized
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // Only redirect to login if not already on public landing or auth routes
            const currentPath = window.location.pathname;
            if (!["/", "/login", "/register"].includes(currentPath)) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;