import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

export default function Decoder() {
  const [cipherText, setCipherText] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState('');

  const handleDecrypt = (e) => {
    e.preventDefault();
    setError('');
    setDecryptedText('');

    if (!cipherText || !secretKey) {
        setError('Ambos campos son requeridos.');
        return;
    }

    try {
        const bytes = CryptoJS.AES.decrypt(cipherText.trim(), secretKey);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        
        if (originalText) {
            setDecryptedText(originalText);
        } else {
            setError('Llave maestra incorrecta o texto corrupto.');
        }
    } catch (err) {
        setError('Error fatal al intentar descifrar. Verifica la firma.');
    }
  };

  return (
    <div className="section-container" style={{ animation: 'fadeIn 0.5s ease-out', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--neon-red)', marginTop: '40px' }}>⚠️ Terminal de Desclasificación</h1>
        <p style={{ color: '#aaa', marginBottom: '30px' }}>
            Si fuiste redirigido aquí, has recibido una carta testamentaria o un protocolo de emergencia cifrado. 
            Pega el bloque basura exactamente como lo recibiste y utiliza la llave maestra que te otorgó el emisor en vida.
        </p>

        <form onSubmit={handleDecrypt} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '8px' }}>Párrafo o Fragmento Cifrado (Garabato)</label>
                <textarea 
                    rows="6"
                    value={cipherText}
                    onChange={(e) => setCipherText(e.target.value)}
                    placeholder="U2FsdGVkX19x..."
                    style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #444', background: 'rgba(0,0,0,0.8)', color: 'white', fontFamily: 'monospace' }}
                />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'var(--neon-red)', marginBottom: '8px' }}>El PIN Maestro (La Llave)</label>
                <input 
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Contraseña de Descifrado"
                    style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid var(--neon-red)', background: 'rgba(50,0,0,0.3)', color: 'white', textAlign: 'center', letterSpacing: '3px' }}
                />
            </div>

            <button type="submit" className="btn-neon" style={{ width: '100%', borderColor: 'var(--neon-red)', color: 'var(--neon-red)' }}>
                DESENCRIPTAR CONTENIDO
            </button>
        </form>

        {error && (
            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,0,0,0.1)', border: '1px solid red', color: '#ff4444', borderRadius: '8px' }}>
                {error}
            </div>
        )}

        {decryptedText && (
            <div style={{ marginTop: '30px', padding: '20px', background: '#111', border: '1px solid var(--neon-green)', borderRadius: '8px', textAlign: 'left' }}>
                <h3 style={{ color: 'var(--neon-green)', margin: '0 0 15px 0' }}>✅ TEXTO RECUPERADO:</h3>
                <pre style={{ color: 'white', whiteSpace: 'pre-wrap', fontFamily: 'monospace', margin: 0, fontSize: '16px' }}>
                    {decryptedText}
                </pre>
            </div>
        )}
    </div>
  );
}
