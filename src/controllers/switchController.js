/**
 * switchController.js
 * Como aún no tenemos el backend conectado en Railway, este controlador
 * gestionará el estado temporal en memoria (Mock DB) y proporcionará 
 * utilidades como convertir ms a formato visual (24h 10m).
 */

// Memoria Temporal para simular la BD
let mockSwitches = [
  { 
    id: 1, 
    name: 'Interruptor Alpha', 
    alertEmail: 'familiar@correo.com',
    targetTime: Date.now() + 86400000, // 24 horas desde ahora
    status: 'ACTIVE'
  },
  { 
    id: 2, 
    name: 'Bóveda Principal', 
    alertEmail: 'abogado@correo.com',
    targetTime: Date.now() + 900000, // 15 minutos desde ahora
    status: 'CRITICAL'
  }
];

export const getSwitches = async () => {
    // Simula latencia de red
    return new Promise((resolve) => {
        setTimeout(() => resolve([...mockSwitches]), 500);
    });
}

export const createSwitch = async (nuevoSwitchData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const durationMs = nuevoSwitchData.durationHours * 3600000;
            const newSwitch = {
                id: Date.now(),
                name: nuevoSwitchData.name,
                alertEmail: nuevoSwitchData.alertEmail,
                targetTime: Date.now() + durationMs,
                status: 'ACTIVE'
            };
            mockSwitches.push(newSwitch);
            resolve(newSwitch);
        }, 500);
    });
}

export const checkInSwitch = async (id) => {
   return new Promise((resolve) => {
       const swIndex = mockSwitches.findIndex(s => s.id === id);
       if (swIndex !== -1) {
           // Al hacer check-in, sumamos 24h al tiempo actual
           mockSwitches[swIndex].targetTime = Date.now() + 86400000;
           mockSwitches[swIndex].status = 'ACTIVE';
           resolve(mockSwitches[swIndex]);
       } else {
           resolve(null);
       }
   });
}

// Utilidad para vista temporal
export const formatTimeLeft = (targetTime) => {
  const diff = targetTime - Date.now();
  if (diff <= 0) return { text: "EXPIRADO", status: "EXPIRED" };

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const status = diff < 3600000 ? "CRITICAL" : "ACTIVE"; // Menos de 1 Hora -> Crítico
  
  return { 
      text: `${hours}h ${minutes}m ${seconds}s`,
      status
  };
}
