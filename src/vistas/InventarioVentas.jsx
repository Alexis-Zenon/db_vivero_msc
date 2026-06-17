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
    <div className="container-fluid py-4 bg-light min-vh-100 v-msc-root">
      
      {/* PARCHE CSS RADICAL: Esto obliga al navegador a pintar los textos e impide la transparencia */}
      <style>{`
        .v-msc-root .card {
          background-color: #ffffff !important;
          opacity: 1 !important;
        }
        .v-msc-root h2, .v-msc-root h5, .v-msc-root h6 {
          color: #198754 !important; /* Forzar títulos a verde Bootstrap */
        }
        .v-msc-root p, .v-msc-root .text-muted {
          color: #6c757d !important;
        }
        .v-msc-root table {
          background-color: #ffffff !important;
        }
        .v-msc-root thead tr th {
          background-color: #198754 !important; /* Encabezado verde sólido */
          color: #ffffff !important;
          font-weight: bold !important;
        }
        /* Aquí solucionamos las celdas invisibles */
        .v-msc-root tbody tr td {
          color: #212529 !important; /* Texto oscuro/negro para que se lea perfecto */
          background-color: #ffffff !important;
        }
        .v-msc-root tbody tr td span, .v-msc-root tbody tr td strong {
          color: inherit !important;
        }
        .v-msc-root .text-success, .v-msc-root .fw-bold.text-success {
          color: #198754 !important;
        }
        .v-msc-root .badge.bg-secondary {
          background-color: #6c757d !important;
          color: #ffffff !important;
        }
        .v-msc-root .badge.bg-success {
          background-color: #198754 !important;
          color: #ffffff !important;
        }
        .v-msc-root .bg-light {
          background-color: #f8f9fa !important;
        }
        .v-msc-root svg {
          color: #495057 !important; /* Color gris oscuro para los iconos de Lucide */
          vertical-align: middle;
        }
      `}</style>

      {/* Encabezado */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h2 className="text-success mb-1">
              📋 Historial de Ventas
            </h2>
            <p className="text-muted mb-0">
              Auditoría y control financiero del vivero
            </p>
          </div>
          <span className="badge bg-success fs-6">
            Total registros: {ventas.length}
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="card shadow border-0">
        <div className="card-body p-0">
          {cargando ? (
            <div className="text-center p-5">
              <div className="spinner-border text-success" role="status"></div>
              <p className="mt-3 text-muted">Cargando ventas...</p>
            </div>
          ) : ventas.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>ID Venta</th>
                    <th>Fecha</th>
                    <th>Cajero</th>
                    <th>Método Pago</th>
                    <th className="text-end">Total</th>
                    <th className="text-center">Detalles</th>
                  </tr>
                </thead>

                <tbody>
                  {ventas.map((venta) => {
                    const expandida = filaExpandida === venta.id_venta;

                    return (
                      <React.Fragment key={venta.id_venta}>
                        <tr
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleFila(venta.id_venta)}
                        >
                          <td>
                            <span className="badge bg-secondary">
                              #{venta.id_venta}
                            </span>
                          </td>

                          <td>
                            <Clock size={15} className="me-2" />
                            {formatearFecha(venta.fecha_venta)}
                          </td>

                          <td>
                            <User size={15} className="me-2" />
                            {venta.nombre_cajero || `Cajero #${venta.id_usuario_cajero}`}
                          </td>

                          <td>
                            <span className={`badge ${venta.metodo_pago === "Efectivo" ? "bg-success" : "bg-primary"}`}>
                              <CreditCard size={12} className="me-1" />
                              {venta.metodo_pago}
                            </span>
                          </td>

                          <td className="text-end fw-bold text-success">
                            {formatearDinero(venta.total)}
                          </td>

                          <td className="text-center">
                            {expandida ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </td>
                        </tr>

                        {expandida && (
                          <tr>
                            <td colSpan="6" style={{ backgroundColor: "#f8f9fa !important" }}>
                              <div className="bg-light p-4">
                                <h5 className="text-success mb-3">
                                  📦 Artículos Comprados
                                </h5>

                                <div className="row">
                                  {venta.detalles && venta.detalles.length > 0 ? (
                                    venta.detalles.map((det, index) => (
                                      <div key={index} className="col-md-6 col-lg-4 mb-3">
                                        <div className="card h-100 border-success" style={{border: '1px solid #198754 !important'}}>
                                          <div className="card-body">
                                            <h6 className="fw-bold text-dark mb-1" style={{color: '#212529 !important'}}>
                                              {det.nombre_planta}
                                            </h6>

                                            {det.nombre_cientifico && (
                                              <small className="text-muted d-block mb-2" style={{fontStyle: 'italic'}}>
                                                ({det.nombre_cientifico})
                                              </small>
                                            )}

                                            <p className="mb-1">
                                              Cantidad: <strong>{det.cantidad}</strong>
                                            </p>

                                            <p className="mb-1">
                                              Precio: <strong>{formatearDinero(det.precio_unitario)}</strong>
                                            </p>

                                            <p className="fw-bold text-success mb-0">
                                              Subtotal: {formatearDinero(det.cantidad * det.precio_unitario)}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-muted ps-3">
                                      No existen detalles para esta venta.
                                    </p>
                                  )}
                                </div>

                                <hr style={{borderColor: '#rgba(0,0,0,0.1) !important'}} />

                                <div className="row justify-content-end">
                                  <div className="col-md-4">
                                    <div className="card shadow-sm">
                                      <div className="card-body" style={{color: '#212529 !important'}}>
                                        <div className="d-flex justify-content-between">
                                          <span>Monto recibido:</span>
                                          <strong>{formatearDinero(venta.pago_con)}</strong>
                                        </div>

                                        <div className="d-flex justify-content-between mt-2">
                                          <span>Cambio:</span>
                                          <strong style={{color: '#dc3545 !important'}}>{formatearDinero(venta.cambio)}</strong>
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
              <h4 className="text-muted">No hay ventas registradas</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}