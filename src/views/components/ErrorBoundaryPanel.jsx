import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px' }}>
      <div className="glass-panel" style={{ borderTop: '4px solid var(--neon-red)', textAlign: 'center', maxWidth: '500px' }}>
        <h2 style={{ color: 'var(--neon-red)', marginBottom: '16px' }}>Colapso Crítico de UI Detectado</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          El entorno seguro encontró un error. El sistema ha sido interrumpido visualmente por precaución.
        </p>
        <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '16px', borderRadius: '8px', color: 'var(--text-primary)', textAlign: 'left', overflowX: 'auto', marginBottom: '24px', fontSize: '0.8rem' }}>
          {error.message}
        </pre>
        <button onClick={resetErrorBoundary} className="btn-neon btn-neon-red">Forzar Reinicio del Entorno</button>
      </div>
    </div>
  );
}

export default function ErrorBoundaryPanel({ children }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}
