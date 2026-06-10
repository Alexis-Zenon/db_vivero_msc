// PuntoDeVenta.jsx
import { useState } from "react";

export default function PuntoDeVenta({
  plantas = [],
  temporadas = [], // Temporadas directas desde la base de datos (con propiedad .activa)
  usuario,
  datosTicket,
  onVentaCompletada,
}) {
  const [carrito, setCarrito] = useState([]);
  const [tipoVista, setTipoVista] = useState("filas");
  const [busqueda, setBusqueda] = useState("");
  const [letraSeleccionada, setLetraSeleccionada] = useState(null);
  const [pestañaMovil, setPestañaMovil] = useState("inventario");
  const [cantidadesManuales, setCantidadesManuales] = useState({});
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [pagoCon, setPagoCon] = useState("");

  const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const manejarCambioCantidadManual = (id, valor) => {
    const cant = parseInt(valor) || 1;
    setCantidadesManuales({
      ...cantidadesManuales,
      [id]: cant < 1 ? 1 : cant,
    });
  };

  const agregarAlCarrito = (planta, index) => {
    const idSeguro = planta.idPlanta || planta.id_planta || index;
    const cantidadAAgregar = cantidadesManuales[idSeguro] || 1;

    const existe = carrito.find(
      (item) => (item.idPlanta || item.id_planta || item.indexRef) === idSeguro,
    );

    if (existe) {
      setCarrito(
        carrito.map((item) =>
          (item.idPlanta || item.id_planta || item.indexRef) === idSeguro
            ? { ...item, cantidad: item.cantidad + cantidadAAgregar }
            : item,
        ),
      );
    } else {
      setCarrito([
        ...carrito,
        { ...planta, indexRef: idSeguro, cantidad: cantidadAAgregar },
      ]);
    }

    setCantidadesManuales({
      ...cantidadesManuales,
      [idSeguro]: 1,
    });
  };

  const eliminarDelCarrito = (idSeguro) => {
    setCarrito(
      carrito.filter((item) => (item.idPlanta || item.id_planta || item.indexRef) !== idSeguro),
    );
  };

  // 🍂 FILTRADO AUTOMÁTICO E INTELIGENTE POR TEMPORADA ACTIVA (Igual que en CatalogoCliente)
  const plantasFiltradas = plantas.filter((planta) => {
    const nombre = planta.nombre || planta.nombre_comun || "";
    const cientifico = planta.nombreCientifico || planta.nombre_cientifico || "";

    // 1. Coincidencia por texto
    const cumpleTexto =
      nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cientifico.toLowerCase().includes(busqueda.toLowerCase());

    // 2. Coincidencia por inicial A-Z
    const cumpleLetra = letraSeleccionada
      ? nombre.toUpperCase().startsWith(letraSeleccionada)
      : true;

    // 3. Filtrado automático de temporada estacional
    const idTemp = planta.idTemporada || planta.id_temporada;

    // Si no tiene temporada asignada, es de "Todo el año", por lo tanto siempre pasa
    if (!idTemp) {
      return cumpleTexto && cumpleLetra;
    }

    // Si tiene temporada, validamos si esa temporada en específico está marcada como activa en la BD
    const datosDeLaTemporada = temporadas.find(
      (t) => Number(t.idTemporada || t.id_temporada) === Number(idTemp)
    );
    const estaEstacionActiva =
      datosDeLaTemporada?.activa === 1 || datosDeLaTemporada?.activa === true;

    return cumpleTexto && cumpleLetra && estaEstacionActiva;
  });

  const calcularTotal = () => {
    return carrito.reduce(
      (sum, item) => sum + (parseFloat(item.precio) || 0) * item.cantidad,
      0,
    );
  };

  // 🖨️ FUNCIÓN DE IMPRESIÓN DE TICKET
  const ejecutarImpresionTicket = (idVenta, pago, cambioMonto) => {
    const ventanaImpresion = window.open("", "_blank", "width=300,height=600");

    const contenidoTicket = `
      <html>
        <head>
          <title>Ticket ${idVenta}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; font-size: 12px; padding: 10px; width: 260px; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .linea { border-bottom: 1px dashed #000; margin: 8px 0; }
            .total { font-size: 13px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; }
          </style>
        </head>
        <body>
          <div class="text-center">
            <strong>${datosTicket?.nombreVivero || "MSC VIVERO"}</strong><br>
            ${datosTicket?.direccion || "Dirección del Invernadero"}<br>
            ${datosTicket?.telefono || ""}<br>
            <div class="linea"></div>
            <strong>TICKET DE VENTA: #000${idVenta}</strong><br>
            Fecha: ${new Date().toLocaleString()}<br>
            Atendió: ${usuario?.nombre || "Cajero General"}<br>
          </div>
          <div class="linea"></div>
          <table>
            <thead>
              <tr>
                <th align="left">Cant x Prod</th>
                <th align="right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${carrito
                .map(
                  (item) => `
                <tr>
                  <td>${item.cantidad} x ${item.nombre || item.nombre_comun}</td>
                  <td align="right">$${((parseFloat(item.precio) || 0) * item.cantidad).toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          <div class="linea"></div>
          <div class="text-right">
            <span>TOTAL: $${calcularTotal().toFixed(2)}</span>
          </div>
          <div class="text-right small" style="margin-top: 4px;">
            <span>Método Pago: ${metodoPago}</span><br>
            <span>Efectivo Recibido: $${parseFloat(pago).toFixed(2)}</span><br>
            <strong>Cambio: $${parseFloat(cambioMonto).toFixed(2)}</strong>
          </div>
          <div class="linea"></div>
          <div class="text-center">
            ${datosTicket?.leyenda || "¡Gracias por su preferencia!"}<br>
            Vuelve pronto
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;

    ventanaImpresion.document.write(contenidoTicket);
    ventanaImpresion.document.close();
  };

  // 🚀 PROCESAR VENTA AL BACKEND
  const finalizarVentaDelCarrito = async () => {
    if (carrito.length === 0) return;

    const totalVenta = calcularTotal();
    const montoPagado =
      metodoPago === "Efectivo"
        ? parseFloat(pagoCon || totalVenta)
        : totalVenta;
    const cambioCalculado = montoPagado - totalVenta;

    if (metodoPago === "Efectivo" && montoPagado < totalVenta) {
      alert("El monto con el que pagan no puede ser menor al total de la venta.");
      return;
    }

    const datosVenta = {
      id_usuario_cajero: usuario?.id_usuario || 1,
      id_cliente: null,
      metodo_pago: metodoPago,
      total: totalVenta,
      pago_con: montoPagado,
      cambio: cambioCalculado >= 0 ? cambioCalculado : 0,
      productos: carrito.map((item) => {
        const idDetectado = item.idPlanta || item.id_planta || item.id_producto || item.id;
        return {
          id_planta: idDetectado ? Number(idDetectado) : undefined,
          cantidad: Number(item.cantidad) || 1,
          precio: parseFloat(item.precio || item.precio_unitario || 0),
        };
      }),
    };

    const tieneErrores = datosVenta.productos.some(p => p.id_planta === undefined || isNaN(p.id_planta));
    if (tieneErrores) {
      console.error("Error de mapeo detectado:", datosVenta);
      alert("Error: Uno de los productos en el carrito no cuenta con un ID válido.");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:3000/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosVenta),
      });

      if (respuesta.ok) {
        const resultado = await respuesta.json();

        if (typeof ejecutarImpresionTicket === "function") {
          ejecutarImpresionTicket(resultado.id_venta || 1, montoPagado, datosVenta.cambio);
        }

        setCarrito([]);
        setPagoCon("");
        setMetodoPago("Efectivo");

        if (typeof onVentaCompletada === "function") {
          onVentaCompletada();
        }
      } else {
        const errorData = await respuesta.json();
        alert(`Error al registrar la venta: ${errorData.message || "Error interno"}`);
      }
    } catch (error) {
      console.error("Error en la conexión con la API:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="container-fluid py-1">
      {/* 📱 PESTAÑAS MÓVILES */}
      <div className="d-flex d-md-none gap-2 mb-3">
        <button
          className={`btn flex-grow-1 py-2 fw-bold ${pestañaMovil === "inventario" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => setPestañaMovil("inventario")}
        >
          🌿 Inventario ({plantasFiltradas.length})
        </button>
        <button
          className={`btn flex-grow-1 py-2 fw-bold position-relative ${pestañaMovil === "ticket" ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => setPestañaMovil("ticket")}
        >
          🧾 Ticket
          {carrito.length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {carrito.length}
            </span>
          )}
        </button>
      </div>

      <div className="row g-3">
        {/* ================= INVENTARIO DE PLANTAS ================= */}
        <div className={`col-md-7 col-lg-8 ${pestañaMovil !== "inventario" ? "d-none d-md-block" : ""}`}>
          <div className="card shadow-sm p-3 mb-3 bg-white border-0" style={{ borderRadius: "15px" }}>
            
            {/* BARRA SUPERIOR: BUSCADOR Y BOTONES DE VISTA */}
            <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
              <div className="d-flex flex-grow-1" style={{ minWidth: "260px" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Buscar planta por nombre..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              <div className="btn-group shadow-sm">
                <button
                  className={`btn btn-sm ${tipoVista === "filas" ? "btn-success" : "btn-outline-success"}`}
                  onClick={() => setTipoVista("filas")}
                >
                  📋 Filas
                </button>
                <button
                  className={`btn btn-sm ${tipoVista === "imagenes" ? "btn-success" : "btn-outline-success"}`}
                  onClick={() => setTipoVista("imagenes")}
                >
                  🖼️ Imágenes
                </button>
              </div>
            </div>

            {/* BARRA DE FILTRADO A-Z */}
            <div className="mb-3">
              <small className="text-muted d-block mb-1 fw-bold">Filtrar por inicial de la planta:</small>
              <div className="d-flex flex-wrap gap-1 pb-1">
                <button
                  className={`btn btn-sm py-0 px-2 ${letraSeleccionada === null ? "btn-success" : "btn-light border"}`}
                  onClick={() => setLetraSeleccionada(null)}
                >
                  Todas
                </button>
                {abecedario.map((letra) => (
                  <button
                    key={letra}
                    className={`btn btn-sm py-0 px-2 fw-bold ${letraSeleccionada === letra ? "btn-success" : "btn-light border"}`}
                    onClick={() => setLetraSeleccionada(letraSeleccionada === letra ? null : letra)}
                  >
                    {letra}
                  </button>
                ))}
              </div>
            </div>

            {/* RENDERIZADO DINÁMICO */}
            {plantasFiltradas.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <h5>No hay plantas disponibles para la temporada activa o criterios de búsqueda.</h5>
              </div>
            ) : tipoVista === "filas" ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle" style={{ fontSize: "14px" }}>
                  <thead className="table-dark">
                    <tr>
                      <th>Planta</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th style={{ width: "110px" }}>Cantidad</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plantasFiltradas.map((planta, index) => {
                      const keySegura = planta.idPlanta || planta.id_planta || index;
                      const stockActual = planta.stock || 0;
                      return (
                        <tr key={keySegura}>
                          <td>
                            <span className="fw-bold text-success d-block text-capitalize">
                              {planta.nombre || planta.nombre_comun || "Sin nombre"}
                            </span>
                            <small className="text-muted italic">
                              <i>{planta.nombreCientifico || planta.nombre_cientifico || ""}</i>
                            </small>
                          </td>
                          <td className="fw-bold">${parseFloat(planta.precio || 0).toFixed(2)}</td>
                          <td>
                            {/* Color gris normal / Alerta roja si el stock baja a 5 o menos */}
                            <span className={`badge border ${stockActual <= 5 ? "bg-danger text-white" : "bg-light text-dark border-secondary-subtle"}`}>
                              {stockActual} pz
                            </span>
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm text-center fw-bold"
                              min="1"
                              value={cantidadesManuales[keySegura] || 1}
                              onChange={(e) => manejarCambioCantidadManual(keySegura, e.target.value)}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-success btn-sm fw-bold rounded-pill"
                              onClick={() => agregarAlCarrito(planta, index)}
                            >
                              ➕
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* VISTA DE TARJETAS / IMÁGENES SINCRONIZADA */
              <div className="row row-cols-2 row-cols-lg-3 g-2">
                {plantasFiltradas.map((planta, index) => {
                  const keySegura = planta.idPlanta || planta.id_planta || index;
                  const stockActual = planta.stock || 0;
                  
                  // 🌿 Sincronizado con planta.imagenUrl tal como está en CatalogoCliente
                  const srcFinal = planta.imagenUrl || "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=500&auto=format&fit=crop";

                  return (
                    <div className="col" key={keySegura}>
                      <div className="card h-100 border-0 shadow-sm text-center p-2 d-flex flex-column" style={{ borderRadius: "12px" }}>
                        
                        {/* 🖼️ Contenedor de Imagen adaptado al catálogo con su Fallback */}
                        <div className="bg-light rounded mb-2 d-flex justify-content-center align-items-center overflow-hidden" style={{ height: "110px", width: "100%" }}>
                          <img 
                            src={srcFinal} 
                            alt={planta.nombre || "Planta"} 
                            className="w-100 h-100" 
                            style={{ objectFit: "cover" }}
                            onError={(e) => { 
                              e.target.src = "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=500&auto=format&fit=crop";
                            }} 
                          />
                        </div>
                        
                        <h6 className="m-0 fw-bold text-success text-truncate text-capitalize small">
                          {planta.nombre || "Sin nombre"}
                        </h6>
                        
                        <div className="fw-bold text-dark mb-1 small">${parseFloat(planta.precio || 0).toFixed(2)}</div>
                        
                        {/* 📦 Badge de Stock integrado */}
                        <div className="mb-2">
                          <span className={`badge border btn-sm py-1 px-2 ${stockActual <= 5 ? "bg-danger text-white" : "bg-light text-dark border-secondary-subtle"}`} style={{ fontSize: "11px" }}>
                            Stock: {stockActual} pz
                          </span>
                        </div>

                        <div className="d-flex gap-1 justify-content-center align-items-center mt-auto">
                          <input
                            type="number"
                            className="form-control form-control-sm text-center fw-bold p-0"
                            style={{ width: "50px", height: "30px" }}
                            min="1"
                            value={cantidadesManuales[keySegura] || 1}
                            onChange={(e) => manejarCambioCantidadManual(keySegura, e.target.value)}
                          />
                          <button
                            className="btn btn-success btn-sm fw-bold py-1 px-2"
                            onClick={() => agregarAlCarrito(planta, index)}
                          >
                            ➕
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ================= TICKET DE COBRO ================= */}
        <div className={`col-md-5 col-lg-4 ${pestañaMovil !== "ticket" ? "d-none d-md-block" : ""}`}>
          <div
            className="card shadow border-0 p-3 text-white d-flex flex-column"
            style={{
              backgroundColor: "#1e4d2b",
              borderRadius: "18px",
              minHeight: "calc(100vh - 140px)",
            }}
          >
            <div className="text-center border-bottom pb-2 mb-2">
              <h6 className="m-0 fw-bold text-uppercase">{datosTicket?.nombreVivero || "MSC VIVERO"}</h6>
              <small className="d-block text-white-50" style={{ fontSize: "11px" }}>
                {datosTicket?.direccion || "Dirección por configurar"}
              </small>
            </div>

            <h5 className="fw-bold mb-2 d-flex justify-content-between align-items-center">
              <span>🧾 Ticket</span>
              <span className="badge bg-white text-success rounded-pill fs-6">{carrito.length} tipos</span>
            </h5>

            <div className="flex-grow-1 overflow-auto bg-white text-dark p-2 rounded mb-2" style={{ minHeight: "180px", maxHeight: "250px" }}>
              {carrito.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <span style={{ fontSize: "24px" }}>🛒</span>
                  <p className="small m-0 mt-1">El ticket está vacío.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {carrito.map((item, idx) => {
                    const idSeguro = item.idPlanta || item.id_planta || item.indexRef || idx;
                    return (
                      <div key={idSeguro} className="d-flex justify-content-between align-items-center border-bottom pb-1 small">
                        <div>
                          <div className="fw-bold text-success text-capitalize">{item.nombre}</div>
                          <span className="text-muted">
                            {item.cantidad} pz x ${parseFloat(item.precio || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-bold">
                            ${((parseFloat(item.precio) || 0) * item.cantidad).toFixed(2)}
                          </span>
                          <button
                            className="btn btn-link btn-sm text-danger p-0 fw-bold text-decoration-none"
                            onClick={() => eliminarDelCarrito(idSeguro)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-top pt-2 mt-auto">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-white-50">Total:</span>
                <span className="fs-4 fw-bold text-warning">${calcularTotal().toFixed(2)}</span>
              </div>

              {/* LÓGICA DE PAGO Y CAMBIO */}
              <div className="p-3 bg-white bg-opacity-10 rounded mb-3 text-white">
                <div className="mb-2">
                  <label className="form-label text-white-50 fw-semibold m-0" style={{ fontSize: "12px" }}>
                    MÉTODO DE PAGO:
                  </label>
                  <select
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="form-select form-select-sm bg-dark text-white border-success"
                  >
                    <option value="Efectivo">💵 Efectivo</option>
                    <option value="Transferencia">📱 Transferencia</option>
                  </select>
                </div>

                {metodoPago === "Efectivo" && (
                  <>
                    <div className="mb-2">
                      <label className="form-label text-white-50 fw-semibold m-0" style={{ fontSize: "12px" }}>
                        ¿CON CUÁNTO PAGA?
                      </label>
                      <input
                        type="number"
                        placeholder="Ej. 500"
                        value={pagoCon}
                        onChange={(e) => setPagoCon(e.target.value)}
                        className="form-control form-control-sm bg-dark text-white border-success"
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-2 border-top border-white border-opacity-10">
                      <span className="fw-semibold text-white-50" style={{ fontSize: "12px" }}>SU CAMBIO:</span>
                      <span className="fs-5 text-warning fw-bold">
                        $
                        {pagoCon && parseFloat(pagoCon) >= calcularTotal()
                          ? (parseFloat(pagoCon) - calcularTotal()).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <button
                className="btn btn-warning w-100 py-2 fw-bold text-dark rounded-pill shadow"
                disabled={carrito.length === 0}
                onClick={finalizarVentaDelCarrito}
              >
                💵 Concluir Venta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}