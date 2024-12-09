import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/fastapi",
  headers: {
    "Content-Type": "application/json",
  },
});

export const CRUD = {
  getAll: async (endpoint: string, params = {}) => {
    const response = await api.get(`/${endpoint}/`, { params });
    return response.data;
  },
  create: async (endpoint: string, data: unknown) => {
    if (typeof data !== "object" || data === null) {
      throw new Error("Data must be a non-null object");
    }
    const response = await api.post(`/${endpoint}/`, data);
    return response.data;
  },
  update: async (endpoint: string, id: number, data: unknown) => {
    if (typeof data !== "object" || data === null) {
      throw new Error("Data must be a non-null object");
    }
    const response = await api.patch(`/${endpoint}/${id}`, data);
    return response.data;
  },
  delete: async (endpoint: string, id: number) => {
    const response = await api.delete(`/${endpoint}/${id}`);
    return response.data;
  },
  getCount: async (endpoint: string, params = {}) => {
    const response = await api.get(`/count/${endpoint}/`, {params});
    return response.data;
  }
};
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
