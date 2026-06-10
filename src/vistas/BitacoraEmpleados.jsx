import React, { useState, useEffect } from "react";

export default function BitacoraEmpleados() {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerPersonal();
  }, []);

  const obtenerPersonal = async () => {
    try {
      const res = await fetch("http://localhost:3000/usuarios/lista-personal");
      if (res.ok) {
        const datos = await res.json();
        setPersonal(datos);
      }
    } catch (error) {
      console.error("Error cargando personal:", error);
    } finally {
      setLoading(false);
    }
  };

  const ejecutarEliminacion = async (id, nombre) => {
    if (!window.confirm(`¿Seguro que deseas eliminar a ${nombre}?`)) return;
    
    try {
      const res = await fetch(`http://localhost:3000/usuarios/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Usuario eliminado correctamente.");
        obtenerPersonal();
      }
    } catch (err) { alert("Error al eliminar"); }
  };

  return (
    <div className="container-fluid py-4">
      <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: "800px", borderRadius: "15px" }}>
        <div className="card-body p-4">
          <h4 className="fw-bold mb-4" style={{ color: "#1e4d2b" }}>Control de Personal</h4>

          {loading ? (
            <div className="text-center py-3">Cargando...</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr className="text-muted small">
                    <th>Nombre</th>
                    <th className="d-none d-sm-table-cell">Correo</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {personal.map((p) => (
                    <tr key={p.id_usuario}>
                      <td>
                        <div className="fw-bold">{p.nombre}</div>
                        {/* El correo se muestra debajo del nombre solo en móvil */}
                        <div className="d-sm-none small text-muted">{p.correo}</div>
                      </td>
                      <td className="d-none d-sm-table-cell">{p.correo}</td>
                      <td className="text-end">
                        <button 
                          className="btn btn-danger btn-sm" 
                          style={{ borderRadius: "8px", width: "40px" }}
                          onClick={() => ejecutarEliminacion(p.id_usuario, p.nombre)}
                        >
                          🗑️
                        </button>
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
  );
}