import React, { useState, useEffect } from "react";

// 💡 CORRECCIÓN: Agregamos "onMermaRegistrada" en los parámetros del componente
export default function RegistroMermas({ onMermaRegistrada }) {
  const [plantas, setPlantas] = useState([]);
  const [loadingPlantas, setLoadingPlantas] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Estado del formulario de mermas
  const [formData, setFormData] = useState({
    idProducto: "",
    cantidad: "",
    motivo: "",
  });

  // 1. Cargamos el catálogo de plantas al montar la vista
  useEffect(() => {
    obtenerPlantas();
  }, []);

  const obtenerPlantas = async () => {
    try {
      const respuesta = await fetch("https://db-vivero-msc.onrender.com/plantas");
      if (respuesta.ok) {
        const datos = await respuesta.json();
        // Filtrar solo las que tengan stock disponible para dar de baja
        setPlantas(datos.filter((p) => p.stock > 0));
      }
    } catch (error) {
      console.error("Error al traer las plantas para merma:", error);
    } finally {
      setLoadingPlantas(false);
    }
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 2. Envío de datos al Backend
  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    const idProd = parseInt(formData.idProducto, 10);
    const cant = parseInt(formData.cantidad, 10);

    if (!idProd || !cant || !formData.motivo.trim()) {
      alert("⚠️ Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Validar en el cliente que no intente mermar más de lo que hay en existencia
    const plantaSeleccionada = plantas.find((p) => p.idPlanta === idProd);
    if (plantaSeleccionada && cant > plantaSeleccionada.stock) {
      alert(`❌ Operación inválida. Solo hay ${plantaSeleccionada.stock} unidades disponibles in el inventario.`);
      return;
    }

    setGuardando(true);

    try {
      const respuesta = await fetch("https://db-vivero-msc.onrender.com/mermas/registrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idProducto: idProd,
          cantidad: cant,
          motivo: formData.motivo.trim(),
        }),
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        alert("🥀 Registro de pérdida guardado correctamente. Stock actualizado.");
        
        // Limpiar formulario
        setFormData({ idProducto: "", cantidad: "", motivo: "" });
        
        // 💡 CORRECCIÓN: Cerramos bien las llaves y ejecutamos el callback central
        if (typeof onMermaRegistrada === "function") {
          onMermaRegistrada();
        }
        
        // Recargar el catálogo local para actualizar los stock reflejados en el selector
        obtenerPlantas();
      } else {
        alert(`❌ Error: ${resultado.message || "No se pudo procesar el registro."}`);
      }
    } catch (error) {
      console.error("Error de red en mermas:", error);
      alert("❌ Error de red: No hay conexión con el backend de NestJS.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "700px" }}>
      {/* Encabezado */}
      <div className="mb-4">
        <h2 className="fw-bold m-0" style={{ color: "#721c24" }}>
          🥀 Registro de Mermas e Incidencias
        </h2>
        <p className="text-muted small m-0">
          Registra las pérdidas físicas de plantas muertas, rotas o dañadas para balancear la contabilidad de la temporada.
        </p>
      </div>

      {/* Tarjeta de Formulario con Estilo Uniforme */}
      <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
        <form onSubmit={manejarEnvio}>
          
          {/* 1. Selector de Planta */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted text-uppercase">
              Seleccionar Planta Afectada *
            </label>
            {loadingPlantas ? (
              <select className="form-select" disabled>
                <option>Cargando plantas...</option>
              </select>
            ) : (
              <select
                name="idProducto"
                className="form-select"
                value={formData.idProducto}
                onChange={manejarCambio}
                required
                style={{ borderRadius: "8px" }}
              >
                <option value="">-- Elige un producto del inventario --</option>
                {plantas.map((planta) => (
                  <option key={planta.idPlanta} value={planta.idPlanta}>
                    {planta.nombre} ({planta.stock} pz disponibles)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 2. Cantidad Perdida */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted text-uppercase">
              Cantidad de Unidades Perdidas *
            </label>
            <input
              type="number"
              name="cantidad"
              min="1"
              className="form-control"
              placeholder="Ej. 5"
              value={formData.cantidad}
              onChange={manejarCambio}
              required
              style={{ borderRadius: "8px" }}
            />
          </div>

          {/* 3. Motivo detallado */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted text-uppercase">
              Motivo del Descarte / Descripción del Daño *
            </label>
            <textarea
              name="motivo"
              rows="4"
              className="form-control"
              placeholder="Ej. Infección por plaga de hongo en hojas, daño por granizo, planta seca..."
              value={formData.motivo}
              onChange={manejarCambio}
              required
              style={{ borderRadius: "8px" }}
            ></textarea>
          </div>

          {/* Botón de Enviar */}
          <div className="d-flex justify-content-end border-top pt-3 mt-4">
            <button
              type="submit"
              className="btn text-white fw-bold px-5 py-2 shadow-sm"
              style={{
                backgroundColor: "#721c24",
                border: "none",
                borderRadius: "10px",
              }}
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Procesando Baja...
                </>
              ) : (
                "💾 Guardar Reporte de Pérdida"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}