import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createSwitch, updateSwitch, getSwitchById } from '../../controllers/switchController';
import { getVaultItems } from '../../controllers/vaultController';
import { useToast } from '../components/ToastContext';

export default function CreateSwitch() {
  const navigate = useNavigate();
  const { id } = useParams();
  const addToast = useToast();
  
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    alertEmail: '',
    days: 0,
    hours: 24,
    minutes: 0,
    vaultItemIds: []
  });
  
  const [vaultItems, setVaultItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchData = async () => {
         try {
             // Cargar Bóvedas
             const vaults = await getVaultItems();
             setVaultItems(vaults);

             if (isEditing) {
                 const sw = await getSwitchById(id);
                 if (sw) {
                     // Calcular d, h, m basado en la latencia pura (durationMs)
                     const durationMs = sw.durationMs || 86400000;
                     const d = Math.floor(durationMs / 86400000);
                     const h = Math.floor((durationMs % 86400000) / 3600000);
                     const m = Math.floor((durationMs % 3600000) / 60000);
                     
                     const selectedVaults = (sw.vaultItems || []).map(v => v.id.toString());
                     
                     setFormData({ 
                         name: sw.name, 
                         alertEmail: sw.alertEmail, 
                         days: d, 
                         hours: h, 
                         minutes: m,
                         vaultItemIds: selectedVaults
                     });
                 } else {
                     addToast("El Switch solicitado no existe", "error");
                     navigate('/');
                 }
             }
         } catch (e) {
             addToast(e.message, "error");
         } finally {
             setLoading(false);
         }
     };
     fetchData();
  }, [id, navigate, addToast, isEditing]);

  const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
  };

  const handleVaultToggle = (vaultId) => {
      setFormData(prev => {
          const isSelected = prev.vaultItemIds.includes(vaultId.toString());
          let newIds;
          if (isSelected) {
              newIds = prev.vaultItemIds.filter(vId => vId !== vaultId.toString());
          } else {
              newIds = [...prev.vaultItemIds, vaultId.toString()];
          }
          return { ...prev, vaultItemIds: newIds };
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(formData.days) === 0 && Number(formData.hours) === 0 && Number(formData.minutes) === 0) {
        addToast("El temporizador no puede ser cero.", "error");
        return;
    }
    
    setLoading(true);
    try {
        if (isEditing) {
            await updateSwitch(id, formData);
            addToast("Interruptor actualizado exitosamente.", "success");
        } else {
            await createSwitch(formData);
            addToast("Nuevo interruptor enlazado a la red.", "success");
        }
        navigate('/');
    } catch(e) {
        addToast(e.message, "error");
        setLoading(false);
    }
  };

  return (
    <div className="section-container" style={{ maxWidth: '700px', margin: '0 auto', width: '100%', animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>{isEditing ? 'Modificar Protocolo' : 'Crear Nuevo Interruptor'}</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          {isEditing ? 'Edita los parámetros de supervivencia de este switch.' : 'Configura un nuevo Dead Man\'s Switch.'}
        </p>
      </header>

      {loading ? (
          <h2 style={{ color: 'var(--neon-blue)', textAlign: 'center' }}>Sincronizando sistemas...</h2>
      ) : (
      <form className="glass-panel" onSubmit={handleSubmit}>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>Nombre del Interruptor</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej. Bóveda Fuerte" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white'}} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>Correo de Rescate / Emisor</label>
          <input type="email" name="alertEmail" value={formData.alertEmail} onChange={handleChange} required placeholder="familiar@correo.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white'}} />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>Temporizador de Vida (Check-in Deadline)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <div>
                  <label style={{display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px'}}>Días</label>
                  <input type="number" name="days" value={formData.days} onChange={handleChange} min="0" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neon-blue)', background: 'rgba(0,0,0,0.5)', color: 'var(--neon-blue)', textAlign: 'center', fontWeight: 'bold'}} />
              </div>
              <div>
                  <label style={{display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px'}}>Horas</label>
                  <input type="number" name="hours" value={formData.hours} onChange={handleChange} min="0" max="23" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neon-blue)', background: 'rgba(0,0,0,0.5)', color: 'var(--neon-blue)', textAlign: 'center', fontWeight: 'bold'}} />
              </div>
              <div>
                  <label style={{display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px'}}>Minutos</label>
                  <input type="number" name="minutes" value={formData.minutes} onChange={handleChange} min="0" max="59" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neon-blue)', background: 'rgba(0,0,0,0.5)', color: 'var(--neon-blue)', textAlign: 'center', fontWeight: 'bold'}} />
              </div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem', padding: '15px', background: 'rgba(255,0,0,0.05)', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.2)' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: 'var(--neon-red)' }}>📦 Adjuntar Secretos de Bóveda</label>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '15px' }}>Selecciona qué archivos clasificados se liberarán por correo si este interruptor explota.</p>
            {vaultItems.length === 0 ? (
                <div style={{ fontStyle: 'italic', color: '#555' }}>No tienes archivos en tu bóveda.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto', paddingRight: '5px' }}>
                    {vaultItems.map(item => (
                        <label key={item.id} style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', border: formData.vaultItemIds.includes(item.id.toString()) ? '1px solid var(--neon-red)' : '1px solid transparent', transition: 'all 0.2s' }}>
                            <input 
                                type="checkbox" 
                                checked={formData.vaultItemIds.includes(item.id.toString())}
                                onChange={() => handleVaultToggle(item.id)}
                                style={{ marginRight: '15px', width: '18px', height: '18px', accentColor: '#ef4444' }}
                            />
                            <span style={{ color: 'white', fontWeight: '500' }}>{item.title}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button type="button" className="btn-neon" onClick={() => navigate('/')} style={{ borderColor: 'var(--text-secondary)', color: 'var(--text-secondary)', flexGrow: 1 }}>
            Cancelar Operación
          </button>
          <button type="submit" className="btn-neon btn-neon-green" disabled={loading} style={{ flexGrow: 1 }}>
            {isEditing ? 'Forzar Sobrescritura' : 'Guardar y Activar Protocolo'}
          </button>
        </div>
      </form>
      )}
    </div>
  );
}
