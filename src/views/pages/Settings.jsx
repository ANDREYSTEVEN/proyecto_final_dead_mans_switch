import React, { useState } from 'react';
import { getCurrentUser, updatePassword, destroySessions, logoutUser } from '../../controllers/userController';
import { broadcastAllSwitches } from '../../controllers/switchController';
import { useToast } from '../components/ToastContext';

export default function Settings() {
  const user = getCurrentUser();
  const addToast = useToast();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '' });

  const handleUpdatePassword = async (e) => {
      e.preventDefault();
      if (!passwords.current || !passwords.new) {
          addToast("Ambos campos son requeridos.", "error");
          return;
      }
      try {
          await updatePassword(passwords.current, passwords.new);
          addToast("Contraseña Maestra Actualizada Exitosamente. Las demás sesiones caducarán.", "success");
          setPasswords({ current: '', new: '' });
          setShowPasswordModal(false);
      } catch (e) {
          addToast(e.message || "Fallo al actualizar clave.", "error");
      }
  };

  const handleDestroySessions = async () => {
      if (!window.confirm("⚠️ ADVERTENCIA: Esto invalidará todos los tokens de acceso activos globalmente. Tú también serás desconectado en este instante y deberás reloguearte. ¿Proceder?")) return;
      try {
          await destroySessions();
          addToast("Sesiones Globales Destruidas. Hasta pronto.", "success");
          logoutUser();
          window.location.href = '/login';
      } catch (e) {
          addToast(e.message, "error");
      }
  };

  const handleBroadcast = async () => {
      if (!window.confirm("☠️ PELIGRO: Esto marcará TODOS tus interruptores activos como EXPIRADOS inmediatamente y enviará los correos con todos tus secretos de forma irreversible a tus contactos. ¿ESTÁS SEGURO?")) return;
      try {
          const res = await broadcastAllSwitches();
          addToast(res.message, "success");
      } catch (e) {
          addToast(e.message, "error");
      }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Configuración de Usuario</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Gestión de cuenta y controles manuales de emergencia global.
        </p>
      </header>

      <div className="glass-panel" style={{ marginBottom: '24px' }}>
         <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>
             Perfil Activo
         </h3>
         <p style={{ marginBottom: '16px' }}><strong>Email de Identidad: </strong> {user?.user || "Desconocido"}</p>
         
         {!showPasswordModal ? (
             <button onClick={() => setShowPasswordModal(true)} className="btn-neon" style={{ borderColor: 'var(--neon-blue)', color: 'var(--neon-blue)' }}>Actualizar Contraseña</button>
         ) : (
             <form onSubmit={handleUpdatePassword} style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '8px', border: '1px solid var(--neon-blue)', marginTop: '15px' }}>
                 <input 
                     type="password" 
                     placeholder="Contraseña Actual" 
                     value={passwords.current}
                     onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                     style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', background: 'rgba(0,0,0,0.8)', color: 'white', border: '1px solid #555' }}
                 />
                 <input 
                     type="password" 
                     placeholder="Nueva Contraseña" 
                     value={passwords.new}
                     onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                     style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', background: 'rgba(0,0,0,0.8)', color: 'white', border: '1px solid #555' }}
                 />
                 <div style={{ display: 'flex', gap: '10px' }}>
                     <button type="submit" className="btn-neon" style={{ flex: 1, borderColor: 'var(--neon-blue)', color: 'var(--neon-blue)' }}>Confirmar Cambio</button>
                     <button type="button" onClick={() => setShowPasswordModal(false)} style={{ flex: 1, background: 'transparent', color: '#aaa', border: '1px solid #555', borderRadius: '4px' }}>Cancelar</button>
                 </div>
             </form>
         )}
      </div>

      <div className="glass-panel">
         <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '24px', color: 'var(--neon-red)' }}>
            Zonas de Peligro (Operación Manual)
         </h3>
         <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
             Acciones de contingencia que se ejecutan inmediatamente bajo tu orden sin esperar tiempos del cron job.
         </p>

         <div style={{ display: 'flex', gap: '16px', flexDirection: 'column', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,0,0,0.05)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.2)' }}>
                <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#ffb3b3' }}>Destruir Sesiones de Navegadores</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>Cerrará forzosamente todas las sesiones abiertas en todos tus dispositivos.</p>
                </div>
                <button onClick={handleDestroySessions} style={{ background: 'transparent', border: '1px solid var(--neon-red)', color: 'var(--neon-red)', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Ejecutar</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,0,0,0.05)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.2)' }}>
                <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#ffb3b3' }}>Transmisión de Alerta (Botón Rojo)</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>Disparará prematuramente todos tus interruptores activos y enviará los correos.</p>
                </div>
                <button onClick={handleBroadcast} style={{ background: 'var(--neon-red)', border: 'none', color: 'black', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Detonar Broadcast</button>
            </div>
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
                        const session = JSON.parse(localStorage.getItem('dms_session'));
                        const r = await fetch('http://localhost:5000/api/auth/panic', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.token}` },
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
