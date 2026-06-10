import { useState } from 'react';
import miFondo from '../assets/fondo_vivero.png'; 
import miLogo from '../assets/logotipo.png'; 
import FormLogin from './FormLogin';
import FormRegistro from './FormRegistro';
import FormRecuperar from './FormRecuperar';

export default function Login({ onLoginSuccess }) {
  // Estado para saber qué formulario pintar: 'login', 'registro', 'recuperar'
  const [vista, setVista] = useState('login');

  return (
    <div 
      className="d-flex justify-content-center align-items-center vh-100" 
      style={{
        backgroundImage: `url(${miFondo})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)' }}></div>

      <div 
        className="card p-4 text-white shadow-lg border-0 m-3" 
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          backgroundColor: 'rgba(255, 255, 255, 0.15)', 
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          zIndex: 1
        }}
      >
        {/* Renderizado Condicional de los módulos externos */}
        {vista === 'login' && (
          <FormLogin 
            logo={miLogo} 
            onLoginSuccess={onLoginSuccess} 
            onCambiarVista={setVista} 
          />
        )}

        {vista === 'registro' && (
          <FormRegistro onCambiarVista={setVista} />
        )}

        {vista === 'recuperar' && (
          <FormRecuperar onCambiarVista={setVista} />
        )}
      </div>

      <style>{`
        .placeholder-white::placeholder { color: rgba(255,255,255,0.7) !important; }
        .form-control:focus { color: white !important; background-color: transparent !important; }
      `}</style>
    </div>
  );
}