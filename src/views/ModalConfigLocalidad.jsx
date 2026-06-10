import { useState, useEffect } from 'react';

export default function ModalConfigLocalidad({ isOpen, onClose, datosTicket, onSave }) {
  const [tempDatos, setTempDatos] = useState({
    nombreVivero: "",
    direccion: "",
    localidad: "",
    telefono: "",
    leyenda: ""
  });

  // Sincronizar datos al abrir el modal
  useEffect(() => {
    if (isOpen && datosTicket) {
      setTempDatos({
        nombreVivero: datosTicket.nombreVivero || "",
        direccion: datosTicket.direccion || "",
        localidad: datosTicket.localidad || "",
        telefono: datosTicket.telefono || "",
        leyenda: datosTicket.leyenda || ""
      });
    }
  }, [isOpen, datosTicket]);

  if (!isOpen) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000 }}>
      <div className="bg-white p-4 rounded shadow-lg" style={{ width: '450px' }}>
        <h5 className="fw-bold mb-3">⚙️ Editar Configuración del Ticket</h5>
        
        <input className="form-control mb-2" placeholder="Nombre del Vivero" value={tempDatos.nombreVivero} onChange={(e) => setTempDatos({...tempDatos, nombreVivero: e.target.value})} />
        <input className="form-control mb-2" placeholder="Dirección" value={tempDatos.direccion} onChange={(e) => setTempDatos({...tempDatos, direccion: e.target.value})} />
        <input className="form-control mb-2" placeholder="Localidad" value={tempDatos.localidad} onChange={(e) => setTempDatos({...tempDatos, localidad: e.target.value})} />
        <input className="form-control mb-2" placeholder="Teléfono" value={tempDatos.telefono} onChange={(e) => setTempDatos({...tempDatos, telefono: e.target.value})} />
        <input className="form-control mb-3" placeholder="Mensaje Inferior" value={tempDatos.leyenda} onChange={(e) => setTempDatos({...tempDatos, leyenda: e.target.value})} />
        
        <div className="d-flex gap-2">
            <button className="btn btn-secondary flex-grow-1" onClick={onClose}>Cancelar</button>
            <button className="btn btn-success flex-grow-1 fw-bold" onClick={() => { onSave(tempDatos); onClose(); }}>Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
}