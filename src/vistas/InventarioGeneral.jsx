// InventarioGeneral.jsx
import React, { useState } from "react";

// 🔄 PASO 1: Recibimos "temporadas" como prop desde el Dashboard
export default function InventarioGeneral({
  plantas,
  temporadas,
  onInventarioModificado,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [letraSeleccionada, setLetraSeleccionada] = useState("Todas");
  const [plantaEditando, setPlantaEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const abecedario = ["Todas", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

  const plantasFiltradas = plantas.filter((planta) => {
    const nombrePlanta = planta.nombre
      ? planta.nombre.trim().toLowerCase()
      : "";
    const nombreCientifico = planta.nombreCientifico
      ? planta.nombreCientifico.trim().toLowerCase()
      : "";
    const terminoBusqueda = busqueda.toLowerCase().trim();

    return (
      (nombrePlanta.includes(terminoBusqueda) ||
        nombreCientifico.includes(terminoBusqueda)) &&
      (letraSeleccionada === "Todas" ||
        nombrePlanta.startsWith(letraSeleccionada.toLowerCase()))
    );
  });

  const abrirEditor = (planta) => {
    // 🔄 PASO 2: Extraer el ID de la temporada que tiene vinculada actualmente la planta
    // Si viene anidada como objeto usará planta.temporada?.idTemporada, de lo contrario planta.idTemporada
    const temporadaIdActual =
      planta.temporada?.idTemporada || planta.idTemporada || "";

    setPlantaEditando({
      id: planta.idPlanta || planta.id,
      nombre: planta.nombre,
      ubicacionInvernadero: planta.ubicacionInvernadero || "Sol",
      precio: planta.precio || 0,
      stock: planta.stock || 0,
      idTemporada: temporadaIdActual, // 👈 Agregado al estado local del formulario
    });
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const respuesta = await fetch(
        `http://https://db-vivero-msc.onrender.com/plantas/${plantaEditando.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ubicacionInvernadero: plantaEditando.ubicacionInvernadero,
            precio: parseFloat(plantaEditando.precio),
            stock: parseInt(plantaEditando.stock, 10),
            // 🔄 PASO 3: Enviamos el ID de la temporada seleccionado al backend (convertido a entero o null)
            idTemporada: plantaEditando.idTemporada
              ? parseInt(plantaEditando.idTemporada, 10)
              : null,
          }),
        },
      );

      if (respuesta.ok) {
        setPlantaEditando(null);
        onInventarioModificado();
      } else {
        alert("❌ Hubo un problema al actualizar la planta.");
      }
    } catch (error) {
      alert("❌ Error al conectar con el servidor.");
    } finally {
      setGuardando(false);
    }
  };

  const alternarVisibilidad = async (planta) => {
    const id = planta.idPlanta || planta.id;
    const estadoActual = planta.visible !== undefined ? planta.visible : true;
    const nuevoEstado = !estadoActual;

    try {
      const respuesta = await fetch(
        `http://https://db-vivero-msc.onrender.com/plantas/${id}/visibilidad`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visible: nuevoEstado }),
        },
      );

      if (respuesta.ok) {
        onInventarioModificado();
      } else {
        const errorData = await respuesta.json();
        alert(`❌ Error al cambiar visibilidad: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error de red al intentar ocultar la planta.");
    }
  };

  const manejarEliminar = async (planta) => {
    const id = planta.idPlanta || planta.id;

    if (
      window.confirm(
        `⚠️ ¿Estás completamente seguro de eliminar "${planta.nombre}" del sistema? Esta acción no se puede deshacer.`,
      )
    ) {
      try {
        const respuesta = await fetch(`http://https://db-vivero-msc.onrender.com/plantas/${id}`, {
          method: "DELETE",
        });

        if (respuesta.ok) {
          alert("🗑️ ¡Planta eliminada con éxito de la base de datos!");
          onInventarioModificado();
        } else {
          const errorData = await respuesta.json();
          alert(
            `❌ El backend rechazó la eliminación: ${errorData.message || "Error interno"}`,
          );
        }
      } catch (error) {
        console.error(error);
        alert("❌ Error de red: No se pudo comunicar con el servidor.");
      }
    }
  };

  return (
    <div className="container-fluid py-3" style={{ maxWidth: "1200px" }}>
      {/* Encabezado */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold m-0" style={{ color: "#1e4d2b" }}>
            🌿 Administración de Inventario General
          </h2>
          <p className="text-muted small m-0">Monitoreo global del vivero</p>
        </div>
        <button
          onClick={onInventarioModificado}
          className="btn text-white shadow-sm"
          style={{ backgroundColor: "#1e4d2b", border: "none" }}
        >
          🔄 Actualizar Tabla
        </button>
      </div>

      {/* Filtros */}
      <div
        className="card border-0 shadow-sm p-3 mb-4"
        style={{ borderRadius: "15px" }}
      >
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Buscar planta (letra por letra)..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ borderRadius: "10px" }}
        />
        <div className="d-flex flex-wrap gap-1">
          {abecedario.map((letra) => (
            <button
              key={letra}
              onClick={() => setLetraSeleccionada(letra)}
              className={`btn btn-sm font-monospace fw-bold ${letraSeleccionada === letra ? "btn-success text-white" : "btn-light border"}`}
              style={{
                minWidth: "34px",
                borderRadius: "6px",
                backgroundColor: letraSeleccionada === letra ? "#1e4d2b" : "",
              }}
            >
              {letra}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div
        className="card border-0 shadow-sm"
        style={{ borderRadius: "15px", overflow: "hidden" }}
      >
        <div className="table-responsive">
          <table className="table table-hover align-middle m-0">
            <thead
              className="text-white text-uppercase small"
              style={{ backgroundColor: "#1e4d2b", fontSize: "12px" }}
            >
              <tr>
                <th style={{ padding: "15px 12px", width: "70px" }}>Imagen</th>
                <th style={{ padding: "15px 12px" }}>Planta</th>
                <th
                  style={{ padding: "15px 12px" }}
                  className="d-none d-md-table-cell"
                >
                  Ambiente
                </th>
                <th
                  style={{ padding: "15px 12px" }}
                  className="d-none d-md-table-cell"
                >
                  Precio
                </th>
                <th
                  style={{ padding: "15px 12px" }}
                  className="d-none d-md-table-cell"
                >
                  Stock
                </th>
                <th style={{ padding: "15px 12px" }} className="text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {plantasFiltradas.map((planta, index) => {
                const stockActual = planta.stock || 0;
                const esSol =
                  (planta.ubicacionInvernadero || "Sol").toLowerCase() ===
                  "sol";
                const esVisible =
                  planta.visible !== undefined ? planta.visible : true;
                // Extraer nombre estacional para mostrar en móviles como tag secundario si aplica
                const nombreTemp =
                  planta.temporada?.nombreTemporada || "General";

                return (
                  <tr
                    key={planta.idPlanta || planta.id || index}
                    style={{ opacity: esVisible ? 1 : 0.6 }}
                  >
                    <td>
                      <img
                        src={
                          planta.imagenUrl ||
                          "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=150"
                        }
                        alt={planta.nombre}
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>
                      <div
                        className="fw-bold text-dark m-0"
                        style={{ fontSize: "14px" }}
                      >
                        {planta.nombre}
                      </div>
                      <div className="text-muted fst-italic small">
                        {planta.nombreCientifico || "Sin especificar"}
                        <span
                          className="badge bg-light text-muted ms-2 border"
                          style={{ fontSize: "10px" }}
                        >
                          🏷️ {nombreTemp}
                        </span>
                      </div>
                      <div className="d-block d-md-none mt-1">
                        <span className="badge bg-light text-dark border me-1">
                          {esSol ? "☀️ Sol" : "☁️ Sombra"}
                        </span>
                        <span className="badge bg-light text-success border">
                          ${parseFloat(planta.precio || 0).toFixed(2)}
                        </span>
                        <span
                          className={`badge ${stockActual <= 5 ? "bg-danger" : "bg-secondary"} ml-1`}
                        >
                          {stockActual} pz
                        </span>
                      </div>
                    </td>
                    <td className="d-none d-md-table-cell">
                      <span
                        className={`badge px-2 py-1 rounded-pill ${esSol ? "bg-warning-subtle text-warning-emphasis" : "bg-info-subtle text-info-emphasis"}`}
                      >
                        {esSol ? "☀️ Sol" : "☁️ Sombra"}
                      </span>
                    </td>
                    <td className="fw-bold d-none d-md-table-cell">
                      ${parseFloat(planta.precio || 0).toFixed(2)}
                    </td>
                    <td className="d-none d-md-table-cell">
                      <span
                        className={`badge px-2 py-1 ${stockActual <= 5 ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"}`}
                      >
                        {stockActual} pz
                      </span>
                    </td>
                    <td className="text-center" style={{ padding: "8px" }}>
                      <div className="d-inline-flex gap-1">
                        <button
                          onClick={() => abrirEditor(planta)}
                          className="btn btn-warning btn-sm p-1 px-2"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => alternarVisibilidad(planta)}
                          className={`btn btn-sm p-1 px-2 ${esVisible ? "btn-outline-secondary" : "btn-secondary"}`}
                          title={
                            esVisible
                              ? "Ocultar en catálogo"
                              : "Mostrar en catálogo"
                          }
                        >
                          {esVisible ? "👁️" : "🙈"}
                        </button>
                        <button
                          onClick={() => manejarEliminar(planta)}
                          className="btn btn-danger btn-sm p-1 px-2"
                          title="Eliminar permanentemente"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de edición */}
      {plantaEditando && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 2000,
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            className="card border-0 shadow-lg p-4"
            style={{ width: "400px", borderRadius: "15px" }}
          >
            <h5 className="fw-bold mb-3" style={{ color: "#1e4d2b" }}>
              ✏️ Modificar Parámetros
            </h5>
            <form onSubmit={guardarCambios}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">
                  Exposición
                </label>
                <select
                  className="form-select"
                  value={plantaEditando.ubicacionInvernadero}
                  onChange={(e) =>
                    setPlantaEditando({
                      ...plantaEditando,
                      ubicacionInvernadero: e.target.value,
                    })
                  }
                >
                  <option value="Sol">☀️ Sol</option>
                  <option value="Sombra">☁️ Sombra</option>
                </select>
              </div>

              {/* 🔄 PASO 4: SELECTOR DINÁMICO DE TEMPORADAS EN EL MODAL */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">
                  Época / Temporada Asignada
                </label>
                <select
                  className="form-select"
                  value={plantaEditando.idTemporada}
                  onChange={(e) =>
                    setPlantaEditando({
                      ...plantaEditando,
                      idTemporada: e.target.value,
                    })
                  }
                >
                  <option value="">Ninguna (Venta todo el año)</option>
                  {/* 🛡️ CORREGIDO: Con "|| []" evitamos que tire error si viene undefined */}
                  {(temporadas || []).map((temp) => (
                    <option key={temp.idTemporada} value={temp.idTemporada}>
                      🍂 {temp.nombreTemporada} ({temp.fechaInicio} a{" "}
                      {temp.fechaFin})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">
                  Precio ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  required
                  value={plantaEditando.precio}
                  onChange={(e) =>
                    setPlantaEditando({
                      ...plantaEditando,
                      precio: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">
                  Stock (Cantidad)
                </label>
                <input
                  type="number"
                  className="form-control"
                  required
                  value={plantaEditando.stock}
                  onChange={(e) =>
                    setPlantaEditando({
                      ...plantaEditando,
                      stock: e.target.value,
                    })
                  }
                />
              </div>

              <div className="d-flex gap-2 justify-content-end mt-4">
                <button
                  type="button"
                  className="btn btn-light border btn-sm"
                  onClick={() => setPlantaEditando(null)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn text-white btn-sm px-3"
                  style={{ backgroundColor: "#1e4d2b" }}
                  disabled={guardando}
                >
                  💾 Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
