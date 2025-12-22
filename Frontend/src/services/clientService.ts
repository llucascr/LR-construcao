import { api } from './api';
import type { Client, Page, ClientInput } from '../types';

export const clientService = {
    getClients: async (page = 0, size = 10): Promise<Client[]> => {
        const response = await api.get<Client[]>(`/client/findAll`, {
            params: {
                page,
                numberOfClients: size
            }
        });
        return response.data;
    },

    create: async (client: ClientInput, userId: number): Promise<Client> => {
        const response = await api.post<Client>('/client/create', client, {
            params: {
                userId
            }
        });
        return response.data;
    },

    update: async (client: Partial<ClientInput>, clientId: number): Promise<Client> => {
        const response = await api.put<Client>('/client/update', client, {
            params: {
                clientId
            }
        });
        return response.data;
    }
};
