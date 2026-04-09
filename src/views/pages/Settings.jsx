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
             <button onClick={handleSave} className="btn-neon btn-neon-red">Guardar Protocolos</button>
         </div>
      </div>
    </div>
  );
}
