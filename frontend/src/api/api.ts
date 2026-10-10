import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
    withCredentials: true
});

let onUnauthorized: ((() => void) | null) = null;

function setUnauthorizedHandler(handler: (() => void) | null) {
    onUnauthorized = handler;
}

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLogin = error.config?.url?.includes('/auth/login');
        if (error.response?.status === 401 && !isLogin) {
            onUnauthorized?.();
        }
        return Promise.reject(error);
    }
);

export { setUnauthorizedHandler };
export default api;
