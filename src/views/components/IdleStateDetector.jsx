import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../controllers/userController';
import { useToast } from './ToastContext';

export default function IdleStateDetector() {
  const navigate = useNavigate();
  const addToast = useToast();
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // Inactividad máxima de 5 minutos (300000ms)
    timerRef.current = setTimeout(() => {
      logoutUser(); // Destruimos sesión
      addToast("Sesión terminada por inactividad. Medida de seguridad aplicada.", "error");
      navigate('/login');
    }, 300000); 
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    
    resetTimer(); // Iniciar la primera vez

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, []);

  return null; // Componente invisible
}
