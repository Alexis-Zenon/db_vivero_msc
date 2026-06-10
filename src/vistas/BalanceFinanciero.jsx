import React, { useState, useEffect } from "react";

export default function BalanceFinanciero() {
  const [periodo, setPeriodo] = useState("semana"); // 'semana' | 'mes' | 'ano'
  const [datosBalance, setDatosBalance] = useState({ ingresos: [], perdidas: [] });
  const [loading, setLoading] = useState(true);

  // Totales calculados
  const [totales, setTotales] = useState({
    ingresos: 0,
    perdidas: 0,
    neto: 0,
  });

  // Cada vez que cambie el periodo (Filtro), consultamos al backend de NestJS
  useEffect(() => {
    const cargarBalance = async () => {
      setLoading(true);
      try {
        const respuesta = await fetch(`https://db-vivero-msc.onrender.com/mermas/balance?periodo=${periodo}`);
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setDatosBalance(datos);
          calcularTotales(datos);
        }
      } catch (error) {
        console.error("Error al obtener balance financiero:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarBalance();
  }, [periodo]);

  // Función para sumar y calcular el balance neto actual
  const calcularTotales = (datos) => {
    const totalIngresos = datos.ingresos.reduce((acc, curr) => acc + parseFloat(curr.total_ingresos || 0), 0);
    const totalPerdidas = datos.perdidas.reduce((acc, curr) => acc + parseFloat(curr.total_perdidas || 0), 0);
    
    setTotales({
      ingresos: totalIngresos,
      perdidas: totalPerdidas,
      neto: totalIngresos - totalPerdidas,
    });
  };

  return (
    <div className="container py-4">
      {/* Encabezado y Selector de Periodo */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0" style={{ color: "#1e4620" }}>
            📊 Balance Financiero de Temporadas
          </h2>
          <p className="text-muted small m-0">
            Monitorea los ingresos del Punto de Venta cruzados con el costo de las mermas registradas.
          </p>
        </div>

        {/* Botones de Control de Periodo */}
        <div className="btn-group shadow-sm" role="group" style={{ borderRadius: "10px", overflow: "hidden" }}>
          <button
            type="button"
            className={`btn btn-sm px-3 fw-bold ${periodo === "semana" ? "btn-success" : "btn-light"}`}
            onClick={() => setPeriodo("semana")}
          >
            Esta Semana
          </button>
          <button
            type="button"
            className={`btn btn-sm px-3 fw-bold ${periodo === "mes" ? "btn-success" : "btn-light"}`}
            onClick={() => setPeriodo("mes")}
          >
            Este Mes
          </button>
          <button
            type="button"
            className={`btn btn-sm px-3 fw-bold ${periodo === "ano" ? "btn-success" : "btn-light"}`}
            onClick={() => setPeriodo("ano")}
          >
            Balance del Año
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted mt-2 small">Procesando registros contables...</p>
        </div>
      ) : (
        <>
          {/* SECCIÓN DE TARJETAS (Glassmorphism de Alto Impacto) */}
          <div className="row g-4 mb-5">
            {/* Tarjeta 1: Ingresos */}
            <div className="col-12 col-md-4">
              <div 
                className="card border-0 p-4 shadow-sm h-100" 
                style={{ 
                  borderRadius: "20px", 
                  background: "linear-gradient(135deg, #eafaf1 0%, #ffffff 100%)",
                  borderLeft: "6px solid #28a745 !important" 
                }}
              >
                <div className="text-uppercase small fw-bold text-muted mb-1">💰 Ingresos Brutos</div>
                <h2 className="fw-bold text-success m-0">
                  ${totales.ingresos.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <span className="text-muted small mt-2">Recaudado en caja/ventas</span>
              </div>
            </div>

            {/* Tarjeta 2: Pérdidas */}
            <div className="col-12 col-md-4">
              <div 
                className="card border-0 p-4 shadow-sm h-100" 
                style={{ 
                  borderRadius: "20px", 
                  background: "linear-gradient(135deg, #fdf2f2 0%, #ffffff 100%)",
                  borderLeft: "6px solid #dc3545 !important" 
                }}
              >
                <div className="text-uppercase small fw-bold text-muted mb-1">🥀 Pérdidas por Mermas</div>
                <h2 className="fw-bold text-danger m-0">
                  ${totales.perdidas.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <span className="text-muted small mt-2">Plantas muertas o dañadas</span>
              </div>
            </div>

            {/* Tarjeta 3: Balance Neto */}
            <div className="col-12 col-md-4">
              <div 
                className="card border-0 p-4 shadow-sm h-100" 
                style={{ 
                  borderRadius: "20px", 
                  background: totales.neto >= 0 
                    ? "linear-gradient(135deg, #f4fbf7 0%, #ffffff 100%)" 
                    : "linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)",
                  borderLeft: totales.neto >= 0 ? "6px solid #1e4620 !important" : "6px solid #721c24 !important"
                }}
              >
                <div className="text-uppercase small fw-bold text-muted mb-1">📈 Rendimiento Neto Real</div>
                <h2 className={`fw-bold m-0 ${totales.neto >= 0 ? "text-dark" : "text-danger"}`}>
                  ${totales.neto.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <span className="text-muted small mt-2">
                  {totales.neto >= 0 ? "🟢 Margen de ganancia a favor" : "🔴 El negocio opera en números rojos"}
                </span>
              </div>
            </div>
          </div>

          {/* TABLAS DETALLADAS DE SEGUIMIENTO */}
          <div className="row g-4">
            {/* Subtabla de Historial de Ventas */}
            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
                <h5 className="fw-bold mb-3" style={{ color: "#28a745" }}>Flujo de Ingresos</h5>
                <div className="table-responsive">
                  <table className="table align-middle m-0">
                    <thead className="table-light">
                      <tr className="small text-uppercase text-muted">
                        <th>Intervalo / Periodo</th>
                        <th className="text-end">Total Ventas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datosBalance.ingresos.length === 0 ? (
                        <tr>
                          <td colSpan="2" className="text-center text-muted small py-3">Sin ventas registradas en este lapso.</td>
                        </tr>
                      ) : (
                        datosBalance.ingresos.map((ing, i) => (
                          <tr key={i}>
                            <td className="fw-semibold text-secondary small">{ing.intervalo}</td>
                            <td className="text-end fw-bold text-success">${parseFloat(ing.total_ingresos).toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Subtabla de Historial de Mermas */}
            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
                <h5 className="fw-bold mb-3" style={{ color: "#dc3545" }}>Flujo de Mermas</h5>
                <div className="table-responsive">
                  <table className="table align-middle m-0">
                    <thead className="table-light">
                      <tr className="small text-uppercase text-muted">
                        <th>Intervalo / Periodo</th>
                        <th className="text-end">Valor Perdido</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datosBalance.perdidas.length === 0 ? (
                        <tr>
                          <td colSpan="2" className="text-center text-muted small py-3">¡Excelente! Cero mermas registradas aquí.</td>
                        </tr>
                      ) : (
                        datosBalance.perdidas.map((per, i) => (
                          <tr key={i}>
                            <td className="fw-semibold text-secondary small">{per.intervalo}</td>
                            <td className="text-end fw-bold text-danger">${parseFloat(per.total_perdidass || per.total_perdidas).toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}