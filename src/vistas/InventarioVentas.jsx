import React, { useState, useEffect } from 'react';

export default function InventarioVentas() {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);

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

  const formatearDinero = (cantidad) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(cantidad);
  };

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      
      {/* Título forzado a color oscuro para que no se pierda */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '2px solid #284d37', paddingBottom: '10px' }}>
        <span style={{ fontSize: '28px' }}>📋</span>
        <h2 style={{ color: '#1a202c', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          Inventario / Historial de Ventas
        </h2>
      </div>

      {/* Contenedor de la Tabla */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
        {cargando ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#1a202c' }}>
            <p style={{ fontWeight: 'bold' }}>Cargando historial...</p>
          </div>
        ) : Array.isArray(ventas) && ventas.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff' }}>
            <thead>
              <tr style={{ backgroundColor: '#284d37' }}>
                <th style={{ padding: '12px 16px', color: '#ffffff', textAlign: 'left', fontWeight: 'bold' }}>ID Venta</th>
                <th style={{ padding: '12px 16px', color: '#ffffff', textAlign: 'left', fontWeight: 'bold' }}>Fecha</th>
                <th style={{ padding: '12px 16px', color: '#ffffff', textAlign: 'left', fontWeight: 'bold' }}>Atendió</th>
                <th style={{ padding: '12px 16px', color: '#ffffff', textAlign: 'left', fontWeight: 'bold' }}>Productos Vendidos</th>
                <th style={{ padding: '12px 16px', color: '#ffffff', textAlign: 'right', fontWeight: 'bold' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id_venta} style={{ borderBottom: '1px solid #edf2f7', backgroundColor: '#ffffff' }}>
                  
                  {/* Forzamos color oscuro usando color: '#1a202c' en cada celda */}
                  <td style={{ padding: '16px', color: '#1a202c', fontWeight: 'bold' }}>
                    #{venta.id_venta}
                  </td>
                  
                  <td style={{ padding: '16px', color: '#2d3748' }}>
                    {formatearFecha(venta.fecha_venta)}
                  </td>
                  
                  <td style={{ padding: '16px', color: '#2d3748', textTransform: 'capitalize' }}>
                    {venta.nombre_cajero || `Cajero #${venta.id_usuario_cajero}`}
                  </td>
                  
                  <td style={{ padding: '16px', color: '#2d3748' }}>
                    {venta.detalles && venta.detalles.map((det, idx) => (
                      <div key={idx} style={{ marginBottom: '4px', color: '#2d3748' }}>
                        • <strong style={{ color: '#1a202c' }}>{det.cantidad}x</strong> {det.nombre_planta} 
                        <span style={{ color: '#718096', fontSize: '13px', marginLeft: '6px' }}>
                          ({formatearDinero(det.precio_unitario)} c/u)
                        </span>
                      </div>
                    ))}
                  </td>
                  
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: '#2e7d32', fontSize: '16px' }}>
                    {formatearDinero(venta.total)}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#4a5568' }}>
            <p>No hay registros de ventas disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
}