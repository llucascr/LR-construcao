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
            console.log('Interceptor: Parsed tokenDTO keys:', Object.keys(tokenDTO));

            // Robust check for access token in various likely locations
            const token = tokenDTO.accessToken || tokenDTO.token || (tokenDTO.body && tokenDTO.body.accessToken);

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                // console.log('Interceptor: Attached Authorization header'); 
            } else {
                console.error('Interceptor: Token object found but NO accessToken detected!', tokenDTO);
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
