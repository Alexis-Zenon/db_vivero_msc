// src/views/FormLogin.jsx
import { useState } from "react";

export default function FormLogin({ onLoginSuccess, onCambiarVista, logo }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // En tu handleSubmit dentro de FormLogin.jsx
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: username, // 👈 DEBE SER 'correo' porque así lo espera el @Body()
          password: password,
        }),
      });

      const datos = await response.json();

      if (response.ok) {
        onLoginSuccess(datos, rememberMe);
      } else {
        setError(datos.message || "Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-center">
      <div className="mb-4 d-flex justify-content-center">
        <div
          className="bg-white d-flex justify-content-center align-items-center shadow"
          style={{
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <img
            src={logo}
            alt="Logo Vivero"
            style={{ width: "100%", objectFit: "contain" }}
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger py-2 small text-center">{error}</div>
      )}

      <div className="mb-3">
        <div
          className="input-group"
          style={{ borderBottom: "2px solid white" }}
        >
          <span className="input-group-text bg-transparent border-0 text-white">
            👤
          </span>
          <input
            type="text"
            className="form-control bg-transparent border-0 text-white placeholder-white"
            placeholder="Usuario o Correo"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="mb-3">
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
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4 small">
        
        <button
          type="button"
          className="btn btn-link p-0 text-white text-decoration-none border-bottom border-white small"
          onClick={() => onCambiarVista("recuperar")}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <button
        type="submit"
        className="btn btn-white w-100 fw-bold py-2 shadow-sm"
        style={{
          backgroundColor: "#ffffff",
          color: "#8d20ae",
          borderRadius: "30px",
        }}
      >
        Iniciar Sesión
      </button>

      <div className="mt-4 pt-2 small">
        <p className="mb-1 text-white-50">No tienes una cuenta?</p>
        <button
          type="button"
          className="btn btn-sm btn-outline-light px-4"
          style={{ borderRadius: "20px", fontSize: "0.8rem" }}
          onClick={() => onCambiarVista("registro")}
        >
          Crea una cuenta nueva
        </button>
      </div>
    </form>
  );
}
