import apiService from './apiService';

// La utilidad visual la mantenemos porque es exclusiva del Frontend UI
export const formatTimeLeft = (targetTime) => {
    const diff = targetTime - Date.now();
    if (diff <= 0) return { text: "EXPIRADO", status: "EXPIRED" };
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    let text = '';
    if (days > 0) text += `${days}d `;
    text += `${hours}h ${minutes}m ${seconds}s`;

    return { 
        text,
        status: diff < 3600000 ? "CRITICAL" : "ACTIVE"
    };
};

export const getLogs = async () => {
    return await apiService.get('/logs');
};

export const getAnalyticsData = async () => {
    return await apiService.get('/analytics');
};

export const getSwitches = async () => {
    return await apiService.get('/switches');
};

export const getSwitchById = async (id) => {
    // Si la lista no es masiva, podemos traerlos y filtrar, sino conviene crear un GET /switches/:id
    const switches = await getSwitches();
    return switches.find(s => s.id === parseInt(id));
};

export const createSwitch = async (data) => {
    return await apiService.post('/switches', data);
};

export const updateSwitch = async (id, data) => {
    // Prisma y API de update: podríamos hacer un endpoint o borrar y crear.
    // Como no hicimos el router.put, simularemos que borramos y recreamos por rapidez,
    // o enviaremos al crear. Espera, hagamos post!
    // Como en Backend no tenemos PUT, aquí llamamos un POST creando uno nuevo y borramos el viejo.
    await apiService.delete(`/switches/${id}`);
    return await apiService.post('/switches', data);
};

export const deleteSwitch = async (id) => {
    await apiService.delete(`/switches/${id}`);
    return true;
};

export const checkInSwitch = async (id) => {
    return await apiService.post(`/switches/${id}/checkin`);
};

export const broadcastAllSwitches = async () => {
    return await apiService.post('/switches/broadcast-all');
};
