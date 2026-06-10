// src/vistas/CatalogoCliente.jsx
import React, { useState, useEffect } from "react";

/* 🛡️ ADAPTADO: Recibe plantas y temporadas del padre para no tocar la API del backend */
export default function CatalogoCliente({ plantas: plantasProp, temporadas = [] }) {
  const [plantas, setPlantas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    // Si el componente padre ya nos provee las plantas, las usamos directamente
    if (plantasProp && plantasProp.length > 0) {
      const plantasVisibles = plantasProp.filter(planta => planta.visible === true || planta.visible === 1);
      setPlantas(plantasVisibles);
      setLoading(false);
    } else {
      cargarCatalogo();
    }
  }, [plantasProp]);

  const cargarCatalogo = async () => {
    try {
      const res = await fetch("http://https://db-vivero-msc.onrender.com/plantas");
      if (res.ok) {
        const datos = await res.json();
        
        // 🛡️ Filtro básico inicial: Solo mostrar plantas visibles
        const plantasVisibles = datos.filter(planta => planta.visible === true || planta.visible === 1);
        setPlantas(plantasVisibles);
      }
    } catch (error) {
      console.error("Error al conectar con el catálogo de plantas:", error);
    } finally {
      setLoading(false);
    }
  };

  /* 🍂 ACOMODADO: Filtrado cruzado inteligente por nombre Y por temporada activa en el sistema */
  const plantasFiltradas = plantas.filter((planta) => {
    // 1. Filtro por coincidencia de texto del buscador
    const coincideBusqueda = planta.nombre?.toLowerCase().includes(busqueda.toLowerCase());

    // 2. Extraer el identificador de temporada (soportando ambas nomenclaturas de DB)
    const idTemp = planta.idTemporada || planta.id_temporada;

    // 3. Regla estacional: Si no tiene temporada asignada es de "Todo el año", por lo tanto SIEMPRE pasa.
    if (!idTemp) {
      return coincideBusqueda;
    }

    // Si tiene temporada, buscamos en el arreglo del sistema si esa ID está activa (activa === 1 o true)
    const datosDeLaTemporada = temporadas.find(t => Number(t.idTemporada) === Number(idTemp));
    const estaEstacionActiva = datosDeLaTemporada?.activa === 1 || datosDeLaTemporada?.activa === true;

    return coincideBusqueda && estaEstacionActiva;
  });

  return (
    <div className="container py-4">
      {/* 🌿 Encabezado Estilo Glassmorphic */}
      <div className="text-center mb-5 p-4" style={{ background: "rgba(255, 255, 255, 0.6)", borderRadius: "20px", backdropFilter: "blur(10px)" }}>
        <h2 className="fw-bold m-0" style={{ color: "#1e4d2b", letterSpacing: "0.5px" }}>
          🌿 Catálogo Disponible — MSC Vivero {/* 🏷️ Corrección de MSC */}
        </h2>
        <p className="text-muted small mt-1 mb-4">Descubre nuestra variedad de plantas listas para decorar tu espacio.</p>
        
        {/* Input de Búsqueda */}
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="input-group shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
              <span className="input-group-text bg-white border-0 text-muted">🔍</span>
              <input
                type="text"
                className="form-control border-0 py-2 ps-1"
                placeholder="Buscar planta por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ fontSize: "14px", outline: "none" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* RENDERIZADO PRINCIPAL */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted small mt-2">Cargando las plantas del vivero...</p>
        </div>
      ) : plantasFiltradas.length === 0 ? (
        <div className="text-center py-5">
          <span style={{ fontSize: "40px" }}>🍂</span>
          <h5 className="text-muted mt-2">No hay plantas disponibles en este momento.</h5>
        </div>
      ) : (
        /* Cuadrícula de Plantas */
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {plantasFiltradas.map((planta) => (
            <div className="col" key={planta.idPlanta}>
              <div 
                className="card h-100 border-0 shadow-sm" 
                style={{ 
                  borderRadius: "16px", 
                  overflow: "hidden", 
                  backgroundColor: "#ffffff",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Contenedor de la Imagen */}
                <div style={{ height: "200px", backgroundColor: "#f8f9fa", overflow: "hidden", position: "relative" }}>
                  <img
                    src={planta.imagenUrl || "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=500&auto=format&fit=crop"} 
                    alt={planta.nombre}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=500&auto=format&fit=crop";
                    }}
                  />
                  
                  {/* ☀️ / ☁️ ETIQUETA DE UBICACIÓN (SOL O SOMBRA) */}
                  <span 
                    className="position-absolute top-0 start-0 small px-2 py-1 m-2 fw-bold text-uppercase shadow-sm"
                    style={{ 
                      fontSize: "11px", 
                      borderRadius: "8px",
                      backgroundColor: planta.ubicacionInvernadero === "Sol" ? "#fff3cd" : "#e2e3e5",
                      color: planta.ubicacionInvernadero === "Sol" ? "#856404" : "#383d41",
                    }}
                  >
                    {planta.ubicacionInvernadero === "Sol" ? "☀️ Sol" : "☁️ Sombra"}
                  </span>

                  {/* Etiqueta de Agotado */}
                  {planta.stock <= 0 && (
                    <span className="position-absolute top-0 end-0 bg-secondary text-white small px-2 py-1 m-2 rounded fw-bold" style={{ fontSize: "10px" }}>
                      AGOTADO
                    </span>
                  )}
                </div>

                {/* Datos de la Planta */}
                <div className="card-body d-flex flex-column justify-content-between p-3">
                  <div>
                    <h6 className="fw-bold text-dark mb-1 text-capitalize">{planta.nombre}</h6>
                    {planta.nombreCientifico && (
                      <p className="text-muted small fst-italic mb-2" style={{ fontSize: "12px" }}>
                        {planta.nombreCientifico}
                      </p>
                    )}
                  </div>
                  
                  {/* Contenedor de Precio */}
                  <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top border-light">
                    <span className="text-muted small" style={{ fontSize: "12px" }}>Precio Público</span>
                    <span className="fw-bold fs-5" style={{ color: "#2e7d32" }}>
                      ${parseFloat(planta.precio).toFixed(2)}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}