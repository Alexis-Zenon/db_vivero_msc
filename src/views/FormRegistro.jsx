// FormRegistro.jsx
import { useState } from "react";

export default function FormRegistro({ onCambiarVista }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setExito(false);

    try {
      // Conexión a tu endpoint de creación de clientes de NestJS
      // FormRegistro.jsx (Línea 18 aproximada)
      const response = await fetch(
        "https://db-vivero-msc.onrender.com/usuarios/registrar-cliente",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, email, telefono, password }),
        },
      );

      const datos = await response.json();

      if (response.ok) {
        setExito(true);
        setTimeout(() => onCambiarVista("login"), 2000); // Regresa al login tras 2 segundos
      } else {
        setError(datos.message || "Error al registrar el cliente");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h5 className="fw-bold mb-3 text-center text-uppercase">
        Registrar Nuevo Cliente
      </h5>

      {error && (
        <div className="alert alert-danger py-2 small text-center">{error}</div>
      )}
      {exito && (
        <div className="alert alert-success py-2 small text-center">
          ¡Cliente registrado con éxito!
        </div>
      )}

      <div className="mb-3">
        <input
          type="text"
          className="form-control bg-transparent border-0 text-white placeholder-white"
          style={{ borderBottom: "2px solid white", borderRadius: 0 }}
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <input
          type="email"
          className="form-control bg-transparent border-0 text-white placeholder-white"
          style={{ borderBottom: "2px solid white", borderRadius: 0 }}
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control bg-transparent border-0 text-white placeholder-white"
          style={{ borderBottom: "2px solid white", borderRadius: 0 }}
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <input
          type="password"
          className="form-control bg-transparent border-0 text-white placeholder-white"
          style={{ borderBottom: "2px solid white", borderRadius: 0 }}
          placeholder="Contraseña segura"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-white w-100 fw-bold py-2 mb-3 shadow-sm"
        style={{
          backgroundColor: "#ffffff",
          color: "#8d20ae",
          borderRadius: "30px",
        }}
      >
        Registrar Cliente
      </button>

      <button
        type="button"
        className="btn btn-link w-100 text-white text-decoration-none text-center small"
        onClick={() => onCambiarVista("login")}
      >
        ← Volver al Inicio de Sesión
      </button>
    </form>
  );
}
