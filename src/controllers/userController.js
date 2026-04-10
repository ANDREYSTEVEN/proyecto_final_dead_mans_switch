import apiService from './apiService';

// Retorna null si no hay sesión, o los datos básicos si está activo
export const getCurrentUser = () => {
    const session = localStorage.getItem('dms_session');
    if (!session) return null;
    return JSON.parse(session);
};

export const registerUser = async (email, password) => {
    return await apiService.post('/auth/register', { email, password });
};

export const loginUser = async (email, password) => {
    const data = await apiService.post('/auth/login', { email, password });
    
    // El backend nos retorna { token, user }
    const sessionData = { 
        user: data.user, 
        token: data.token,
        generatedAt: Date.now()
    };
    
    localStorage.setItem('dms_session', JSON.stringify(sessionData));
    return sessionData;
};

// Cerrar sesión
export const logoutUser = () => {
    localStorage.removeItem('dms_session');
};
