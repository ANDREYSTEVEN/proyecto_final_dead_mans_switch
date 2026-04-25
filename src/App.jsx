import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ToastProvider, useToast } from './views/components/ToastContext';
import ProtectedRoute from './views/components/ProtectedRoute';
import ErrorBoundaryPanel from './views/components/ErrorBoundaryPanel';
import IdleStateDetector from './views/components/IdleStateDetector';
import Dashboard from './views/pages/Dashboard';
import CreateSwitch from './views/pages/CreateSwitch';
import Login from './views/pages/Login';
import Settings from './views/pages/Settings';
import Logs from './views/pages/Logs';
import Analytics from './views/pages/Analytics';
import Vault from './views/pages/Vault';
import Decoder from './views/pages/Decoder';
import SecurityQuestions from './views/pages/SecurityQuestions';
import { getCurrentUser, logoutUser } from './controllers/userController';

function Navigation() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const addToast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    addToast("Sesión terminada.", "error");
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <>
      {user && (
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✖' : '☰'}
        </button>
      )}

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <div style={{ width: '14px', height: '14px', backgroundColor: 'var(--neon-red)', borderRadius: '50%', boxShadow: '0 0 8px var(--neon-red)' }}></div>
          DeadMan<span style={{display:'block', marginLeft: '22px'}}>Switch</span>
        </Link>
        
        {user ? (
          <div className="sidebar-menu">
            <Link to="/create" className="btn-neon btn-neon-green" onClick={() => setMenuOpen(false)}>+ Nuevo Switch</Link>
            <div style={{borderBottom: '1px solid rgba(255,255,255,0.1)', margin: '16px 0'}}></div>
            <Link to="/" className="sidebar-link" onClick={() => setMenuOpen(false)}>🎛 Dashboard</Link>
            <Link to="/logs" className="sidebar-link" onClick={() => setMenuOpen(false)}>📋 Auditoría</Link>
            <Link to="/analytics" className="sidebar-link" onClick={() => setMenuOpen(false)}>📈 Analíticas</Link>
            <Link to="/vault" className="sidebar-link" onClick={() => setMenuOpen(false)}>🔐 Archivos Ultra-Secretos</Link>
            <Link to="/sq" className="sidebar-link" onClick={() => setMenuOpen(false)}>🛡️ Control de Acceso 2FA</Link>
            <Link to="/settings" className="sidebar-link" onClick={() => setMenuOpen(false)}>⚙️ Configuración</Link>
            <div style={{flexGrow: 1}}></div>
            <button onClick={handleLogout} className="btn-neon btn-neon-red" style={{marginTop: 'auto'}}>Salir</button>
          </div>
        ) : (
          <div style={{color: 'var(--text-secondary)', marginTop: '2rem', textAlign: 'center'}}>
            Modo Bloqueado
          </div>
        )}
      </aside>
    </>
  );
}

function App() {
  return (
    <ErrorBoundaryPanel>
      <ToastProvider>
        <Router>
          <IdleStateDetector />
          <div className="dashboard-layout">
            <Navigation />

            <main className="main-content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/decoder" element={<Decoder />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/create" element={<ProtectedRoute><CreateSwitch /></ProtectedRoute>} />
                <Route path="/edit/:id" element={<ProtectedRoute><CreateSwitch /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
                <Route path="/vault" element={<ProtectedRoute><Vault /></ProtectedRoute>} />
                <Route path="/sq" element={<ProtectedRoute><SecurityQuestions /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </Router>
      </ToastProvider>
    </ErrorBoundaryPanel>
  );
}

export default App;
