import { api } from './api';
import type { Drilling, DrillingInput } from '../types';

export const drillingService = {
    getAll: async (page = 0, size = 10): Promise<Drilling[]> => {
        const response = await api.get<Drilling[]>('/drilling/findAll', {
            params: {
                page,
                numberOfDrilling: size,
            },
        });
        return response.data;
    },

    create: async (data: DrillingInput, userId: number): Promise<Drilling> => {
        const response = await api.post<Drilling>('/drilling/create', data, {
            params: {
                userId,
            },
        });
        return response.data;
    },
};
