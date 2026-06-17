import React, { useState, useEffect } from "react";

export default function InventarioVentas() {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filaExpandida, setFilaExpandida] = useState(null);

  useEffect(() => {
    fetch("https://db-vivero-msc.onrender.com/ventas")
      .then((res) => res.json())
      .then((data) => {
        setVentas(Array.isArray(data) ? data : []);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setCargando(false);
      });
  }, []);

  const toggleFila = (id) => {
    setFilaExpandida(filaExpandida === id ? null : id);
  };

  const formatearDinero = (cantidad) => {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(cantidad || 0);
  };

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-MX", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="container-fluid py-4" style={{ minHeight: "100vh" }}>
      {/* Encabezado */}
      <div className="card mb-4" style={{ backgroundColor: "#162e20", border: "1px solid #198754", borderRadius: "12px" }}>
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-1 fw-bold" style={{ color: "#28a745" }}>📋 Historial de Ventas</h2>
            <p className="mb-0" style={{ color: "#a0aec0" }}>Auditoría y control financiero (MsC Vivero y Plantas)</p>
          </div>
          <span className="badge bg-success fs-6" style={{ padding: "10px 15px" }}>Total registros: {ventas.length}</span>
        </div>
      </div>

      {/* Tabla */}
      <div className="card shadow" style={{ backgroundColor: "#162e20", border: "1px solid #1a3a26", borderRadius: "12px", overflow: "hidden" }}>
        <div className="card-body p-0">
          {cargando ? (
            <div className="text-center p-5">
              <div className="spinner-border text-success" role="status"></div>
              <p className="mt-3 text-white">Cargando ventas...</p>
            </div>
          ) : ventas.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr style={{ backgroundColor: "#198754" }}>
                    <th style={{ color: "#ffffff", padding: "15px" }}>ID Venta</th>
                    <th style={{ color: "#ffffff", padding: "15px" }}>Fecha</th>
                    <th style={{ color: "#ffffff", padding: "15px" }}>Atendió</th>
                    <th style={{ color: "#ffffff", padding: "15px" }}>Método Pago</th>
                    <th style={{ color: "#ffffff", padding: "15px" }} className="text-end">Total</th>
                    <th style={{ color: "#ffffff", padding: "15px" }} className="text-center">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((venta) => {
                    const expandida = filaExpandida === venta.id_venta;
                    return (
                      <React.Fragment key={venta.id_venta}>
                        <tr style={{ cursor: "pointer" }} onClick={() => toggleFila(venta.id_venta)}>
                          <td className="text-white" style={{ padding: "15px" }}><span className="badge bg-secondary">#{venta.id_venta}</span></td>
                          <td className="text-white" style={{ padding: "15px" }}>📅 {formatearFecha(venta.fecha_venta)}</td>
                          <td className="text-white" style={{ padding: "15px", textTransform: "capitalize" }}>👤 {venta.nombre_cajero || `Cajero #${venta.id_usuario_cajero}`}</td>
                          <td className="text-white" style={{ padding: "15px" }}>
                            <span className="badge bg-success">💳 {venta.metodo_pago}</span>
                          </td>
                          <td style={{ padding: "15px", color: "#2ea44f" }} className="text-end fw-bold">{formatearDinero(venta.total)}</td>
                          <td className="text-white" style={{ padding: "15px", textAlign: "center" }}>{expandida ? "▲" : "▼"}</td>
                        </tr>
                        {expandida && (
                          <tr>
                            <td colSpan="6" style={{ backgroundColor: "#0f2015", padding: "20px" }}>
                              <div>
                                <h5 style={{ color: "#28a745" }} className="mb-3 fw-bold">📦 Artículos Comprados</h5>
                                <div className="row">
                                  {venta.detalles && venta.detalles.length > 0 ? (
                                    venta.detalles.map((det, index) => (
                                      <div key={index} className="col-md-6 col-lg-4 mb-3">
                                        <div className="card h-100" style={{ backgroundColor: "#162e20", border: "1px solid #28a745" }}>
                                          <div className="card-body text-white">
                                            <h6 className="fw-bold text-success">{det.nombre_planta}</h6>
                                            {det.nombre_cientifico && <small style={{ color: "#a0aec0", fontStyle: "italic" }} className="d-block mb-2">({det.nombre_cientifico})</small>}
                                            <p className="mb-1">Cantidad: <strong>{det.cantidad}</strong></p>
                                            <p className="mb-1">Precio: <strong>{formatearDinero(det.precio_unitario)}</strong></p>
                                            <p className="fw-bold mb-0 text-success">Subtotal: {formatearDinero(det.cantidad * det.precio_unitario)}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p style={{ color: "#a0aec0" }} className="ps-3">No existen detalles para esta venta.</p>
                                  )}
                                </div>
                                <hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />
                                <div className="row justify-content-end">
                                  <div className="col-md-4">
                                    <div className="card" style={{ backgroundColor: "#162e20", border: "1px solid #28a745" }}>
                                      <div className="card-body text-white">
                                        <div className="d-flex justify-content-between"><span>Monto recibido:</span><strong>{formatearDinero(venta.pago_con)}</strong></div>
                                        <div className="d-flex justify-content-between mt-2"><span>Cambio:</span><strong className="text-danger">{formatearDinero(venta.cambio)}</strong></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-5"><h4 style={{ color: "#a0aec0" }}>No hay ventas registradas</h4></div>
          )}
        </div>
      </div>
    </div>
  );
}