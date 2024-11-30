import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const CRUD = {
  getAll: async (endpoint: string, params = {}) => {
    const response = await api.get(`/${endpoint}/`, { params });
    return response.data;
  },
  getOne: async (endpoint: string, id: number) => {
    const response = await api.get(`/${endpoint}/${id}`);
    return response.data;
  },
  create: async (endpoint: string, data: any) => {
    const response = await api.post(`/${endpoint}/`, data);
    return response.data;
  },
  update: async (endpoint: string, id: number, data: any) => {
    const response = await api.put(`/${endpoint}/${id}`, data);
    return response.data;
  },
  delete: async (endpoint: string, id: number) => {
    const response = await api.delete(`/${endpoint}/${id}`);
    return response.data;
  },
};
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
