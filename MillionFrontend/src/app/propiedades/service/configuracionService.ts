import { apiService } from "../../shared/services/apiService";

const createUser = async (data: any) => {
    return await apiService.post('Auth/registro', data);
};

const getUserById = async (entidadId: string) => {
    return await apiService.post(`Usuarios/GetById`, { entidadId });
};

const updateUser = async (data: any) => {
    // Se espera que data contenga el campo 'id'
    return await apiService.put(`Usuarios/UpdateAsync`, data);
};

const deleteEntidad = async (entidadId: number) => {
    return await apiService.delete('Entidad/delete', `${entidadId}`);
};

export { createUser, getUserById, updateUser, deleteEntidad };