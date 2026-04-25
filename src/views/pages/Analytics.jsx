import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAnalyticsData } from '../../controllers/switchController';
import { useToast } from '../components/ToastContext';

export default function Analytics() {
  const [data, setData] = useState([]);
  const addToast = useToast();

  useEffect(() => {
      const loadAnalytics = async () => {
          try {
              const res = await getAnalyticsData();
              setData(res);
          } catch (e) {
              addToast("Error al cargar telemetría del servidor", "error");
          }
      };
      loadAnalytics();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Analíticas Forenses</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Volumen consolidado de interacciones (Check-ins Exitosos) frente a incidencias críticas en todos tus protocolos de seguridad.
        </p>
      </header>

      <div className="glass-panel" style={{ width: '100%', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px'}}>
             Rastreo de Actividad vs Fallos (Últimos 7 Días)
          </h3>
          <div style={{ flex: 1, minHeight: 0 }}>
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorActividad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="var(--neon-green)" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="var(--neon-green)" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorAlertas" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="var(--neon-red)" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="var(--neon-red)" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="name" stroke="var(--text-secondary)" />
                 <YAxis stroke="var(--text-secondary)" allowDecimals={false} />
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                 <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: 'var(--glass-border)', borderRadius: '8px', backdropFilter: 'var(--glass-blur)' }} 
                 />
                 <Area type="monotone" dataKey="ActividadNormal" stroke="var(--neon-green)" fillOpacity={1} fill="url(#colorActividad)" name="Check-ins & Accesos" />
                 <Area type="monotone" dataKey="AlertasCriticas" stroke="var(--neon-red)" fillOpacity={1} fill="url(#colorAlertas)" name="Eventos Críticos / Fallos" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
      </div>
      <p style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          * Esta gráfica de área unificada procesa el historial completo de la base de datos de telemetría de todos los switches simultáneamente en periodos semanales.
      </p>
    </div>
  );
}
