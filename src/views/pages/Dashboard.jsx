import React, { useState, useEffect } from 'react';
import { getSwitches, formatTimeLeft, checkInSwitch } from '../../controllers/switchController';
import { useToast } from '../components/ToastContext';

export default function Dashboard() {
  const [switches, setSwitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const addToast = useToast();

  useEffect(() => {
    const fetchSwitches = async () => {
      const data = await getSwitches();
      setSwitches(data);
      setLoading(false);
    };
    fetchSwitches();
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const handleCheckIn = async (id) => {
    const updatedSwitch = await checkInSwitch(id);
    if(updatedSwitch) {
        setSwitches(switches.map(sw => sw.id === id ? updatedSwitch : sw));
        addToast("Check-in seguro confirmado. Temporizador extendido.", "success");
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem' }}>
      <header>
        <h1>Tus Interruptores Activos</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
           Debes realizar check-in antes de que el contador llegue a cero.
        </p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <h2 style={{ color: 'var(--neon-blue)', animation: 'pulse 1.5s infinite' }}>Cargando estado criptográfico...</h2>
        </div>
      ) : switches.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)' }}>
           <h2>No tienes interruptores activos.</h2>
           <p>¡Crea tu primer Switch desde el menú superior!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {switches.map((sw) => {
            const timeData = formatTimeLeft(sw.targetTime);
            return (
              <div key={sw.id} className="glass-panel" style={{ 
                  borderTop: timeData.status === 'CRITICAL' || timeData.status === 'EXPIRED' ? '2px solid var(--neon-red)' : '2px solid var(--neon-green)',
                  transform: timeData.status === 'CRITICAL' ? 'scale(1.02)' : 'none',
                  transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={sw.name}>
                    {sw.name}
                  </h3>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    backgroundColor: timeData.status === 'ACTIVE' ? 'rgba(0,255,136,0.1)' : 'rgba(255,51,102,0.1)',
                    color: timeData.status === 'ACTIVE' ? 'var(--neon-green)' : 'var(--neon-red)',
                    fontWeight: 'bold',
                    boxShadow: timeData.status === 'CRITICAL' ? '0 0 10px rgba(255,51,102,0.5)' : 'none'
                  }}>
                    {timeData.status}
                  </span>
                </div>
                
                <div style={{ margin: '24px 0' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Tiempo Restante:</p>
                  <div style={{ 
                      fontSize: '2.5rem', 
                      fontFamily: 'var(--font-heading)', 
                      fontWeight: '800', 
                      color: timeData.status === 'ACTIVE' ? '#fff' : 'var(--neon-red)'
                  }}>
                    {timeData.text}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '10px' }} title={sw.alertEmail}>
                    ✉ {sw.alertEmail}
                  </div>
                  <button 
                      className={`btn-neon ${timeData.status === 'ACTIVE' ? 'btn-neon-green' : 'btn-neon-red'}`} 
                      style={{ padding: '8px 16px', fontSize: '0.9rem', flexShrink: 0 }}
                      onClick={() => handleCheckIn(sw.id)}
                  >
                    Check-In Seguro
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
