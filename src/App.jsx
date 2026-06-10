// src/App.jsx
import { useState } from 'react';
import Login from './views/Login'; // Tu nuevo Login estilizado
import DashboardGeneral from './views/DashboardGeneral';

export default function App() {
  // Al arrancar, React revisa de inmediato si hay una sesión activa guardada de antes
  const [usuario, setUsuario] = useState(() => {
    const sesionGuardada = localStorage.getItem('sesion_vivero');
    return sesionGuardada ? JSON.parse(sesionGuardada) : null;
  });

  // Esta función se activa cuando el login es correcto
  const manejarLoginExitoso = (datosDelUsuario, recordar) => {
    setUsuario(datosDelUsuario);

    // Si el usuario marcó "Remember me", guardamos la sesión en el navegador permanente (localStorage)
    // Si no lo marcó, igual lo guardamos para el F5, o puedes usar sessionStorage si quieres que expire al cerrar la pestaña.
    localStorage.setItem('sesion_vivero', JSON.stringify(datosDelUsuario));
  };

  // Función para tu botón de Cerrar Sesión
  const manejarCerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('sesion_vivero'); // Borramos el rastro
  };

  // Renderizado Condicional
  if (!usuario) {
    return <Login onLoginSuccess={manejarLoginExitoso} />;
  }

  // Si hay sesión activa, pasa directo al Dashboard sin detenerse en el Login
  return (
    <DashboardGeneral 
      usuario={usuario} 
      onLogout={manejarCerrarSesion} 
    />
  );
}