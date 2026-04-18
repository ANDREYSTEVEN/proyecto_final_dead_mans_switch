import React from 'react';
import { getCurrentUser } from '../../controllers/userController';
import { useToast } from '../components/ToastContext';

export default function Settings() {
  const user = getCurrentUser();
  const addToast = useToast();

  const handleSave = () => {
     addToast("Preferencias del sistema actualizadas.", "success");
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Configuración de Usuario</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Gestión de cuenta y preferencias globales de emergencia.
        </p>
      </header>

      <div className="glass-panel" style={{ marginBottom: '24px' }}>
         <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>
             Perfil Activo
         </h3>
         <p style={{ marginBottom: '16px' }}><strong>Email de Identidad: </strong> {user?.user || "Desconocido"}</p>
         <button className="btn-neon" style={{ borderColor: 'var(--neon-blue)', color: 'var(--neon-blue)' }}>Actualizar Contraseña</button>
      </div>

      <div className="glass-panel">
         <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '24px', color: 'var(--neon-red)' }}>
            Protocolos de Zonas de Peligro
         </h3>
         <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
             Acciones que sucederán globalmente si cualquiera de tus interruptores críticos no son respondidos a tiempo.
         </p>

         <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" defaultChecked /> Destruir Sesiones de Navegadores Activos
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" defaultChecked /> Enviar Broadcast de Alerta a Todos los Contactos
            </label>
         </div>

         <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
             <button onClick={handleSave} className="btn-neon btn-neon-red" style={{ marginBottom: '30px' }}>Guardar Protocolos</button>
         </div>

         <h3 style={{ borderBottom: '1px solid rgba(255,100,100,0.3)', paddingBottom: '12px', marginBottom: '24px', color: 'var(--neon-red)', marginTop: '30px' }}>
            ☠️ Código de Coacción (Protocolo Duress)
         </h3>
         <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
             Si eres forzado a entrar al sistema, utiliza esta Contraseña de Pánico en lugar de tu contraseña normal. El sistema <strong>fingirá un acceso exitoso</strong> y un dashboard normal, pero debajo <strong>disparará de forma inmediata todos tus temporizadores activos a Cero</strong>, enviando los correos y las bóvedas a tus rescatistas sin que el atacante lo note.
         </p>

         <div style={{ display: 'flex', gap: '15px' }}>
            <input 
                type="password" 
                id="panicInput"
                placeholder="Ingresa nueva llave de pánico..." 
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--neon-red)', background: 'rgba(50,0,0,0.5)', color: 'white', letterSpacing: '2px' }}
            />
            <button 
                onClick={async () => {
                    const val = document.getElementById('panicInput').value;
                    if(!val) return;
                    try {
                        const token = localStorage.getItem('token');
                        const r = await fetch('http://localhost:5000/api/auth/panic', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify({ panicPassword: val })
                        });
                        if(r.ok) addToast('Protocolo Duress Activado. Estás protegido.', 'success');
                        else addToast('Fallo al activar el arma de pánico.', 'error');
                        document.getElementById('panicInput').value = '';
                    } catch(e) {
                         addToast('Error de red al fijar protocolo.', 'error');
                    }
                }}
                className="btn-neon" style={{ borderColor: 'var(--neon-red)', color: 'var(--neon-red)', boxShadow: '0 0 10px rgba(255,0,0,0.2)' }}
            >
                Armar Protocolo Mortal
            </button>
         </div>
      </div>
    </div>
  );
}
