import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../../controllers/userController';

export default function ProtectedRoute({ children }) {
    const user = getCurrentUser();

    // Si no hay un token de sesión simulado guardado, bloqueamos y rebotamos a `/login`
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si la sesión existe, permitimos el acceso al componente solicitado
    return children;
}
