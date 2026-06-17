import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Calendar, 
  User, 
  DollarSign, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  CreditCard 
} from 'lucide-react'; // Puedes usar react-icons o Bootstrap icons si los prefieres

export default function InventarioVentas() {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filaExpandida, setFilaExpandida] = useState(null);

  useEffect(() => {
    fetch('https://db-vivero-msc.onrender.com/ventas')
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

  // Formateador de moneda profesional MXN
  const formatearDinero = (cantidad) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(cantidad);
  };

  // Formateador de fechas elegante
  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* Encabezado con Tarjeta de Cristal */}
      <div style={styles.headerCard}>
        <div style={styles.titleContainer}>
          <span style={styles.iconWrapper}>📋</span>
          <div>
            <h2 style={styles.mainTitle}>Historial de Ventas</h2>
            <p style={styles.subtitle}>Auditoría, control financiero y desglose de plantas vendidas</p>
          </div>
        </div>
        <div style={styles.badgeVentas}>
          Total Registros: {ventas.length}
        </div>
      </div>

      {/* Contenedor de la Tabla */}
      <div style={styles.tableWrapper}>
        {cargando ? (
          <div style={styles.loaderContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loaderText}>Sincronizando con el servidor de producción...</p>
          </div>
        ) : Array.isArray(ventas) && ventas.length > 0 ? (
          <table style={styles.tablaCustom}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: '10%' }}>ID Venta</th>
                <th style={{ ...styles.th, width: '25%' }}>Fecha y Hora</th>
                <th style={{ ...styles.th, width: '20%' }}>Atendió</th>
                <th style={{ ...styles.th, width: '15%' }}>Método de Pago</th>
                <th style={{ ...styles.th, width: '15%', textAlign: 'right' }}>Total</th>
                <th style={{ ...styles.th, width: '15%', textAlign: 'center' }}>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => {
                const esExpandida = filaExpandida === venta.id_venta;
                return (
                  <React.Fragment key={venta.id_venta}>
                    {/* Fila Principal */}
                    <tr 
                      onClick={() => toggleFila(venta.id_venta)}
                      style={esExpandida ? styles.trActive : styles.trNormal}
                    >
                      <td style={styles.tdId}>
                        <span style={styles.idBadge}># {venta.id_venta}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.flexCenter}>
                          <Clock size={16} style={styles.tableIcon} />
                          {formatearFecha(venta.fecha_venta)}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.flexCenter}>
                          <User size={16} style={styles.tableIcon} />
                          <span style={styles.textDestacado}>
                            {venta.nombre_cajero || `Cajero #${venta.id_usuario_cajero}`}
                          </span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.metodoBadge,
                          backgroundColor: venta.metodo_pago === 'Efectivo' ? 'rgba(40, 167, 69, 0.15)' : 'rgba(0, 123, 255, 0.15)',
                          color: venta.metodo_pago === 'Efectivo' ? '#28a745' : '#007bff'
                        }}>
                          <CreditCard size={12} style={{ marginRight: '6px' }} />
                          {venta.metodo_pago}
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: 'bold', color: '#2e7d32' }}>
                        {formatearDinero(venta.total)}
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <button style={styles.btnExpand}>
                          {esExpandida ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </td>
                    </tr>

                    {/* Fila Desplegable (Desglose de Artículos) */}
                    {esExpandida && (
                      <tr>
                        <td colSpan="6" style={styles.tdDetailsContainer}>
                          <div style={styles.detailsBox}>
                            <h4 style={styles.detailsTitle}>📦 Desglose de Artículos Comprados</h4>
                            <div style={styles.detailsGrid}>
                              {venta.detalles && venta.detalles.length > 0 ? (
                                venta.detalles.map((det, index) => (
                                  <div key={index} style={styles.itemCard}>
                                    <div style={styles.itemHeader}>
                                      <span style={styles.itemName}>{det.nombre_planta}</span>
                                      {det.nombre_cientifico && (
                                        <span style={styles.itemCientifico}>({det.nombre_cientifico})</span>
                                      )}
                                    </div>
                                    <div style={styles.itemSpecs}>
                                      <span>Cantidad: <strong>{det.cantidad} u.</strong></span>
                                      <span>P. Unitario: <strong>{formatearDinero(det.precio_unitario)}</strong></span>
                                      <span style={styles.subtotalText}>
                                        Subtotal: {formatearDinero(det.cantidad * det.precio_unitario)}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p style={styles.noDetails}>No se encontraron sub-detalles para esta venta.</p>
                              )}
                            </div>
                            
                            {/* Panel Inferior del Ticket */}
                            <div style={styles.ticketSummary}>
                              <div style={styles.ticketRow}>
                                <span>Monto Recibido:</span>
                                <span>{formatearDinero(venta.pago_con || 0)}</span>
                              </div>
                              <div style={styles.ticketRow}>
                                <span>Cambio Entregado:</span>
                                <span style={{ color: '#c62828' }}>{formatearDinero(venta.cambio || 0)}</span>
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
        ) : (
          <div style={styles.emptyContainer}>
            <div style={styles.emptyIcon}>🍃</div>
            <h3>Sin registros históricos</h3>
            <p>Aún no se han procesado transacciones en la tabla ventas de MariaDB.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 🎨 Arquitectura de Estilos en Línea Avanzada
const styles = {
  dashboardContainer: {
    padding: '30px',
    backgroundColor: '#1e382b', // El fondo verde oscuro temático del vivero
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
  },
  headerCard: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  iconWrapper: {
    fontSize: '32px',
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '12px',
    borderRadius: '12px'
  },
  mainTitle: {
    color: '#ffffff',
    margin: 0,
    fontSize: '24px',
    fontWeight: '600',
    letterSpacing: '0.5px'
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.65)',
    margin: '4px 0 0 0',
    fontSize: '14px'
  },
  badgeVentas: {
    backgroundColor: '#ffc107',
    color: '#1a3323',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '14px',
    boxShadow: '0 4px 15px rgba(255, 193, 7, 0.3)'
  },
  tableWrapper: {
    background: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
  },
  tablaCustom: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  th: {
    backgroundColor: '#284d37', // El verde corporativo de tus botones superiores
    color: '#ffffff',
    padding: '18px 20px',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  trNormal: {
    borderBottom: '1px solid #edf2f7',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff'
  },
  trActive: {
    backgroundColor: '#f1f8f4',
    borderBottom: '1px solid #e1efe6',
    cursor: 'pointer'
  },
  td: {
    padding: '16px 20px',
    fontSize: '15px',
    color: '#2d3748',
    verticalAlign: 'middle'
  },
  tdId: {
    padding: '16px 20px',
    verticalAlign: 'middle'
  },
  idBadge: {
    backgroundColor: '#edf2f7',
    color: '#4a5568',
    padding: '4px 10px',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '13px'
  },
  textDestacado: {
    fontWeight: '500',
    color: '#1a202c'
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  tableIcon: {
    color: '#718096'
  },
  metodoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 12px',
    borderRadius: '30px',
    fontSize: '12px',
    fontWeight: '600'
  },
  btnExpand: {
    background: 'none',
    border: 'none',
    color: '#4a5568',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '50%',
    transition: 'background 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tdDetailsContainer: {
    backgroundColor: '#f7fafc',
    padding: '24px 30px',
    borderBottom: '1px solid #e2e8f0'
  },
  detailsBox: {
    background: '#ffffff',
    borderLeft: '4px solid #284d37',
    borderRadius: '0 12px 12px 0',
    padding: '20px',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
  },
  detailsTitle: {
    margin: '0 0 16px 0',
    color: '#2d3748',
    fontSize: '16px',
    fontWeight: '600'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '14px',
    marginBottom: '20px'
  },
  itemCard: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  itemHeader: {
    display: 'flex',
    flexDirection: 'column'
  },
  itemName: {
    fontWeight: '600',
    color: '#1a202c',
    fontSize: '14px'
  },
  itemCientifico: {
    fontSize: '12px',
    fontStyle: 'italic',
    color: '#718096',
    marginTop: '2px'
  },
  itemSpecs: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#4a5568',
    flexWrap: 'wrap',
    gap: '8px',
    borderTop: '1px dashed #e2e8f0',
    paddingTop: '6px'
  },
  subtotalText: {
    color: '#2e7d32',
    fontWeight: '600'
  },
  ticketSummary: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '12px',
    maxWidth: '300px',
    marginLeft: 'auto'
  },
  ticketRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    fontSize: '14px',
    color: '#4a5568'
  },
  loaderContainer: {
    padding: '60px 20px',
    textAlign: 'center'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(40, 77, 55, 0.1)',
    borderTop: '4px solid #284d37',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px auto'
  },
  loaderText: {
    color: '#718096',
    fontSize: '14px'
  },
  emptyContainer: {
    padding: '60px 20px',
    textAlign: 'center',
    color: '#718096'
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px'
  },
  noDetails: {
    color: '#a0aec0',
    fontSize: '14px',
    gridColumn: '1/-1'
  }
};