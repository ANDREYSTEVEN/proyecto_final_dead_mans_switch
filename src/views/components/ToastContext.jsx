import React, { createContext, useContext, useState, useCallback } from 'react';

// Generador de sonido corto usando la Web Audio API nativa
const playBeep = (type) => {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Configuración sonora basada en el tipo (Éxito agudo, Error grave)
        if (type === 'success') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // Frecuencia alta (Aguda)
            oscillator.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
        } else {
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(300, audioCtx.currentTime); // Frecuencia baja
            oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1);
        }

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); // Volumen suave al inicio
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5); // Fading corto

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (err) {
        console.warn("Audio Context bloqueado por politicas del navegador o fallido", err);
    }
};

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Emitir sonido acompañando a la animación gráfica
    playBeep(type);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000); // 4 segundos en pantalla
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* Contenedor flotante de los Toasts */}
      <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
      }}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{
              background: toast.type === 'success' ? 'var(--bg-card)' : 'rgba(255,51,102,0.9)',
              color: toast.type === 'success' ? 'var(--neon-green)' : '#fff',
              borderLeft: toast.type === 'success' ? '4px solid var(--neon-green)' : '4px solid #fff',
              padding: '16px 24px',
              borderRadius: '8px',
              boxShadow: 'var(--glass-shadow)',
              backdropFilter: 'var(--glass-blur)',
              fontSize: '1rem',
              fontWeight: '600',
              fontFamily: 'var(--font-primary)',
              animation: 'slideInRight 0.4s ease-out forwards'
          }}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
