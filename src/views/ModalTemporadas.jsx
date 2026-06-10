import { useState } from 'react';

export default function ModalTemporadas({ isOpen, onClose, temporadas, plantas, onRefrescarDatos }) {
  const [modoAutomatico, setModoAutomatico] = useState(true);
  const [loadingAccion, setLoadingAccion] = useState(false);

  if (!isOpen) return null;

  // Manejador central que golpea el backend de NestJS
  const ejecutarCambioEnBaseDatos = async (auto, idManual = null) => {
    setLoadingAccion(true);
    try {
      const res = await fetch("http://https://db-vivero-msc.onrender.com/temporadas/cambiar-modo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modoAutomatico: auto,
          idTemporadaManual: idManual ? Number(idManual) : null
        })
      });

      if (res.ok) {
        // Ejecuta la función heredada del componente padre para recargar los states
        if (typeof onRefrescarDatos === "function") {
          await onRefrescarDatos();
        }
      } else {
        alert("❌ Error al intentar cambiar la configuración de la temporada.");
      }
    } catch (err) {
      console.error("Error estacional:", err);
    } finally {
      setLoadingAccion(false);
    }
  };

  const handleCambioModo = (auto) => {
    setModoAutomatico(auto);
    // Si se activa automático, procesa de inmediato con la fecha del servidor
    if (auto) {
      ejecutarCambioEnBaseDatos(true);
    }
  };

  const handleManejoManual = (idTemp) => {
    if (!modoAutomatico) {
      ejecutarCambioEnBaseDatos(false, idTemp);
    }
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center ocultar-en-impresion" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000 }}>
      <div className="bg-white p-4 rounded shadow-lg text-dark" style={{ width: '600px', maxHeight: '85vh', overflowY: 'auto', borderRadius: "20px" }}>
        
        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
          <h5 className="m-0 fw-bold text-success">🍂 Control de Inventario Estacional</h5>
          <button className="btn-close" onClick={onClose} disabled={loadingAccion}></button>
        </div>

        {/* SELECTOR DE MODO */}
        <div className="card p-3 mb-4 bg-light border-0" style={{ borderRadius: "14px" }}>
          <label className="form-label fw-bold small text-secondary text-uppercase mb-2">Método de Transición de Temporada</label>
          <div className="d-flex gap-3">
            <button 
              className={`btn flex-grow-1 fw-bold py-2 ${modoAutomatico ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => handleCambioModo(true)}
              disabled={loadingAccion}
              style={{ borderRadius: "10px" }}
            >
              🔄 Automático (Por Fecha)
            </button>
            <button 
              className={`btn flex-grow-1 fw-bold py-2 ${!modoAutomatico ? 'btn-warning text-dark' : 'btn-outline-warning'}`}
              onClick={() => handleCambioModo(false)}
              disabled={loadingAccion}
              style={{ borderRadius: "10px" }}
            >
              🎮 Manual (Por el Patrón)
            </button>
          </div>
          <small className="form-text text-muted mt-2 small">
            {modoAutomatico 
              ? "💡 El sistema activará de forma inteligente las plantas basándose en el calendario del servidor." 
              : "⚠️ El administrador decide qué temporada se despliega en el catálogo comercial presionando 'Activar'."}
          </small>
        </div>

        {/* LISTA DE TEMPORADAS */}
        <div className="mb-4">
          <label className="form-label fw-bold small text-secondary text-uppercase mb-2">Temporadas Configuradas</label>
          {loadingAccion ? (
            <div className="text-center py-3"><div className="spinner-border spinner-border-sm text-success" role="status"></div></div>
          ) : (
            <div className="list-group" style={{ borderRadius: "12px", overflow: "hidden" }}>
              {temporadas.map((temp) => (
                <div 
                  key={temp.idTemporada} 
                  className={`list-group-item d-flex justify-content-between align-items-center p-3 ${temp.activa ? 'border-success bg-success-subtle' : ''}`}
                >
                  <div>
                    <h6 className="mb-1 fw-bold text-dark">{temp.nombreTemporada}</h6> 
                    <small className="text-muted">📅 Rango: {temp.fechaInicio} al {temp.fechaFin}</small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {temp.activa && <span className="badge bg-success px-3 py-2" style={{ borderRadius: "6px" }}>Catálogo Activo</span>}
                    {!modoAutomatico && (
                      <button 
                        className={`btn btn-sm ${temp.activa ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => handleManejoManual(temp.idTemporada)} 
                        disabled={temp.activa || loadingAccion}
                        style={{ borderRadius: "6px" }}
                      >
                        Activar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* VISTA PREVIA DEL IMPACTO EN EL STOCK */}
        <div>
          <label className="form-label fw-bold small text-secondary text-uppercase mb-2">Plantas Visibles en esta Época</label>
          <div className="table-responsive border rounded" style={{ maxHeight: '200px', borderRadius: "12px" }}>
            <table className="table table-sm table-striped m-0 align-middle" style={{ fontSize: '13px' }}>
              <thead className="table-dark">
                <tr>
                  <th className="p-2">Planta</th>
                  <th className="p-2">Temporada Asignada</th>
                  <th className="text-center p-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {plantas.map((planta) => {
                  const tempAsignada = temporadas.find(
                    (t) => (t.idTemporada || t.id_temporada) === planta.idTemporada
                  );
                  
                  const esVisible = planta.idTemporada ? tempAsignada?.activa : true;

                  return (
                    <tr key={planta.idPlanta} className={esVisible ? '' : 'table-light opacity-50'}>
                      <td className="fw-bold p-2 text-capitalize">{planta.nombre}</td>
                      <td className="p-2">
                        {tempAsignada ? tempAsignada.nombreTemporada : 'Todo el año'}
                      </td>
                      <td className="text-center p-2">
                        <span className={`badge ${esVisible ? 'bg-success' : 'bg-danger'}`} style={{ borderRadius: "5px" }}>
                          {esVisible ? 'Visible' : 'Oculta'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}