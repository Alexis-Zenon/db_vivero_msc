// FormRecuperar.jsx
import { useState } from "react";

export default function FormRecuperar({ onCambiarVista }) {
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState(""); // 👈 NUEVO: Estado para almacenar el token de 6 dígitos
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [paso, setPaso] = useState(1); // Paso 1: Verificar correo | Paso 2: Cambiar contraseña
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Paso 1: Verificar si el correo existe en la base de datos
  const verificarCorreo = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      // Dentro de FormRecuperar.jsx, en la función verificarCorreo:
      const response = await fetch(
        "http://localhost:3000/auth/verificar-correo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // AQUÍ ESTÁ EL CAMBIO: El nombre de la llave debe ser "correo"
          body: JSON.stringify({ correo: email }),
        },
      );

      const datos = await response.json();

      if (response.ok) {
        setMensaje(
          "Usuario localizado. Por favor, ingresa el código enviado y asigna tu nueva contraseña.",
        );
        setPaso(2); // Avanza al paso 2
      } else {
        setError(datos.message || "El correo electrónico no está registrado.");
      }
    } catch (err) {
      setError("Error al comunicar con el servidor.");
    }
  };

  // Paso 2: Mandar el código y la nueva contraseña a validar y guardar
  const restablecerPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      const response = await fetch(
        "http://localhost:3000/auth/restablecer-password",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          // 🚀 Ajustado con los nombres de variables idénticos a tu backend
          body: JSON.stringify({
            correo: email,
            claveNueva: nuevaPassword,
            codigoRecibido: codigo,
          }),
        },
      );

      const datos = await response.json();

      if (response.ok) {
        setMensaje("¡Contraseña actualizada con éxito! Volviendo al login...");
        setTimeout(() => {
          onCambiarVista("login");
        }, 3000);
      } else {
        setError(datos.message || "No se pudo actualizar la contraseña.");
      }
    } catch (err) {
      setError("Error al procesar la actualización.");
    }
  };

  return (
    <div className="w-100">
      <h5 className="fw-bold mb-3 text-uppercase text-center">
        Recuperar Acceso
      </h5>

      {error && (
        <div className="alert alert-danger py-2 small text-center">{error}</div>
      )}
      {mensaje && (
        <div className="alert alert-info py-2 small text-center">{mensaje}</div>
      )}

      {paso === 1 ? (
        <form onSubmit={verificarCorreo} className="text-center">
          <p className="small text-white-50 mb-4">
            Ingresa tu correo registrado para comprobar tu identidad.
          </p>
          <div className="mb-4">
            <div
              className="input-group"
              style={{ borderBottom: "2px solid white" }}
            >
              <span className="input-group-text bg-transparent border-0 text-white">
                ✉️
              </span>
              <input
                type="email"
                className="form-control bg-transparent border-0 text-white placeholder-white"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn w-100 fw-bold py-2 mb-3 shadow-sm"
            style={{
              backgroundColor: "#ffffff",
              color: "#8d20ae",
              borderRadius: "30px",
            }}
          >
            Verificar Cuenta
          </button>
        </form>
      ) : (
        <form onSubmit={restablecerPassword} className="text-center">
          <p className="small text-white-50 mb-4">
            Ingresa los datos para restablecer la clave de{" "}
            <strong>{email}</strong>:
          </p>

          {/* 🔢 NUEVO: Input para recolectar el código de verificación */}
          <div className="mb-4">
            <div
              className="input-group"
              style={{ borderBottom: "2px solid white" }}
            >
              <span className="input-group-text bg-transparent border-0 text-white">
                🔢
              </span>
              <input
                type="text"
                className="form-control bg-transparent border-0 text-white placeholder-white"
                placeholder="Código de verificación (6 dígitos)"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                maxLength={6}
                required
              />
            </div>
          </div>

          {/* 🔒 Input de contraseña (Mantiene tu diseño original de Bootstrap) */}
          <div className="mb-4">
            <div
              className="input-group"
              style={{ borderBottom: "2px solid white" }}
            >
              <span className="input-group-text bg-transparent border-0 text-white">
                🔒
              </span>
              <input
                type="password"
                className="form-control bg-transparent border-0 text-white placeholder-white"
                placeholder="Nueva contraseña"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold py-2 mb-3 shadow-sm"
            style={{
              backgroundColor: "#ffc107",
              color: "#000",
              borderRadius: "30px",
            }}
          >
            Actualizar Contraseña
          </button>
        </form>
      )}

      <button
        type="button"
        className="btn btn-link w-100 text-white text-decoration-none text-center small"
        onClick={() => onCambiarVista("login")}
      >
        ← Cancelar y Volver
      </button>
    </div>
  );
}
