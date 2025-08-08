import axios from 'axios';

const API_BASE_URL = 'https://localhost:7039/api/'; // URL de desarrollo

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    // Adjuntar token de autenticación
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Función para normalizar la respuesta
function normalizeResponse(response: any) {
  // Si la respuesta es paginada
  if (
    response?.data &&
    typeof response.data === 'object' &&
    Array.isArray(response.data.listFind)
  ) {
    return {
      data: response.data.listFind,
      totalRecords: response.data.totalRecords,
      pageNumber: response.data.pageNumber,
      pageSize: response.data.pageSize,
      message: response.data.message ?? 'Operación exitosa',
      success: response.data.success ?? true,
      status: response.status ?? 200,
    };
  }
  // Respuesta normal
  return {
    data: response?.data?.data ?? response?.data ?? null,
    message: response?.data?.message ?? 'Operación exitosa',
    success: response?.data?.success ?? true,
    status: response?.status ?? 200,
  };
}

function normalizeError(error: any) {
  let message = 'Error desconocido';
  let data = null;
  let success = false;
  let status = error.response?.status ?? 500;

  if (error.response?.data) {
    if (typeof error.response.data === 'string') {
      // Si la respuesta es texto plano, usarla como mensaje
      message = error.response.data;
    } else if (error.response.data.error) {
      // Si la respuesta tiene un campo 'error', úsalo como mensaje
      message = error.response.data.error;
    } else {
      message = error.response.data.message || message;
      data = error.response.data.data ?? null;
      success = error.response.data.success ?? false;
    }
  } else if (error.message) {
    message = error.message;
  }

  return {
    data,
    message,
    success,
    status
  };
}

// Exportar el servicio de la API
export const apiService = {
  get: async (endpoint: string, params?: any) => {
    try {
      const response = await api.get(endpoint, { params });
      return normalizeResponse(response);
    } catch (error) {
      return normalizeError(error);
    }
  },
  post: async (endpoint: string, data: any) => {
    try {
      const response = await api.post(endpoint, data);
      return normalizeResponse(response);
    } catch (error) {
      return normalizeError(error);
    }
  },
  put: async (endpoint: string, data: any) => {
    try {
      const response = await api.put(endpoint, data);
      return normalizeResponse(response);
    } catch (error) {
      return normalizeError(error);
    }
  },
  delete: async (endpoint: string, id: string | number) => {
    try {
      const response = await api.delete(`${endpoint}/${id}`);
      return normalizeResponse(response);
    } catch (error) {
      return normalizeError(error);
    }
  },
};