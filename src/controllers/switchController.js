/**
 * switchController.js
 * Como aún no tenemos el backend conectado en Railway, este controlador
 * gestionará el estado temporal en memoria (Mock DB) y proporcionará 
 * utilidades como convertir ms a formato visual (24h 10m).
 */

let mockSwitches = [
  { id: 1, name: 'Interruptor Alpha', alertEmail: 'familiar@correo.com', targetTime: Date.now() + 86400000, status: 'ACTIVE' },
  { id: 2, name: 'Bóveda Principal', alertEmail: 'abogado@correo.com', targetTime: Date.now() + 900000, status: 'CRITICAL' }
];

let globalLogs = [
  { id: 101, date: new Date(Date.now() - 86400000).toLocaleString(), action: 'Sistema Iniciado', details: 'N/A' },
  { id: 102, date: new Date(Date.now() - 3600000).toLocaleString(), action: 'Check-in Realizado', details: 'Interruptor Alpha' }
];

export const addLogEvent = (action, details) => {
    globalLogs.unshift({ id: Date.now(), date: new Date().toLocaleString(), action, details });
};

export const getLogs = async () => [...globalLogs];

export const getSwitches = async () => [...mockSwitches];

export const getSwitchById = async (id) => mockSwitches.find(s => s.id === parseInt(id));

export const createSwitch = async (data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newSwitch = { id: Date.now(), name: data.name, alertEmail: data.alertEmail, targetTime: Date.now() + (data.durationHours * 3600000), status: 'ACTIVE'};
            mockSwitches.push(newSwitch);
            addLogEvent('Switch Creado', data.name);
            resolve(newSwitch);
        }, 300);
    });
};

export const updateSwitch = async (id, data) => {
    return new Promise((resolve) => {
        const idx = mockSwitches.findIndex(s => s.id === parseInt(id));
        if (idx !== -1) {
            mockSwitches[idx] = { ...mockSwitches[idx], ...data, targetTime: Date.now() + (data.durationHours * 3600000) };
            addLogEvent('Switch Modificado', mockSwitches[idx].name);
            resolve(mockSwitches[idx]);
        } else resolve(null);
    });
};

export const deleteSwitch = async (id) => {
    return new Promise((resolve) => {
        const sw = mockSwitches.find(s => s.id === parseInt(id));
        if (sw) {
            mockSwitches = mockSwitches.filter(s => s.id !== parseInt(id));
            addLogEvent('Switch Eliminado', sw.name);
            resolve(true);
        } else resolve(false);
    });
};

export const checkInSwitch = async (id) => {
   return new Promise((resolve) => {
       const swIndex = mockSwitches.findIndex(s => s.id === id);
       if (swIndex !== -1) {
           mockSwitches[swIndex].targetTime = Date.now() + 86400000;
           mockSwitches[swIndex].status = 'ACTIVE';
           addLogEvent('Check-in Realizado', mockSwitches[swIndex].name);
           resolve(mockSwitches[swIndex]);
       } else resolve(null);
   });
};

export const formatTimeLeft = (targetTime) => {
  const diff = targetTime - Date.now();
  if (diff <= 0) return { text: "EXPIRADO", status: "EXPIRED" };
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { 
      text: `${hours}h ${minutes}m ${seconds}s`,
      status: diff < 3600000 ? "CRITICAL" : "ACTIVE"
  };
};
