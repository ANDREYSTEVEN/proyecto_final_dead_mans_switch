import React, { useState, useEffect } from 'react';
import { getVaultItems, createVaultItem, deleteVaultItem } from '../../controllers/vaultController';
import { useToast } from '../components/ToastContext';

export default function Vault() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToast();

  const [formData, setFormData] = useState({ title: '', content: '' });

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await getVaultItems();
      setItems(data);
    } catch (e) {
      addToast(e.message, 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    try {
        await createVaultItem(formData);
        addToast('Dato Criptográfico Almacenado Seguramente', 'success');
        setFormData({ title: '', content: '' });
        loadItems();
    } catch (e) {
        addToast(e.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de destruir permanentemente este registro?")) return;
    try {
        await deleteVaultItem(id);
        addToast('Registro incinerado', 'success');
        loadItems();
    } catch (e) {
        addToast(e.message, 'error');
    }
  };

  return (
    <div className="section-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '28px' }}>🔐</span> Bóveda de Divulgación
          </h1>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
          Tus datos súper secretos (Glosarios, Carteras, Contraseñas, Testamentos). Agrégalos aquí y luego átalos a algún Interruptor para controlar su liberación post-mortem.
      </p>

      <div className="glass-panel" style={{ marginBottom: '40px', borderLeft: '4px solid var(--neon-red)' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '20px', color: 'var(--neon-red)' }}>Añadir Nuevo Protocolo Secreto</h2>
          <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Identificador del Paquete</label>
                  <input 
                      type="text" 
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Ej: Acceso a Bóveda Crypto o Testamento Familiar" 
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,100,100,0.3)', background: 'rgba(0,0,0,0.6)', color: 'white' }}
                  />
              </div>
              <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Contenido Clasificado</label>
                  <textarea 
                      rows="4"
                      value={formData.content} 
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="Cualquier texto pegado aquí será liberado al expirar el interruptor al que lo ates..." 
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,100,100,0.3)', background: 'rgba(0,0,0,0.6)', color: '#93c5fd', fontFamily: 'monospace' }}
                  />
              </div>
              <button className="btn-neon" style={{ borderColor: 'var(--neon-red)', color: 'var(--neon-red)', textShadow: '0 0 5px var(--neon-red)' }}>
                  Encriptar y Guardar
              </button>
          </form>
      </div>

      <h2 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '20px' }}>Reservas Cifradas Actuales</h2>
      
      {loading ? (
          <p>⏳ Desencriptando bóveda...</p>
      ) : items.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', opacity: 0.6 }}>
              <p>Tu bóveda está vacía. No hay secretos resguardados.</p>
          </div>
      ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {items.map(item => (
                  <div key={item.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, var(--neon-red), transparent)' }}></div>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: 'white' }}>{item.title}</h3>
                      <p style={{ color: '#aaa', fontSize: '14px', flexGrow: 1, whiteSpace: 'pre-wrap', fontFamily: 'monospace', margin: '0 0 15px 0' }}>
                          {item.content}
                      </p>
                      <button onClick={() => handleDelete(item.id)} style={{ alignSelf: 'flex-start', background: 'none', border: '1px solid rgba(255,0,0,0.5)', color: '#ef4444', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.background = 'rgba(255,0,0,0.2)'; e.target.style.boxShadow = '0 0 10px red'; }} onMouseOut={(e) => { e.target.style.background = 'none'; e.target.style.boxShadow = 'none'; }}>
                          Destruir
                      </button>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
}
