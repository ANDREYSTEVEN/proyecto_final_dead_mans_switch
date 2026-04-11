import apiService from './apiService';

export const getVaultItems = async () => {
    return await apiService.get('/vault');
};

export const createVaultItem = async (data) => {
    return await apiService.post('/vault', data);
};

export const deleteVaultItem = async (id) => {
    return await apiService.delete(`/vault/${id}`);
};
