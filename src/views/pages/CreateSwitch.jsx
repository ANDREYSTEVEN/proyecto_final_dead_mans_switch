import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSwitch } from '../../controllers/switchController';
import { useToast } from '../components/ToastContext';

export default function CreateSwitch() {
  const navigate = useNavigate();
  const addToast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    alertEmail: '',
    durationHours: 24
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await createSwitch(formData);
    setLoading(false);
    addToast("Nuevo interruptor enlazado a la red.", "success");
    navigate('/'); // Vuelve al inicio después de crear
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Crear Nuevo Interruptor</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Configura un nuevo Dead Man's Switch. Será conectado a tu cuenta principal.
        </p>
      </header>

      <form className="glass-panel" onSubmit={handleSubmit}>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Nombre del Interruptor
          </label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ej. Bóveda Fuerte"
            style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid rgba(255,255,255,0.2)', 
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                fontFamily: 'var(--font-primary)'
            }} 
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Correo de Rescate / Emisor
          </label>
          <input 
            type="email" 
            name="alertEmail"
            value={formData.alertEmail}
            onChange={handleChange}
            required
            placeholder="familiar@correo.com"
            style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid rgba(255,255,255,0.2)', 
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                fontFamily: 'var(--font-primary)'
            }} 
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Frecuencia de Check-in (Horas)
          </label>
          <input 
            type="number" 
            name="durationHours"
            value={formData.durationHours}
            onChange={handleChange}
            min="1"
            max="720"
            required
            style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid rgba(255,255,255,0.2)', 
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                fontFamily: 'var(--font-primary)'
            }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
          <button 
             type="button" 
             className="btn-neon" 
             onClick={() => navigate('/')}
             style={{ borderColor: 'var(--text-secondary)', color: 'var(--text-secondary)' }}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-neon btn-neon-green" disabled={loading}>
            {loading ? 'Creando...' : 'Guardar y Activar'}
          </button>
        </div>

      </form>
    </div>
  );
}
