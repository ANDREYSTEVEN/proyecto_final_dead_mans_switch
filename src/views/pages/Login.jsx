import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../controllers/userController';
import { useToast } from '../components/ToastContext';

export default function Login() {
  const navigate = useNavigate();
  const addToast = useToast();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await loginUser(formData.email, formData.password);
        addToast(`Bienvenido/a, acceso asegurado.`, 'success');
        navigate('/'); // Ingreso al Dashboard
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', borderTop: '2px solid var(--neon-blue)' }}>
        <div className="logo" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
           <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--neon-red)', borderRadius: '50%', boxShadow: '0 0 8px var(--neon-red)' }}></div>
           DeadMan<span>Switch</span>
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Autenticación Crítica</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Ingresa tus credenciales para administrar tus interruptores de emergencia.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>Correo de Acceso</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="tu@correo.com"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white' }} 
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>Clave Decifrada</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white' }} 
            />
          </div>
          
          <button type="submit" className="btn-neon" style={{ width: '100%', borderColor: 'var(--neon-blue)', color: 'var(--neon-blue)' }} disabled={loading}>
            {loading ? 'Verificando Hash...' : 'Desbloquear Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
