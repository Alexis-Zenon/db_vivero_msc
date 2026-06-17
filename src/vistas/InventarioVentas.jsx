import React, { useEffect, useState } from 'react';

export const InventarioVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Hacer la petición al backend de NestJS
    fetch('https://db-vivero-msc.onrender.com/ventas')
      .then((res) => res.json())
      .then((data) => {
        setVentas(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error cargando historial:', err);
        setCargando(false);
      });
  }, []);

  if (cargando) return <p style={{ color: '#fff' }}>Cargando historial de ventas...</p>;

  return (
    <div style={{ padding: '20px', color: '#fff', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
      <h2>📋 Inventario / Historial de Ventas</h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
        <thead>
          <tr style={{ background: '#2e7d32', color: '#fff' }}>
            <th style={{ padding: '10px' }}>ID Venta</th>
            <th style={{ padding: '10px' }}>Fecha</th>
            <th style={{ padding: '10px' }}>Atendió</th>
            <th style={{ padding: '10px' }}>Productos Vendidos</th>
            <th style={{ padding: '10px' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id_venta} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <td style={{ padding: '10px', textAlign: 'center' }}>#{venta.id_venta}</td>
              <td style={{ padding: '10px' }}>{new Date(venta.fecha_venta).toLocaleString()}</td>
              <td style={{ padding: '10px' }}>{venta.nombre_cajero || `Cajero ID: ${venta.id_usuario_cajero}`}</td>
              <td style={{ padding: '10px' }}>
                <ul style={{ margin: 0, paddingLeft: '15px' }}>
                  {venta.detalles.map((det, idx) => (
                    <li key={idx}>
                      {det.cantidad}x <strong>{det.nombre_planta}</strong> (${det.precio_unitario} c/u)
                    </li>
                  ))}
                </ul>
              </td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#81c784' }}>
                ${Number(venta.total).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};