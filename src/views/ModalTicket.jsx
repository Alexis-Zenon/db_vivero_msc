// En tu archivo ModalTicket.jsx
import { useState, useEffect } from 'react';

export default function ModalTicket({ isOpen, onClose, carrito, totalVenta, plantasPrueba }) {
  // Estado para guardar la configuración real de la base de datos
  const [config, setConfig] = useState({
    nombreVivero: "Cargando...",
    direccion: "",
    localidad: "",
    telefono: "",
    leyenda: ""
  });

  // Este useEffect consulta a tu API apenas se abre el modal
  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:3000/config-ticket")
        .then(res => res.json())
        .then(data => {
            if (data) setConfig(data);
        })
        .catch(err => console.error("Error al obtener config:", err));
    }
  }, [isOpen]);

  // ... resto de tu código

  // Ahora, en la parte donde imprimes el ticket, usa la variable 'config':
  return (
    // ...
    <div className="text-center">
        <h5>{config.nombreVivero}</h5>
        <p className="m-0">{config.direccion}</p>
        <p className="m-0">{config.localidad}</p>
        <small>Tel: {config.telefono}</small>
    </div>
    // ...
  );
}