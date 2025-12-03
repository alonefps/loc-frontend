import axios from 'axios';
import type { Location } from '@/types/location';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const locationsApi = {
  async getAll(): Promise<Location[]> {
    const response = await api.get<Location[]>('/locations');
    return response.data;
  },

  async getById(id: string): Promise<Location> {
    const response = await api.get<Location>(`/locations/${id}`);
    return response.data;
  },

  async create(data: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Promise<Location> {
    const response = await api.post<Location>('/locations', data);
    return response.data;
  },

  async update(id: string, data: Partial<Omit<Location, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Location> {
    const response = await api.put<Location>(`/locations/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/locations/${id}`);
  },
};

export default api;


