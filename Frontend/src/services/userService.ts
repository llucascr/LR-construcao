import { api } from './api';
import type { User, Page } from '../types';

export const userService = {
    getUsers: async (page = 0, size = 100): Promise<Page<User>> => {
        try {
            const response = await api.get<Page<User>>('/user/findAll', {
                params: {
                    page,
                    numberOfUsers: size
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching users", error);
            throw error;
        }
    },

    getUserById: async (id: number): Promise<User | null> => {
        try {
            const response = await api.get<User>(`/user/${id}`);
            return response.data;
        } catch (error) {
            return null;
        }
    }
};
