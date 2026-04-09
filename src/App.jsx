import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ToastProvider, useToast } from './views/components/ToastContext';
import ProtectedRoute from './views/components/ProtectedRoute';
import Dashboard from './views/pages/Dashboard';
import CreateSwitch from './views/pages/CreateSwitch';
import Login from './views/pages/Login';
import Settings from './views/pages/Settings';
import { getCurrentUser, logoutUser } from './controllers/userController';

function Navigation() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const addToast = useToast();

  const handleLogout = () => {
    logoutUser();
    addToast("Sesión cerrada por seguridad.", "error");
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--neon-red)', borderRadius: '50%', boxShadow: '0 0 8px var(--neon-red)' }}></div>
        DeadMan<span>Switch</span>
      </Link>
      <div>
        {user ? (
          <>
            <Link to="/settings" className="btn-neon" style={{ marginRight: '16px', borderColor: 'var(--text-secondary)', color: 'var(--text-primary)' }}>Configuración</Link>
            <Link to="/create" className="btn-neon btn-neon-green" style={{ marginRight: '16px' }}>Nuevo Switch</Link>
            <button onClick={handleLogout} className="btn-neon btn-neon-red">Salir</button>
          </>
        ) : (
          <span style={{color: 'var(--text-secondary)'}}>Modo Bloqueado</span>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="app-container">
          <Navigation />

          {/* Sistema de Rutas */}
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/create" element={
              <ProtectedRoute>
                <CreateSwitch />
              </ProtectedRoute>
            } />

            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
