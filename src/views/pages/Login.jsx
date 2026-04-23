import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, verify2FAUser } from '../../controllers/userController';
import { useToast } from '../components/ToastContext';

export default function Login() {
  const navigate = useNavigate();
  const addToast = useToast();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [step, setStep] = useState('AUTH');
  const [tempToken, setTempToken] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        if (step === '2FA') {
            await verify2FAUser(tempToken, answers);
            addToast(`Verificación de Coerción Múltiple Superada.`, 'success');
            navigate('/');
        } else if (isRegisterMode) {
            await registerUser(formData.email, formData.password);
            addToast(`Identidad Creada. Por favor inicia sesión ahora.`, 'success');
            setIsRegisterMode(false);
        } else {
            const data = await loginUser(formData.email, formData.password);
            if (data.step === '2FA') {
                setStep('2FA');
                setTempToken(data.tempToken);
                setQuestions(data.questions);
                addToast('Contraseña Correcta. Resuelve la barrera de seguridad múltiple.', 'info');
            } else {
                addToast(`Bienvenido/a, acceso asegurado.`, 'success');
                navigate('/');
            }
        }
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
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: step === '2FA' ? 'var(--neon-red)' : 'white' }}>
            {step === '2FA' ? 'Desafío MFA' : (isRegisterMode ? 'Crear Entorno Seguro' : 'Autenticación Crítica')}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            {step === '2FA' ? 'Confirma tu identidad resolviendo este bloqueo.' : (isRegisterMode 
              ? 'Únete a la red y comienza a crear tus temporizadores.' 
              : 'Ingresa tus credenciales para administrar tus interruptores.')}
        </p>
        
        <form onSubmit={handleSubmit}>
          {step === '2FA' ? (
              <div style={{ marginBottom: '1.5rem' }}>
                  {questions.map((q, index) => (
                      <div key={q.id} style={{ marginBottom: '20px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--neon-red)' }}>Pregunta Aleatoria #{index + 1}:</label>
                          <p style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'white', fontStyle: 'italic' }}>"{q.question}"</p>
                          <input 
                              type="password" 
                              required
                              value={answers[q.id] || ''}
                              onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                              placeholder="Tu Respuesta Aquí..."
                              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--neon-red)', background: 'rgba(50,0,0,0.3)', color: 'white' }} 
                          />
                      </div>
                  ))}
              </div>
          ) : (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>Correo Electrónico</label>
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>Clave Encriptada</label>
                  <input 
                    type="password" 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: 'white' }} 
                  />
                </div>
              </>
          )}
          
          <button type="submit" className={`btn-neon ${isRegisterMode && step !== '2FA' ? 'btn-neon-green' : ''}`} style={{ width: '100%', borderColor: step === '2FA' ? 'var(--neon-red)' : (!isRegisterMode ? 'var(--neon-blue)' : undefined), color: step === '2FA' ? 'var(--neon-red)' : (!isRegisterMode ? 'var(--neon-blue)' : undefined) }} disabled={loading}>
            {loading ? 'Procesando Hash...' : (step === '2FA' ? 'Desbloquear Búnker' : (isRegisterMode ? 'Registrar Identidad' : 'Desbloquear Sesión'))}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button 
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
            >
                {isRegisterMode ? '¿Ya tienes un Token? Inicia sesión aquí' : '¿Primer Ingreso? Crea un protocolo nuevo'}
            </button>
        </div>
      </div>
    </div>
  );
}
