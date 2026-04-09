import React, { useEffect, useState } from 'react';
import { getLogs } from '../../controllers/switchController';

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await getLogs();
      setLogs(data);
    };
    fetchLogs();
  }, []);

  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Auditoría Inmutable</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Trazabilidad de todos los eventos del sistema Dead Man's Switch.
        </p>
      </header>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--neon-blue)' }}>
              <th style={{ padding: '16px 8px' }}>Fecha y Hora</th>
              <th style={{ padding: '16px 8px' }}>Acción</th>
              <th style={{ padding: '16px 8px' }}>Referencia (Detalle)</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.3s', cursor: 'default' }}>
                <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>{log.date}</td>
                <td style={{ padding: '16px 8px', fontWeight: 'bold' }}>{log.action}</td>
                <td style={{ padding: '16px 8px' }}>{log.details}</td>
              </tr>
            ))}
            {logs.length === 0 && (
               <tr><td colSpan="3" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Sin registros en el sistema.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
