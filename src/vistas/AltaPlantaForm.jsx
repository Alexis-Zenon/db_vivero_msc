// AltaPlantaForm.jsx
import React, { useState } from "react";

export default function AltaPlantaForm({ temporadas, onPlantaRegistrada }) {
  // Estado inicial del formulario adaptado al CreatePlantaDto
  const [formData, setFormData] = useState({
    nombre: "",
    nombreCientifico: "",
    precio: "",
    stock: "",
    ubicacionInvernadero: "Sol", 
    imagenUrl: "",
    idTemporada: "", 
  });

  const [guardando, setGuardando] = useState(false);

  // Manejador para actualizar el estado cuando el usuario escribe o selecciona
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 🔥 DEJA SOLO ESTA FUNCIÓN (LA QUE TIENE TODA LA LÓGICA DE NEGOCIO)
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setGuardando(true);

    // Estructuramos el cuerpo de la petición con los tipos de datos correctos
    const cuerpoPlanta = {
      nombre: formData.nombre.trim(),
      nombreCientifico: formData.nombreCientifico.trim() || null,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock, 10),
      ubicacionInvernadero: formData.ubicacionInvernadero,
      imagenUrl: formData.imagenUrl.trim() || null,
      idTemporada: formData.idTemporada ? parseInt(formData.idTemporada, 10) : null,
    };

    try {
      const respuesta = await fetch("http://https://db-vivero-msc.onrender.com/plantas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cuerpoPlanta),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        alert("✨ ¡Nueva planta registrada exitosamente en el catálogo!");

        // Limpiamos el formulario para el siguiente registro
        setFormData({
          nombre: "",
          nombreCientifico: "",
          precio: "",
          stock: "",
          ubicacionInvernadero: "Sol",
          imagenUrl: "",
          idTemporada: "",
        });

        // Refrescamos automáticamente el estado global del Dashboard
        if (onPlantaRegistrada) onPlantaRegistrada();
      } else {
        // Aquí cachamos el ConflictException del backend si el nombre ya existe
        alert(`❌ Error del servidor: ${datos.message || "No se pudo insertar la planta"}`);
      }
    } catch (error) {
      console.error("Error al conectar con el endpoint POST de NestJS:", error);
      alert("❌ Error de red: Verifica que tu servidor NestJS esté corriendo.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    // ... todo tu bloque de HTML/JSX del return se queda exactamente igual
    <div className="container py-3" style={{ maxWidth: "850px" }}>
      {/* Encabezado */}
      <div className="mb-4">
        <h2 className="fw-bold m-0" style={{ color: "#1e4d2b" }}>
          ➕ Registro de Nueva Planta
        </h2>
        <p className="text-muted small m-0">
          Introduce las características de la planta para incorporarla al
          inventario y punto de venta.
        </p>
      </div>

      {/* Tarjeta del Formulario */}
      <div
        className="card border-0 shadow-sm p-4"
        style={{ borderRadius: "20px" }}
      >
        <form onSubmit={manejarEnvio}>
          <div className="row">
            {/* Columna 1: Datos de Identificación */}
            <div className="col-md-6 border-end pe-md-4">
              <h5 className="fw-bold mb-3" style={{ color: "#345e43" }}>
                📋 Datos Básicos
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase">
                  Nombre Comercial *
                </label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  placeholder="Ej. Girasol, Cuna de Moisés"
                  required
                  value={formData.nombre}
                  onChange={manejarCambio}
                  style={{ borderRadius: "8px" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase">
                  Nombre Científico
                </label>
                <input
                  type="text"
                  name="nombreCientifico"
                  className="form-control"
                  placeholder="Ej. Helianthus annuus (Opcional)"
                  value={formData.nombreCientifico}
                  onChange={manejarCambio}
                  style={{ borderRadius: "8px" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase">
                  URL de la Imagen
                </label>
                <input
                  type="url"
                  name="imagenUrl"
                  className="form-control"
                  placeholder="https://enlace-de-la-imagen.com/foto.jpg"
                  value={formData.imagenUrl}
                  onChange={manejarCambio}
                  style={{ borderRadius: "8px" }}
                />
              </div>
            </div>

            {/* Columna 2: Logística, Costos y Ambiente */}
            <div className="col-md-6 ps-md-4 mt-4 mt-md-0">
              <h5 className="fw-bold mb-3" style={{ color: "#345e43" }}>
                🌱 Control y Logística
              </h5>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label small fw-bold text-muted text-uppercase">
                    Precio Público *
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">$</span>
                    <input
                      type="number"
                      name="precio"
                      step="0.01"
                      className="form-control"
                      placeholder="0.00"
                      required
                      value={formData.precio}
                      onChange={manejarCambio}
                      style={{ borderRadius: "0 8px 8px 0" }}
                    />
                  </div>
                </div>

                <div className="col-6 mb-3">
                  <label className="form-label small fw-bold text-muted text-uppercase">
                    Stock Inicial *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    className="form-control"
                    placeholder="Cantidad"
                    required
                    value={formData.stock}
                    onChange={manejarCambio}
                    style={{ borderRadius: "8px" }}
                  />
                </div>
              </div>

              {/* Selector de Exposición al Sol o Sombra */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase">
                  Requisito de Luz (Ambiente) *
                </label>
                <select
                  name="ubicacionInvernadero"
                  className="form-select"
                  value={formData.ubicacionInvernadero}
                  onChange={manejarCambio}
                  style={{ borderRadius: "8px" }}
                >
                  <option value="Sol">
                    ☀️ Planta de Sol (Exposición directa)
                  </option>
                  <option value="Sombra">
                    ☁️ Planta de Sombra (Invernadero techado)
                  </option>
                </select>
              </div>

              {/* Selector de Temporada dinámico corregido sin etiquetas TR */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase">
                  Temporada Asociada
                </label>
                <select
                  name="idTemporada"
                  className="form-select"
                  value={formData.idTemporada || ""}
                  onChange={manejarCambio}
                  style={{ borderRadius: "8px" }}
                >
                  <option value="">Ninguna (Disponible todo el año)</option>
                  {temporadas &&
                    temporadas.map((temp) => {
                      // 1. Detectamos el ID sin importar si viene como id_temporada, idTemporada o id
                      const idVal =
                        temp.id_temporada || temp.idTemporada || temp.id;

                      // 2. Detectamos el nombre real mapeando las opciones comunes de la BD
                      const nombreVal =
                        temp.nombre_temporada ||
                        temp.nombreTemporada ||
                        temp.nombre ||
                        temp.temporada;

                      return (
                        <option key={idVal} value={idVal}>
                          🍂 {nombreVal ? nombreVal : "(Inactiva)"}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
          </div>

          {/* Botones de acción inferiores */}
          <div className="d-flex justify-content-end gap-2 border-top pt-3 mt-4">
            <button
              type="submit"
              className="btn text-white fw-bold px-5 py-2 shadow-sm"
              style={{
                backgroundColor: "#1e4d2b",
                border: "none",
                borderRadius: "10px",
              }}
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Registrando...
                </>
              ) : (
                "💾 Registrar Planta"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
