import { api } from './api';
import type { Drilling, DrillingInput, Page, PaymentStatus } from '../types';

export const drillingService = {
    getAll: async (page = 0, size = 10): Promise<Page<Drilling> | Drilling[]> => {
        const response = await api.get<Page<Drilling> | Drilling[]>('/drilling/findAll', {
            params: {
                page,
                numberOfDrilling: size, // Keeping original param name if that's what backend expects
            },
        });
        return response.data; // The component handles array or Page structure
    },

    create: async (data: DrillingInput, userId: number): Promise<Drilling> => {
        const response = await api.post<Drilling>(`/drilling/create?userId=${userId}`, data);
        return response.data;
    },

    update: async (data: DrillingInput, drillingId: number): Promise<Drilling> => {
        const response = await api.put<Drilling>(`/drilling/update`, data, {
            params: {
                drillingId,
            }
        });
        return response.data;
    },

    changeStatus: async (status: PaymentStatus, drillingId: number) => {
        const response = await api.put(`/drilling/changeStatus`, null, {
            params: {
                status,
                drillingId
            }
        });
        return response.data;
    }
};
