import React, { useState, useEffect } from 'react';
import { getSecurityQuestions, addSecurityQuestion, deleteSecurityQuestion, verifySystemPassword } from '../../controllers/userController';
import { useToast } from '../components/ToastContext';

export default function SecurityQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const addToast = useToast();

  const [isKeySet, setIsKeySet] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  
  const [visibleState, setVisibleState] = useState({});

  const [formData, setFormData] = useState({ question: '', answer: '' });

  const loadQuestions = async () => {
      if(!isKeySet) return;
      setLoading(true);
      try {
          const data = await getSecurityQuestions();
          setQuestions(data);
      } catch(e) {
          addToast("Fallo al verificar el servidor temporal.", "error");
      }
      setLoading(false);
  };

  useEffect(() => {
      loadQuestions();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKeySet]);

  const handleSetKey = async (e) => {
      e.preventDefault();
      try {
          await verifySystemPassword(keyInput);
          setIsKeySet(true);
          addToast("Verificación Biométrica Excepcional Terminada", "success");
      } catch (e) {
          addToast(e.message || "Firma rechazada.", "error");
      }
  };

  const handleClearKey = () => {
      setIsKeySet(false);
      setKeyInput('');
      setQuestions([]);
      setVisibleState({}); // Reset
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.question || !formData.answer) return;
      
      try {
          await addSecurityQuestion(formData.question, formData.answer);
          addToast("Pregunta encriptada en registro temporal.", "success");
          setFormData({ question: '', answer: '' });
          loadQuestions();
      } catch (e) {
          addToast("No se pudo añadir.", "error");
      }
  };

  const handleDelete = async (id) => {
      if(!window.confirm("¿Seguro que quieres destruir este candado MFA?")) return;
      try {
          await deleteSecurityQuestion(id);
          addToast("Destruida irrevocablemente.", "success");
          loadQuestions();
      } catch (e) {
          addToast(e.message, "error");
      }
  };

  const toggleVisibility = (id) => {
      if (visibleState[id] === 'visible') {
          setVisibleState({...visibleState, [id]: 'blurred'});
      } else {
          setVisibleState({...visibleState, [id]: 'visible'});
      }
  };

  if (!isKeySet) {
    return (
        <div key="locked-sq" className="section-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1 style={{ color: 'var(--neon-green)' }}>🗝️ Búnker de Autenticación Múltiple</h1>
                <p style={{ color: '#aaa', marginBottom: '30px' }}>Este nivel controla las preguntas que te bloquean el acceso original. Ingresa tu Contraseña de Login actual para entrar a la bóveda.</p>
                
                <form onSubmit={handleSetKey} style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <input 
                        type="password" 
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Contraseña Actual de Sistema..."
                        style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid var(--neon-green)', background: 'rgba(0,0,0,0.8)', color: 'white', marginBottom: '20px', textAlign: 'center', letterSpacing: '2px' }}
                    />
                    <button className="btn-neon" style={{ width: '100%', borderColor: 'var(--neon-green)', color: 'var(--neon-green)' }}>
                        Confirmar Superusuario
                    </button>
                </form>
            </div>
        </div>
    );
  }

  return (
    <div key="unlocked-sq" className="section-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '28px' }}>🛡️</span> Cuestionarios Aleatorios (2FA)
            </h1>
            <button onClick={handleClearKey} style={{ background: 'transparent', border: '1px solid #555', color: '#aaa', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                Bloquear y Salir
            </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Crea múltiples candados de preguntas cerradas. Al intentar entrar al búnker, el Firewall seleccionará aleatoriamente UNA de estas para autorizarte. Las respuestas guardadas quedan irreversiblemente encriptadas y ni siquiera tú podrás leerlas.
        </p>

        {questions.length < 5 && (
            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255,200,0,0.1)', border: '1px solid orange', color: 'orange', borderRadius: '8px' }}>
                ⚠️ Se recomienda tener mínimo 5 protocolos registrados para una aleatoriedad efectiva. (Tienes {questions.length})
            </div>
        )}

        <div className="glass-panel" style={{ marginBottom: '40px', borderLeft: '4px solid var(--neon-green)' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '20px', color: 'var(--neon-green)' }}>Inyectar Nueva Pregunta Aleatoria</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>La Pregunta Cebo (Visible al atacar)</label>
                    <input 
                        type="text" 
                        value={formData.question} 
                        onChange={(e) => setFormData({...formData, question: e.target.value})}
                        placeholder="Ej: ¿Cuál es la placa de mi primer coche?" 
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(100,255,100,0.3)', background: 'rgba(0,0,0,0.6)', color: 'white' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Respuesta Cerrada</label>
                    <input 
                        type="password"
                        value={formData.answer} 
                        onChange={(e) => setFormData({...formData, answer: e.target.value})}
                        placeholder="Las minúsculas cuentan, sé preciso." 
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(100,255,100,0.3)', background: 'rgba(0,0,0,0.6)', color: '#93c5fd', fontFamily: 'monospace' }}
                    />
                </div>
                <button className="btn-neon" style={{ borderColor: 'var(--neon-green)', color: 'var(--neon-green)', textShadow: '0 0 5px var(--neon-green)' }}>
                    Almacenar Blindaje
                </button>
            </form>
        </div>

        {loading ? (
            <p>⏳ Leyendo configuraciones de firewall...</p>
        ) : questions.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', opacity: 0.6 }}>
                <p>N/A - Firewall Apagado.</p>
            </div>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {questions.map(q => {
                    const isVis = visibleState[q.id] === 'visible';
                    return (
                        <div key={q.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, var(--neon-green), transparent)' }}></div>
                            
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                                <button onClick={() => toggleVisibility(q.id)} style={{ background: 'none', border: 'none', color: 'var(--neon-blue)', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    {isVis ? '👁️ Difuminar' : '👁️ Visualizar Protocolo'}
                                </button>
                            </div>

                            <p style={{ 
                                color: '#aaa', fontSize: '15px', flexGrow: 1, whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: '0 0 15px 0',
                                filter: isVis ? 'none' : 'blur(5px)',
                                userSelect: isVis ? 'auto' : 'none',
                                transition: 'filter 0.3s ease'
                            }}>
                                <strong>PREGUNTA:</strong><br/>{q.question}
                            </p>
                            
                            <button onClick={() => handleDelete(q.id)} style={{ alignSelf: 'flex-start', background: 'none', border: '1px solid rgba(255,0,0,0.5)', color: '#ef4444', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.background = 'rgba(255,0,0,0.2)'; e.target.style.boxShadow = '0 0 10px red'; }} onMouseOut={(e) => { e.target.style.background = 'none'; e.target.style.boxShadow = 'none'; }}>
                                Destruir Pregunta Permanentemente
                            </button>
                        </div>
                    );
                })}
            </div>
        )}
    </div>
  );
}
