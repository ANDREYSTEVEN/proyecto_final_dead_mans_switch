/**
 * userController.js
 * Simula procesos de inicio de sesión utilizando localStorage.
 */

// Retorna null si no hay sesión, o los datos básicos si está activo
export const getCurrentUser = () => {
    const session = localStorage.getItem('dms_session');
    if (!session) return null;
    return JSON.parse(session);
}

// Simula la llamada a Railway para logear. 
// Validará siempre a true si el correo y password no están vacíos
export const loginUser = async (email, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email && password.length >= 4) {
                const fakeToken = { 
                    user: email, 
                    token: "mock_jwt_as2342df23sfsdf",
                    generatedAt: Date.now()
                };
                localStorage.setItem('dms_session', JSON.stringify(fakeToken));
                resolve(fakeToken);
            } else {
                reject(new Error("Credenciales inválidas"));
            }
        }, 800);
    });
}

// Cerrar sesión
export const logoutUser = () => {
    localStorage.removeItem('dms_session');
}
