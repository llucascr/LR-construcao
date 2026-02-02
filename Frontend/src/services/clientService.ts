import { api } from './api';
import type { Client, ClientInput } from '../types';

export const clientService = {
    getClients: async (page = 0, size = 9): Promise<Client[]> => {
        const response = await api.get<Client[]>(`/client/findAll`, {
            params: {
                page,
                numberOfClients: size
            }
        });
        return response.data;
    },

    create: async (client: ClientInput, userEmail: string): Promise<Client> => {
        console.log(`[clientService] create called with userEmail: ${userEmail}`);
        if (!userEmail) {
            console.error('[clientService] userEmail is missing!');
        }
        // Manually constructing URL to ensure it's sent as query param
        const response = await api.post<Client>(`/client/create?userEmail=${encodeURIComponent(userEmail)}`, client);
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
