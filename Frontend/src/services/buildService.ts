import { api } from './api';
import type { Page, BuildResponseDTO, BuildRequestDTO, CreateBuildRequestDTO, TotalPaidResponseDTO } from '../types';


export const buildService = {
    getAll: async (page: number = 0, numberOfBuild: number = 10) => {
        const response = await api.get<BuildResponseDTO[]>(`/build/findAll`, {
            params: {
                page,
                numberOfBuild
            }
        });
        return response.data;
    },

    update: async (data: BuildRequestDTO, buildId: number) => {
        const response = await api.put<BuildResponseDTO>(`/build/update`, data, {
            params: {
                buildId
            }
        });
        return response.data;
    },

    changeStatus: async (statusBuild: string, buildId: number) => {
        const response = await api.put(`/build/changeStatus`, null, {
            params: {
                statusBuild,
                buildId
            }
        });
        return response.data;
    },

    create: async (data: CreateBuildRequestDTO, userId: number | string) => {
        const response = await api.post<BuildResponseDTO>(`/build/create`, data, {
            params: {
                userId
            }
        });
        return response.data;
    },

    addPayment: async (payment: number, buildId: number) => {
        const response = await api.post<TotalPaidResponseDTO>(`/build/addpayment`, null, {
            params: {
                payment,
                buildId
            }
        });
        return response.data;
    }
};
