import { apiService } from '../../shared/services/apiService';

const login = async (credentials: any) => {
  return await apiService.post('Auth/login', credentials);
};

const register = async (data: any) => {
  return await apiService.post('Auth/registro', data);
};

export { login, register };