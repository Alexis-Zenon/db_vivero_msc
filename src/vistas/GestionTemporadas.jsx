import React, { useState, useEffect } from 'react';

export default function GestionTemporadas() {
  const [temporadas, setTemporadas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el formulario (Crear y Editar)
  const [idEditando, setIdEditando] = useState(null);
  const [form, setForm] = useState({
    nombreTemporada: '',
    fechaInicio: '',
    fechaFin: ''
  });

  useEffect(() => {
    obtenerTemporadas();
  }, []);

  const obtenerTemporadas = async () => {
    try {
      const res = await fetch('http://https://db-vivero-msc.onrender.com/temporadas');
      if (res.ok) {
        const datos = await res.json();
        setTemporadas(datos);
      }
    } catch (error) {
      console.error('Error cargando temporadas:', error);
    } finally {
      setLoading(false);
    }
  };

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarTemporada = async (e) => {
    e.preventDefault();
    if (!form.nombreTemporada || !form.fechaInicio || !form.fechaFin) {
      alert('⚠️ Todos los campos son obligatorios.');
      return;
    }

    try {
      const url = idEditando 
        ? `http://https://db-vivero-msc.onrender.com/temporadas/${idEditando}` 
        : 'http://https://db-vivero-msc.onrender.com/temporadas';
      
      const method = idEditando ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert(idEditando ? '✨ Temporada actualizada con éxito.' : '🎉 Nueva temporada registrada.');
        limpiarFormulario();
        obtenerTemporadas();
      } else {
        alert('❌ Hubo un error al procesar la solicitud.');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const iniciarEdicion = (temp) => {
    setIdEditando(temp.idTemporada);
    setForm({
      nombreTemporada: temp.nombreTemporada,
      fechaInicio: temp.fechaInicio,
      fechaFin: temp.fechaFin
    });
  };

  const eliminarTemporada = async (id) => {
    if (!confirm('⚠️ ¿Estás seguro de eliminar esta configuración de temporada?')) return;
    
    try {
      const res = await fetch(`http://https://db-vivero-msc.onrender.com/temporadas/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('🗑️ Temporada removida del sistema.');
        obtenerTemporadas();
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const limpiarFormulario = () => {
    setIdEditando(null);
    setForm({ nombreTemporada: '', fechaInicio: '', fechaFin: '' });
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        
        {/* FORMULARIO DE CONFIGURACIÓN */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3" style={{ color: '#1e4d2b' }}>
              {idEditando ? '📝 Editar Temporada' : '📅 Nueva Temporada'}
            </h5>
            <form onSubmit={guardarTemporada}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Nombre identificador</label>
                <input 
                  type="text" 
                  name="nombreTemporada" 
                  className="form-control" 
                  placeholder="Ej. Temporada Navideña"
                  value={form.nombreTemporada} 
                  onChange={manejarCambio}
                  style={{ borderRadius: '8px' }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Fecha de Inicio</label>
                <input 
                  type="date" 
                  name="fechaInicio" 
                  className="form-control" 
                  value={form.fechaInicio} 
                  onChange={manejarCambio}
                  style={{ borderRadius: '8px' }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Fecha de Cierre</label>
                <input 
                  type="date" 
                  name="fechaFin" 
                  className="form-control" 
                  value={form.fechaFin} 
                  onChange={manejarCambio}
                  style={{ borderRadius: '8px' }}
                />
              </div>
              
              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-success flex-grow-1 fw-bold" style={{ borderRadius: '8px' }}>
                  {idEditando ? 'Guardar Cambios' : 'Registrar'}
                </button>
                {idEditando && (
                  <button type="button" className="btn btn-light" onClick={limpiarFormulario} style={{ borderRadius: '8px' }}>
                    ✕
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* TABLA DE RANGOS ESTABLECIDOS */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '18px' }}>
            <div className="mb-3">
              <h4 className="fw-bold m-0" style={{ color: '#1e4d2b' }}>⚙️ Calendario de Épocas</h4>
              <p className="text-muted small m-0">Define los rangos exactos de fechas en los que operará el catálogo del vivero.</p>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-success" role="status"></div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle m-0">
                  <thead className="table-light">
                    <tr className="small text-uppercase text-muted" style={{ fontSize: '11px' }}>
                      <th>ID</th>
                      <th>Nombre de Época</th>
                      <th>Fecha Inicio</th>
                      <th>Fecha Fin</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {temporadas.map((t) => (
                      <tr key={t.idTemporada}>
                        <td className="text-muted small">#{t.idTemporada}</td>
                        <td className="fw-bold">{t.nombreTemporada}</td>
                        <td><span className="badge bg-light text-dark border">{t.fechaInicio}</span></td>
                        <td><span className="badge bg-light text-dark border">{t.fechaFin}</span></td>
                        <td className="text-end">
                          <div className="d-inline-flex gap-2">
                            <button className="btn btn-outline-primary btn-sm px-2" style={{ borderRadius: '6px' }} onClick={() => iniciarEdicion(t)}>✏️</button>
                            <button className="btn btn-outline-danger btn-sm px-2" style={{ borderRadius: '6px' }} onClick={() => eliminarTemporada(t.idTemporada)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}