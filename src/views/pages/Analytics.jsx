import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  // Datos simulados de actividad, mostrando las horas que quedaban a la hora de hacer checkin en la última semana
  const data = [
    { name: 'Lun', HorasRestantes: 18 },
    { name: 'Mar', HorasRestantes: 12 },
    { name: 'Mié', HorasRestantes: 4 },
    { name: 'Jue', HorasRestantes: 22 },
    { name: 'Vie', HorasRestantes: 1 }, // Riesgo Crítico simulado
    { name: 'Sáb', HorasRestantes: 16 },
    { name: 'Dom', HorasRestantes: 20 },
  ];

  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Analíticas de Seguridad</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Métricas de tiempo restante aproximado de la última semana al hacer click en el Check-in.
        </p>
      </header>

      <div className="glass-panel" style={{ width: '100%', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px'}}>
             Tendencia de Riesgo (Horas vs Caducidad)
          </h3>
          <div style={{ flex: 1, minHeight: 0 }}>
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorHoras" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="var(--neon-green)" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="var(--neon-green)" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="name" stroke="var(--text-secondary)" />
                 <YAxis stroke="var(--text-secondary)" />
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                 <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: 'var(--glass-border)', borderRadius: '8px', backdropFilter: 'var(--glass-blur)' }} 
                 />
                 <Area type="monotone" dataKey="HorasRestantes" stroke="var(--neon-green)" fillOpacity={1} fill="url(#colorHoras)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
      </div>
      <p style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          * Valores pequeños (Ej. 1 Hora o menos) representan que estuviste peligrosamente cerca de que el protocolo de hombre muerto entrara en acción, lo cual es considerado crítico.
      </p>
    </div>
  );
}
