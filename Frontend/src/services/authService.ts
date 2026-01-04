import axios from 'axios';
import type { AccountCredentialsDTO, TokenDTO } from '../types';

const API_URL = 'http://localhost:8080/api/v1/auth'; // Adjust if your backend port is different

export const signin = async (credentials: AccountCredentialsDTO): Promise<TokenDTO> => {
    const response = await axios.post(`${API_URL}/signin`, credentials);
    console.log('Signin raw response:', response.data);

    // Handle case where backend returns detailed ResponseEntity JSON
    if (response.data && response.data.body) {
        return response.data.body;
    }

    return response.data;
};

export const refreshToken = async (email: string, refreshToken: string): Promise<TokenDTO> => {
    const response = await axios.put(`${API_URL}/refresh`, null, {
        params: { email },
        headers: { Authorization: `Bearer ${refreshToken}` }
    });

    // Handle wrapped response if necessary
    if (response.data && response.data.body) {
        return response.data.body;
    }

    return response.data;
};

