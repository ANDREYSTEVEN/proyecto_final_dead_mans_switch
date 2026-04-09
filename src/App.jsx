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
import { getCurrentUser, logoutUser } from './controllers/userController';

function Navigation() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const addToast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    addToast("Sesión terminada.", "error");
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="flex-between">
          <Link to="/" className="logo">
            <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--neon-red)', borderRadius: '50%', boxShadow: '0 0 8px var(--neon-red)' }}></div>
            DeadMan<span>Switch</span>
          </Link>
          
          {user && (
              <button 
                className="mobile-menu-btn" 
                onClick={() => setMenuOpen(!menuOpen)}
              >
                  {menuOpen ? '✖' : '☰'}
              </button>
          )}
      </div>

      {user ? (
        <div className={`desktop-menu ${!menuOpen ? 'hidden-mobile' : ''}`}>
          <Link to="/logs" className="btn-neon" style={{ marginRight: '8px', borderColor: 'var(--text-secondary)', color: 'var(--text-primary)' }} onClick={() => setMenuOpen(false)}>Auditoría</Link>
          <Link to="/analytics" className="btn-neon" style={{ marginRight: '8px', borderColor: 'var(--neon-blue)', color: 'var(--neon-blue)' }} onClick={() => setMenuOpen(false)}>Analíticas</Link>
          <Link to="/settings" className="btn-neon" style={{ marginRight: '8px', borderColor: 'var(--text-secondary)', color: 'var(--text-primary)' }} onClick={() => setMenuOpen(false)}>Configuración</Link>
          <Link to="/create" className="btn-neon btn-neon-green" style={{ marginRight: '8px' }} onClick={() => setMenuOpen(false)}>Nuevo Switch</Link>
          <button onClick={handleLogout} className="btn-neon btn-neon-red">Salir</button>
        </div>
      ) : (
        <span style={{color: 'var(--text-secondary)'}}>Modo Bloqueado</span>
      )}
    </nav>
  );
}

function App() {
  return (
    <ErrorBoundaryPanel>
      <ToastProvider>
        <Router>
          <IdleStateDetector />
          <div className="app-container">
            <Navigation />

            {/* Sistema de Rutas Protegidas y Públicas */}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/create" element={<ProtectedRoute><CreateSwitch /></ProtectedRoute>} />
              <Route path="/edit/:id" element={<ProtectedRoute><CreateSwitch /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </ErrorBoundaryPanel>
  );
}

export default App;
