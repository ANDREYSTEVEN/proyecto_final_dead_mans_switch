import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createSwitch, updateSwitch, getSwitchById } from '../../controllers/switchController';
import { useToast } from '../components/ToastContext';

export default function CreateSwitch() {
  const navigate = useNavigate();
  const { id } = useParams();
  const addToast = useToast();
  
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    alertEmail: '',
    durationHours: 24
  });
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
     if (isEditing) {
         getSwitchById(id).then(sw => {
             if(sw) {
                 // Convertimos ms restantes a horas para el input de formulario
                 const diff = sw.targetTime - Date.now();
                 const currentHours = Math.max(1, Math.floor(diff / 3600000));
                 setFormData({ name: sw.name, alertEmail: sw.alertEmail, durationHours: currentHours });
             } else {
                 addToast("El Switch solicitado no existe", "error");
                 navigate('/');
             }
             setLoading(false);
         });
     }
  }, [id, navigate, addToast, isEditing]);

  const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isEditing) {
        await updateSwitch(id, formData);
        addToast("Interruptor actualizado exitosamente.", "success");
    } else {
        await createSwitch(formData);
        addToast("Nuevo interruptor enlazado a la red.", "success");
    }
    setLoading(false);
    navigate('/'); 
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>{isEditing ? 'Modificar Protocolo' : 'Crear Nuevo Interruptor'}</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          {isEditing ? 'Edita los parámetros de supervivencia de este switch.' : 'Configura un nuevo Dead Man\'s Switch.'}
        </p>
      </header>

      {loading ? (
          <h2 style={{ color: 'var(--neon-blue)', textAlign: 'center' }}>Cargando datos...</h2>
      ) : (
      <form className="glass-panel" onSubmit={handleSubmit}>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Nombre del Interruptor
          </label>
          <input 
            type="text" name="name" value={formData.name} onChange={handleChange} required
            placeholder="Ej. Bóveda Fuerte"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white'}} 
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Correo de Rescate / Emisor
          </label>
          <input 
            type="email" name="alertEmail" value={formData.alertEmail} onChange={handleChange} required
            placeholder="familiar@correo.com"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white'}} 
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Frecuencia de Check-in (Horas)
          </label>
          <input 
            type="number" name="durationHours" value={formData.durationHours} onChange={handleChange} min="1" max="720" required
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white'}} 
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button type="button" className="btn-neon" onClick={() => navigate('/')} style={{ borderColor: 'var(--text-secondary)', color: 'var(--text-secondary)', flexGrow: 1 }}>
            Cancelar
          </button>
          <button type="submit" className="btn-neon btn-neon-green" disabled={loading} style={{ flexGrow: 1 }}>
            {isEditing ? 'Sobrescribir' : 'Guardar y Activar'}
          </button>
        </div>
      </form>
      )}
    </div>
  );
}
