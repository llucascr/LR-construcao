import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const storedToken = localStorage.getItem('token');
    console.log('Interceptor: Checking for token in localStorage');
    if (storedToken) {
        try {
            const tokenDTO = JSON.parse(storedToken);
            console.log('Interceptor: Parsed tokenDTO', tokenDTO);
            if (tokenDTO.accessToken) {
                config.headers.Authorization = `Bearer ${tokenDTO.accessToken}`;
                console.log('Interceptor: Attached Authorization header');
            } else {
                console.warn('Interceptor: No accessToken found in tokenDTO');
            }
        } catch (error) {
            console.error("Interceptor: Error parsing token", error);
        }
    } else {
        console.warn('Interceptor: No token found in localStorage');
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
