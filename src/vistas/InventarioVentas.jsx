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
    <div className="container-fluid py-4 bg-light min-vh-100">
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
              <div
                className="spinner-border text-success"
                role="status"
              ></div>
              <p className="mt-3 text-muted">Cargando ventas...</p>
            </div>
          ) : ventas.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-success">
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
                    const expandida =
                      filaExpandida === venta.id_venta;

                    return (
                      <React.Fragment key={venta.id_venta}>
                        <tr
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            toggleFila(venta.id_venta)
                          }
                        >
                          <td>
                            <span className="badge bg-secondary">
                              #{venta.id_venta}
                            </span>
                          </td>

                          <td className="text-dark">
                            <Clock size={15} className="me-2" />
                            {formatearFecha(
                              venta.fecha_venta
                            )}
                          </td>

                          <td className="text-dark">
                            <User size={15} className="me-2" />
                            {venta.nombre_cajero ||
                              `Cajero #${venta.id_usuario_cajero}`}
                          </td>

                          <td>
                            <span
                              className={`badge ${
                                venta.metodo_pago ===
                                "Efectivo"
                                  ? "bg-success"
                                  : "bg-primary"
                              }`}
                            >
                              <CreditCard
                                size={12}
                                className="me-1"
                              />
                              {venta.metodo_pago}
                            </span>
                          </td>

                          <td className="text-end fw-bold text-success">
                            {formatearDinero(venta.total)}
                          </td>

                          <td className="text-center">
                            {expandida ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </td>
                        </tr>

                        {expandida && (
                          <tr>
                            <td colSpan="6">
                              <div className="bg-light p-4">
                                <h5 className="text-success mb-3">
                                  📦 Artículos Comprados
                                </h5>

                                <div className="row">
                                  {venta.detalles &&
                                  venta.detalles.length > 0 ? (
                                    venta.detalles.map(
                                      (det, index) => (
                                        <div
                                          key={index}
                                          className="col-md-6 col-lg-4 mb-3"
                                        >
                                          <div className="card h-100 border-success">
                                            <div className="card-body">
                                              <h6 className="fw-bold text-dark">
                                                {
                                                  det.nombre_planta
                                                }
                                              </h6>

                                              {det.nombre_cientifico && (
                                                <small className="text-muted d-block mb-2">
                                                  (
                                                  {
                                                    det.nombre_cientifico
                                                  }
                                                  )
                                                </small>
                                              )}

                                              <p className="mb-1 text-dark">
                                                Cantidad:
                                                <strong>
                                                  {" "}
                                                  {
                                                    det.cantidad
                                                  }
                                                </strong>
                                              </p>

                                              <p className="mb-1 text-dark">
                                                Precio:
                                                <strong>
                                                  {" "}
                                                  {formatearDinero(
                                                    det.precio_unitario
                                                  )}
                                                </strong>
                                              </p>

                                              <p className="fw-bold text-success mb-0">
                                                Subtotal:{" "}
                                                {formatearDinero(
                                                  det.cantidad *
                                                    det.precio_unitario
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )
                                  ) : (
                                    <p className="text-muted">
                                      No existen detalles
                                      para esta venta.
                                    </p>
                                  )}
                                </div>

                                <hr />

                                <div className="row justify-content-end">
                                  <div className="col-md-4">
                                    <div className="card">
                                      <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                          <span>
                                            Monto recibido:
                                          </span>
                                          <strong>
                                            {formatearDinero(
                                              venta.pago_con
                                            )}
                                          </strong>
                                        </div>

                                        <div className="d-flex justify-content-between mt-2">
                                          <span>
                                            Cambio:
                                          </span>
                                          <strong className="text-danger">
                                            {formatearDinero(
                                              venta.cambio
                                            )}
                                          </strong>
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
              <h4 className="text-muted">
                No hay ventas registradas
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}