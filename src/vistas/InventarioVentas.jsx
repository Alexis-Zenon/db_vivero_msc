import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  CreditCard,
} from "lucide-react";

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
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(cantidad || 0);
  };

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div 
      className="container-fluid py-4 min-vh-100" 
      style={{ backgroundColor: "#112217", color: "#ffffff" }}
    >
      {/* Encabezado Oscuro Estilo Premium */}
      <div 
        className="card mb-4" 
        style={{ backgroundColor: "#162e20", border: "1px solid #198754", borderRadius: "12px" }}
      >
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-1" style={{ color: "#28a745" }}>
              <font color="#28a745">📋 Historial de Ventas</font>
            </h2>
            <p className="mb-0" style={{ color: "#a0aec0" }}>
              <font color="#a0aec0">Auditoría y control financiero del vivero (MsC Vivero y Plantas)</font>
            </p>
          </div>

          <span className="badge bg-success fs-6" style={{ backgroundColor: "#28a745" }}>
            Total registros: {ventas.length}
          </span>
        </div>
      </div>

      {/* Tabla en Modo Oscuro Sólido */}
      <div 
        className="card shadow" 
        style={{ backgroundColor: "#162e20", border: "1px solid #1a3a26", borderRadius: "12px" }}
      >
        <div className="card-body p-0">
          {cargando ? (
            <div className="text-center p-5">
              <div className="spinner-border text-success" role="status"></div>
              <p className="mt-3" style={{ color: "#ffffff" }}><font color="#ffffff">Cargando ventas...</font></p>
            </div>
          ) : ventas.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-dark align-middle mb-0" style={{ backgroundColor: "#162e20", margin: 0 }}>
                <thead>
                  <tr style={{ backgroundColor: "#198754" }}>
                    <th style={{ backgroundColor: "#198754", color: "#ffffff", padding: "15px" }}><font color="#ffffff">ID Venta</font></th>
                    <th style={{ backgroundColor: "#198754", color: "#ffffff", padding: "15px" }}><font color="#ffffff">Fecha</font></th>
                    <th style={{ backgroundColor: "#198754", color: "#ffffff", padding: "15px" }}><font color="#ffffff">Cajero</font></th>
                    <th style={{ backgroundColor: "#198754", color: "#ffffff", padding: "15px" }}><font color="#ffffff">Método Pago</font></th>
                    <th style={{ backgroundColor: "#198754", color: "#ffffff", padding: "15px" }} className="text-end"><font color="#ffffff">Total</font></th>
                    <th style={{ backgroundColor: "#198754", color: "#ffffff", padding: "15px" }} className="text-center"><font color="#ffffff">Detalles</font></th>
                  </tr>
                </thead>

                <tbody>
                  {ventas.map((venta) => {
                    const expandida = filaExpandida === venta.id_venta;

                    return (
                      <React.Fragment key={venta.id_venta}>
                        <tr
                          style={{ cursor: "pointer", backgroundColor: "#162e20" }}
                          onClick={() => toggleFila(venta.id_venta)}
                        >
                          <td style={{ backgroundColor: "#162e20", padding: "15px" }}>
                            <span className="badge bg-secondary">#{venta.id_venta}</span>
                          </td>

                          <td style={{ backgroundColor: "#162e20", padding: "15px", color: "#ffffff" }}>
                            <Clock size={15} className="me-2" style={{ color: "#28a745" }} />
                            <font color="#ffffff">{formatearFecha(venta.fecha_venta)}</font>
                          </td>

                          <td style={{ backgroundColor: "#162e20", padding: "15px", color: "#ffffff" }}>
                            <User size={15} className="me-2" style={{ color: "#28a745" }} />
                            <font color="#ffffff">{venta.nombre_cajero || `Cajero #${venta.id_usuario_cajero}`}</font>
                          </td>

                          <td style={{ backgroundColor: "#162e20", padding: "15px" }}>
                            <span className={`badge ${venta.metodo_pago === "Efectivo" ? "bg-success" : "bg-primary"}`}>
                              <CreditCard size={12} className="me-1" />
                              {venta.metodo_pago}
                            </span>
                          </td>

                          <td style={{ backgroundColor: "#162e20", padding: "15px", color: "#28a745" }} className="text-end fw-bold">
                            <font color="#28a745">{formatearDinero(venta.total)}</font>
                          </td>

                          <td style={{ backgroundColor: "#162e20", padding: "15px", color: "#ffffff" }} className="text-center">
                            {expandida ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </td>
                        </tr>

                        {/* Desglose desplegable corregido estructuralmente */}
                        {expandida && (
                          <tr>
                            <td colSpan="6" style={{ backgroundColor: "#0f2015", padding: "20px" }}>
                              <div style={{ backgroundColor: "#0f2015" }}>
                                <h5 style={{ color: "#28a745" }} className="mb-3">
                                  <font color="#28a745">📦 Artículos Comprados</font>
                                </h5>

                                <div className="row">
                                  {venta.detalles && venta.detalles.length > 0 ? (
                                    venta.detalles.map((det, index) => (
                                      <div key={index} className="col-md-6 col-lg-4 mb-3">
                                        <div className="card h-100" style={{ backgroundColor: "#162e20", border: "1px solid #28a745" }}>
                                          <div className="card-body" style={{ color: "#ffffff" }}>
                                            <h6 className="fw-bold" style={{ color: "#ffffff" }}>
                                              <font color="#ffffff">{det.nombre_planta}</font>
                                            </h6>

                                            {det.nombre_cientifico && (
                                              <small style={{ color: "#a0aec0", fontStyle: "italic" }} className="d-block mb-2">
                                                <font color="#a0aec0">({det.nombre_cientifico})</font>
                                              </small>
                                            )}

                                            <p className="mb-1" style={{ color: "#ffffff" }}>
                                              <font color="#ffffff">Cantidad: <strong>{det.cantidad}</strong></font>
                                            </p>

                                            <p className="mb-1" style={{ color: "#ffffff" }}>
                                              <font color="#ffffff">Precio: <strong>{formatearDinero(det.precio_unitario)}</strong></font>
                                            </p>

                                            <p className="fw-bold mb-0" style={{ color: "#28a745" }}>
                                              <font color="#28a745">Subtotal: {formatearDinero(det.cantidad * det.precio_unitario)}</font>
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p style={{ color: "#a0aec0" }} className="ps-3">
                                      <font color="#a0aec0">No existen detalles para esta venta.</font>
                                    </p>
                                  )}
                                </div>

                                <hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />

                                {/* Ticket final de cobro */}
                                <div className="row justify-content-end">
                                  <div className="col-md-4">
                                    <div className="card" style={{ backgroundColor: "#162e20", border: "1px solid #28a745" }}>
                                      <div className="card-body" style={{ color: "#ffffff" }}>
                                        <div className="d-flex justify-content-between">
                                          <span><font color="#ffffff">Monto recibido:</font></span>
                                          <strong><font color="#ffffff">{formatearDinero(venta.pago_con)}</font></strong>
                                        </div>

                                        <div className="d-flex justify-content-between mt-2">
                                          <span><font color="#ffffff">Cambio:</font></span>
                                          <strong style={{ color: "#ff4d4d" }}><font color="#ff4d4d">{formatearDinero(venta.cambio)}</font></strong>
                                        </div>
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
            <div className="text-center p-5">
              <h4 style={{ color: "#a0aec0" }}><font color="#a0aec0">No hay ventas registradas</font></h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}