import { api } from './api';
import type { Client, ClientInput, Page } from '../types';

export const clientService = {
    getClients: async (page = 0, size = 10): Promise<Page<Client>> => {
        const response = await api.get<Page<Client>>(`/client/findAll`, {
            params: {
                page,
                numberOfClients: size
            }
        });
        return response.data;
    },

    create: async (client: ClientInput): Promise<Client> => {
        const response = await api.post<Client>('/client/create', client);
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
