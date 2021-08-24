const axios = require("axios");

const api = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 1000,
    headers: {'Accept': 'application/json'}
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    error => {
        Promise.reject(error)
    });


export default api;