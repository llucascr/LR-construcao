import { api } from './api';
import type { AccountCredentialsDTO, TokenDTO } from '../types';

export const signin = async (credentials: AccountCredentialsDTO): Promise<TokenDTO> => {
    const response = await api.post(`/auth/signin`, credentials);
    console.log('Signin raw response:', response.data);

    // Handle case where backend returns detailed ResponseEntity JSON
    if (response.data && response.data.body) {
        return response.data.body;
    }

    return response.data;
};

export const refreshToken = async (email: string, refreshToken: string): Promise<TokenDTO> => {
    const response = await api.put(`/auth/refresh`, null, {
        params: { email },
        headers: { Authorization: `Bearer ${refreshToken}` }
    });

    // Handle wrapped response if necessary
    if (response.data && response.data.body) {
        return response.data.body;
    }

    return response.data;
};

