import { useState } from "react";

export default function VistaCliente({ plantas = [], temporadas = [] }) {
  const [tipoVista, setTipoVista] = useState("imagenes"); // Predeterminado en imágenes para clientes
  const [busqueda, setBusqueda] = useState("");
  const [letraSeleccionada, setLetraSeleccionada] = useState(null);

  const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const plantasFiltradas = plantas.filter((planta) => {
    const nombre = planta.nombre || planta.nombre_comun || "";
    const cientifico = planta.nombreCientifico || planta.nombre_cientifico || "";

    const cumpleTexto =
      nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cientifico.toLowerCase().includes(busqueda.toLowerCase());

    const cumpleLetra = letraSeleccionada
      ? nombre.toUpperCase().startsWith(letraSeleccionada)
      : true;

    const idTemp = planta.idTemporada || planta.id_temporada;
    if (!idTemp) return cumpleTexto && cumpleLetra;

    const datosDeLaTemporada = temporadas.find(
      (t) => Number(t.idTemporada || t.id_temporada) === Number(idTemp)
    );
    return cumpleTexto && cumpleLetra && (datosDeLaTemporada?.activa === 1 || datosDeLaTemporada?.activa === true);
  });

  return (
    <div className="container-fluid py-3">
      <div className="card shadow-sm p-3 mb-3 bg-white border-0" style={{ borderRadius: "15px" }}>
        
        {/* BUSCADOR */}
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
          <div className="d-flex flex-grow-1" style={{ minWidth: "260px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Buscar planta en el catálogo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="btn-group shadow-sm">
            <button className={`btn btn-sm ${tipoVista === "filas" ? "btn-success" : "btn-outline-success"}`} onClick={() => setTipoVista("filas")}>📋 Lista</button>
            <button className={`btn btn-sm ${tipoVista === "imagenes" ? "btn-success" : "btn-outline-success"}`} onClick={() => setTipoVista("imagenes")}>🖼️ Galería</button>
          </div>
        </div>

        {/* ABECEDARIO */}
        <div className="mb-3">
          <small className="text-muted d-block mb-1 fw-bold">Filtrar por inicial:</small>
          <div className="d-flex flex-wrap gap-1 pb-1">
            <button className={`btn btn-sm py-0 px-2 ${letraSeleccionada === null ? "btn-success" : "btn-light border"}`} onClick={() => setLetraSeleccionada(null)}>Todas</button>
            {abecedario.map((letra) => (
              <button key={letra} className={`btn btn-sm py-0 px-2 fw-bold ${letraSeleccionada === letra ? "btn-success" : "btn-light border"}`} onClick={() => setLetraSeleccionada(letraSeleccionada === letra ? null : letra)}>{letra}</button>
            ))}
          </div>
        </div>

        {/* CONTENIDO */}
        {plantasFiltradas.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <h5>No hay plantas disponibles bajo este criterio.</h5>
          </div>
        ) : tipoVista === "filas" ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Planta</th>
                  <th>Nombre Científico</th>
                  <th>Precio al Público</th>
                </tr>
              </thead>
              <tbody>
                {plantasFiltradas.map((planta, idx) => (
                  <tr key={planta.id_planta || idx}>
                    <td className="fw-bold text-success text-capitalize">{planta.nombre || planta.nombre_comun}</td>
                    <td><i className="text-muted">{planta.nombreCientifico || planta.nombre_cientifico || "N/A"}</i></td>
                    <td className="fw-bold text-dark">${parseFloat(planta.precio || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
            {plantasFiltradas.map((planta, idx) => {
              const srcFinal = planta.imagenUrl || "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=500&auto=format&fit=crop";
              return (
                <div className="col" key={planta.id_planta || idx}>
                  <div className="card h-100 border-0 shadow-sm text-center p-2 d-flex flex-column" style={{ borderRadius: "12px" }}>
                    <div className="bg-light rounded mb-2 overflow-hidden" style={{ height: "140px" }}>
                      <img src={srcFinal} alt={planta.nombre} className="w-100 h-100" style={{ objectFit: "cover" }} onError={(e) => {e.target.src = srcFinal}} />
                    </div>
                    <h6 className="m-0 fw-bold text-success text-capitalize text-truncate">{planta.nombre || planta.nombre_comun}</h6>
                    <small className="text-muted italic mb-2"><i>{planta.nombreCientifico || planta.nombre_cientifico}</i></small>
                    <div className="fw-bold text-dark mt-auto fs-5">${parseFloat(planta.precio || 0).toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}