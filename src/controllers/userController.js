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
    
    if (data.step === 'SUCCESS') {
        const sessionData = { 
            user: data.user, 
            token: data.token,
            generatedAt: Date.now()
        };
        localStorage.setItem('dms_session', JSON.stringify(sessionData));
    }
    return data; // Puede retornar { step: '2FA', tempToken, question }
};

export const verify2FAUser = async (tempToken, answers) => {
    const data = await apiService.post('/auth/verify-2fa', { tempToken, answers });
    if (data.step === 'SUCCESS') {
        const sessionData = { 
            user: data.user, 
            token: data.token,
            generatedAt: Date.now()
        };
        localStorage.setItem('dms_session', JSON.stringify(sessionData));
    }
    return data;
};

// Cerrar sesión
// Cerrar sesión
export const logoutUser = () => {
    localStorage.removeItem('dms_session');
};

export const getSecurityQuestions = async () => {
    return await apiService.get('/security-questions');
};

export const addSecurityQuestion = async (question, answer) => {
    return await apiService.post('/security-questions', { question, answer });
};

export const deleteSecurityQuestion = async (id) => {
    return await apiService.delete(`/security-questions/${id}`);
};

export const verifySystemPassword = async (password) => {
    return await apiService.post('/auth/verify-password', { password });
};

export const updatePassword = async (currentPassword, newPassword) => {
    return await apiService.post('/auth/update-password', { currentPassword, newPassword });
};

export const destroySessions = async () => {
    return await apiService.post('/auth/destroy-sessions');
};
