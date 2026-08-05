import axios from 'axios';

const api = axios.create({
    baseURL: "http://10.9.65.164:8082/api/",
    headers: {
        "Content-Type": "application/json",
    }
});

export default api;