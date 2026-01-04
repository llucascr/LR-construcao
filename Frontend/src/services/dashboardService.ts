import { api } from './api';
import type { DrillingRecentResponseDTO } from '../types';

export const dashboardService = {
    getTotalDrillingMonth: async () => {
        const response = await api.get<number>('/dashboard/totalDrillingMonth');
        return response.data;
    },
    getMonthlyRevenue: async () => {
        const response = await api.get<number>('/dashboard/monthlyRevenue');
        return response.data;
    },
    getTotalPaidBuildMonth: async () => {
        const response = await api.get<number>('/dashboard/totalPaidBuildMonth');
        return response.data;
    },
    getTotalClients: async () => {
        const response = await api.get<number>('/dashboard/totalClients');
        return response.data;
    },
    findDrillingRecent: async () => {
        const response = await api.get<DrillingRecentResponseDTO[]>('/dashboard/drillingRecent');
        return response.data;
    }
};
