import React, { useState, useEffect } from 'react';
import { getVaultItems, createVaultItem, deleteVaultItem } from '../../controllers/vaultController';
import { verifySystemPassword } from '../../controllers/userController';
import { useToast } from '../components/ToastContext';
import CryptoJS from 'crypto-js';

export default function Vault() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const addToast = useToast();

  const [formData, setFormData] = useState({ title: '', content: '', pin: '' });
  const [visibleState, setVisibleState] = useState({});
  const [promptKeys, setPromptKeys] = useState({});
  const [decryptedContents, setDecryptedContents] = useState({});
  const [isKeySet, setIsKeySet] = useState(false);
  const [keyInput, setKeyInput] = useState('');

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

  // Efecto que se corre al desbloquear
  useEffect(() => {
    if (isKeySet) {
        loadItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKeySet]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
        addToast('Faltan datos por inyectar.', 'error');
        return;
    }
    if (!formData.pin) {
        addToast('Agrega un PIN específico a este paquete para encriptarlo.', 'error');
        return;
    }
    
    // Client-side AES Zero-Knowledge Encryption INDIVIDUAL Por PIN
    const cipherText = CryptoJS.AES.encrypt(formData.content, formData.pin).toString();

    try {
        await createVaultItem({ title: formData.title, content: cipherText });
        addToast('Dato Criptográfico Almacenado Seguramente', 'success');
        setFormData({ title: '', content: '', pin: '' });
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
        
        // Limpiar RAM
        const newDecrypted = { ...decryptedContents };
        delete newDecrypted[id];
        setDecryptedContents(newDecrypted);
        
        loadItems();
    } catch (e) {
        addToast(e.message, 'error');
    }
  };

  const handleVisibilityClick = (id) => {
      if (visibleState[id] === 'visible') {
          // Si lo opaca, borramos de RAM inmediatamente
          const newDecrypted = { ...decryptedContents };
          delete newDecrypted[id];
          setDecryptedContents(newDecrypted);
          setVisibleState({...visibleState, [id]: 'blurred'});
      } else {
          setVisibleState({...visibleState, [id]: 'prompt'});
      }
  };

  const handleRevealAttempt = (item) => {
      const id = item.id;
      const attemptPin = promptKeys[id];
      if (!attemptPin) return;

      try {
          const bytes = CryptoJS.AES.decrypt(item.content, attemptPin);
          const originalText = bytes.toString(CryptoJS.enc.Utf8);
          
          if (originalText) {
              setDecryptedContents({...decryptedContents, [id]: originalText});
              setVisibleState({...visibleState, [id]: 'visible'});
              addToast('Firma Validada. Revelando RAM local.', 'success');
          } else {
              throw new Error("Malformed UTF8");
          }
      } catch (e) {
          addToast('Firma Incorrecta. Protección Mantenida.', 'error');
      }
      setPromptKeys({...promptKeys, [id]: ''}); // Reset attempt
  };

  const handleClearKey = () => {
      setVisibleState({});
      setPromptKeys({});
      setDecryptedContents({}); // Amnesia absoluta en RAM
      setIsKeySet(false);
      setKeyInput('');
      setItems([]);
      addToast('RAM Depurada. Bóveda Bloqueada.', 'info');
  };

  const handleSetKey = async (e) => {
      e.preventDefault();
      try {
          await verifySystemPassword(keyInput);
          setIsKeySet(true);
          addToast("Autorización Concedida. Entrando a Bóveda.", "success");
      } catch (e) {
          addToast(e.message || "Contraseña rechazada.", "error");
      }
  };

  if (!isKeySet) {
      return (
          <div key="locked-vault" className="section-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                  <h1 style={{ color: 'var(--neon-red)' }}>🔐 Búnker de Archivos Ultra-Secretos</h1>
                  <p style={{ color: '#aaa', marginBottom: '30px' }}>Por seguridad, ingresa tu Contraseña Actual de Sistema para acceder a las cajas de la Bóveda.</p>
                  
                  <form onSubmit={handleSetKey} style={{ maxWidth: '400px', margin: '0 auto' }}>
                      <input 
                          type="password" 
                          value={keyInput}
                          onChange={(e) => setKeyInput(e.target.value)}
                          placeholder="Contraseña Actual de Sistema..."
                          style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid var(--neon-red)', background: 'rgba(0,0,0,0.8)', color: 'white', marginBottom: '20px', textAlign: 'center', letterSpacing: '2px' }}
                      />
                      <button className="btn-neon" style={{ width: '100%', borderColor: 'var(--neon-red)', color: 'var(--neon-red)' }}>
                          Desbloquear Interfaz Visual
                      </button>
                  </form>
              </div>
          </div>
      );
  }

  return (
    <div key="unlocked-vault" className="section-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '28px' }}>🔐</span> Archivos Ultra-Secretos
          </h1>
          <button onClick={handleClearKey} style={{ background: 'transparent', border: '1px solid #555', color: '#aaa', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
              Bloquear Vista de Inmediato
          </button>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
          Tus datos súper secretos. Esta arquitectura AES no utiliza una clave maestra. Asigna un PIN Destructor único por cada caja para la máxima separación. Si cambias de pestaña, la RAM local incinerará los descifrados.
      </p>

      <div className="glass-panel" style={{ marginBottom: '40px', borderLeft: '4px solid var(--neon-red)' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '20px', color: 'var(--neon-red)' }}>Añadir Nuevo Protocolo Secreto</h2>
          <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Identificador del Paquete (Público)</label>
                  <input 
                      type="text" 
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Ej: Acceso a Bóveda Crypto o Testamento Familiar" 
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,100,100,0.3)', background: 'rgba(0,0,0,0.6)', color: 'white' }}
                  />
              </div>
              <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>PIN Infranqueable (Específico al paquete)</label>
                  <input 
                      type="password" 
                      value={formData.pin} 
                      onChange={(e) => setFormData({...formData, pin: e.target.value})}
                      placeholder="Este PIN será necesario para abrir SOLO este paquete" 
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neon-blue)', background: 'rgba(0,0,0,0.6)', color: 'white' }}
                  />
              </div>
              <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Contenido Clasificado (Cifrado localmente)</label>
                  <textarea 
                      rows="4"
                      value={formData.content} 
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="Cualquier texto aquí no será visto por el servidor. Sólo verá un texto basura Ilegible..." 
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,100,100,0.3)', background: 'rgba(0,0,0,0.6)', color: '#93c5fd', fontFamily: 'monospace' }}
                  />
              </div>
              <button className="btn-neon" style={{ borderColor: 'var(--neon-red)', color: 'var(--neon-red)', textShadow: '0 0 5px var(--neon-red)' }}>
                  Encriptar y Guardar en Nube
              </button>
          </form>
      </div>

      <h2 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '20px' }}>Cajas Fuertes Actuales (Blindadas)</h2>
      
      {loading ? (
          <p>⏳ Escaneando bases de datos en la nube...</p>
      ) : items.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', opacity: 0.6 }}>
              <p>Tu bóveda está vacía u oculta.</p>
          </div>
      ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {items.map(item => {
                  const state = visibleState[item.id] || 'blurred';
                  const isVisible = state === 'visible';
                  const isPrompting = state === 'prompt';
                  const decryptedText = decryptedContents[item.id];

                  return (
                    <div key={item.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, var(--neon-red), transparent)' }}></div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                            {item.title}
                            <button onClick={() => handleVisibilityClick(item.id)} style={{ background: 'none', border: 'none', color: 'var(--neon-blue)', cursor: 'pointer' }}>
                                {isVisible ? '👁️ Bloquear Inmediato' : '🔑 Descifrar Paquete'}
                            </button>
                        </h3>

                        {isPrompting ? (
                             <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
                                 <input 
                                     type="password" 
                                     placeholder="Ingresa PIN del Paquete" 
                                     value={promptKeys[item.id] || ''}
                                     onChange={(e) => setPromptKeys({...promptKeys, [item.id]: e.target.value})}
                                     style={{ padding: '8px', background: 'rgba(0,0,0,0.8)', border: '1px solid var(--neon-blue)', color: 'white', borderRadius: '4px', textAlign: 'center' }} 
                                 />
                                 <div style={{ display: 'flex', gap: '10px' }}>
                                     <button onClick={() => handleRevealAttempt(item)} style={{ flex: 1, background: 'var(--neon-blue)', color: 'black', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Validar</button>
                                     <button onClick={() => handleVisibilityClick(item.id)} style={{ flex: 1, background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
                                 </div>
                             </div>
                        ) : (
                            <p style={{ 
                                color: isVisible ? '#fff' : '#ef4444', 
                                fontSize: '14px', flexGrow: 1, whiteSpace: 'pre-wrap', fontFamily: 'monospace', margin: '0 0 15px 0',
                                filter: isVisible ? 'none' : 'blur(5px)',
                                userSelect: isVisible ? 'auto' : 'none',
                                transition: 'filter 0.3s ease',
                                wordBreak: 'break-all'
                            }}>
                                {isVisible ? decryptedText : item.content}
                            </p>
                        )}
                        
                        <button onClick={() => handleDelete(item.id)} style={{ alignSelf: 'flex-start', background: 'none', border: '1px solid rgba(255,0,0,0.5)', color: '#ef4444', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.background = 'rgba(255,0,0,0.2)'; e.target.style.boxShadow = '0 0 10px red'; }} onMouseOut={(e) => { e.target.style.background = 'none'; e.target.style.boxShadow = 'none'; }}>
                            Destruir Permanentemente
                        </button>
                    </div>
                  );
              })}
          </div>
      )}
    </div>
  );
}
