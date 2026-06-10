// AltaAdministradores.jsx
import React, { useState } from "react";

export default function AltaAdministradores({ usuarioActivo, onRegistroExitoso }) {
  const [formData, setFormData] = useState({ nombre: "", correo: "", contrasena: "", rol: "empleado" });
  const [guardando, setGuardando] = useState(false);
  const [mostrarModalSeguridad, setMostrarModalSeguridad] = useState(false);
  const [passAdmin, setPassAdmin] = useState("");
  const [rolPendiente, setRolPendiente] = useState(null); // Guarda temporalmente el rol seleccionado

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ==========================================
  // 🛡️ INTERCEPTOR DEL SELECT DE ROL
  // ==========================================
  const interceptarCambioRol = (e) => {
    const nuevoRol = e.target.value;

    // Si intenta cambiar a administrador, interrumpimos con el modal de seguridad
    if (nuevoRol === "administrador") {
      setRolPendiente(nuevoRol);
      setPassAdmin("");
      setMostrarModalSeguridad(true);
    } else {
      // Si regresa a empleado, lo dejamos pasar sin pedir contraseña
      setFormData({ ...formData, rol: nuevoRol });
    }
  };

  // ==========================================
  // 🔐 VALIDAR CONTRASEÑA EN TIEMPO REAL
  // ==========================================
  const verificarYAutorizarRol = async () => {
    if (!passAdmin.trim()) {
      alert("🔒 Es obligatorio ingresar tu contraseña para validar la operación.");
      return;
    }

    const idAdmin = usuarioActivo?.id_usuario || usuarioActivo?.idUsuario || usuarioActivo?.id;

    if (!idAdmin) {
      alert("⚠️ Error de sesión: No se encuentra el ID del administrador actual.");
      setFormData({ ...formData, rol: "empleado" });
      setMostrarModalSeguridad(false);
      return;
    }

    try {
      const resValida = await fetch("http://db-vivero-msc.onrender.com/usuarios/verificar-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: Number(idAdmin),
          password: passAdmin
        })
      });

      const respuestaClave = await resValida.json();

      if (!resValida.ok || !respuestaClave.valido) {
        alert("❌ Contraseña de administrador incorrecta. Cambio de rol denegado.");
        setFormData({ ...formData, rol: "empleado" });
        setMostrarModalSeguridad(false);
        return;
      }
    } catch (err) {
      alert("❌ Error de red al validar contraseña.");
      return;
    }

    setFormData({ ...formData, rol: rolPendiente });
    setMostrarModalSeguridad(false);
    alert("🔓 Privilegio de Administrador autorizado para este registro.");
  };

  const cancelarCambioRol = () => {
    // Si cancela, obligamos al select a quedarse en "empleado"
    setFormData({ ...formData, rol: "empleado" });
    setMostrarModalSeguridad(false);
  };

  // ==========================================
  // 🚀 ENVÍO FINAL DEL FORMULARIO
  // ==========================================
  const enviarFormulario = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.correo.trim() || !formData.contrasena.trim()) {
      alert("⚠️ Por favor, llena todos los campos obligatorios.");
      return;
    }

    setGuardando(true);

    try {
      const respuesta = await fetch("http://db-vivero-msc.onrender.com/usuarios/registrar-personal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idAdminActivo: usuarioActivo?.id_usuario || usuarioActivo?.idUsuario,
          nuevoUsuario: formData,
        }),
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        alert(`✨ Registro exitoso. El nuevo ${formData.rol} ha sido guardado.`);
        setFormData({ nombre: "", correo: "", contrasena: "", rol: "empleado" });
        if (typeof onRegistroExitoso === "function") onRegistroExitoso();
      } else {
        alert(`❌ Error: ${resultado.message || "No se pudo procesar la solicitud."}`);
      }
    } catch (error) {
      alert("❌ Error de red: No se pudo conectar con el servidor.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "600px" }}>
      <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
        <div className="mb-4 d-flex align-items-center gap-2">
          <span style={{ fontSize: "28px" }}>🛡️</span>
          <div>
            <h4 className="fw-bold m-0" style={{ color: "#1e4d2b" }}>Alta de Personal</h4>
            <p className="text-muted small m-0">Asigna un rol al nuevo usuario. Elevar a Administrador requiere validación inmediata.</p>
          </div>
        </div>

        <form onSubmit={enviarFormulario}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Nombre Completo *</label>
            <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={manejarCambio} required placeholder="Ej. Carlos Mendoza" style={{ borderRadius: "8px" }}/>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Correo Electrónico *</label>
            <input type="email" name="correo" className="form-control" value={formData.correo} onChange={manejarCambio} required placeholder="ejemplo@mscvivero.com" style={{ borderRadius: "8px" }}/>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Contraseña Asignada al Nuevo Usuario *</label>
            <input type="password" name="contrasena" className="form-control" value={formData.contrasena} onChange={manejarCambio} required placeholder="Mínimo 6 caracteres" style={{ borderRadius: "8px" }}/>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold text-secondary">Rol del Usuario *</label>
            {/* 🧭 AQUÍ ESTÁ EL CAMBIO INTERCEPTADO */}
            <select name="rol" className="form-select" value={formData.rol} onChange={interceptarCambioRol} style={{ borderRadius: "8px" }}>
              <option value="empleado">Empleado (Ventas e Inventario básico)</option>
              <option value="administrador">Administrador (Acceso total al sistema)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold py-2 shadow-sm" style={{ borderRadius: "10px", backgroundColor: "#1e4d2b" }} disabled={guardando}>
            {guardando ? "Procesando..." : "💾 Registrar Cuenta de Acceso"}
          </button>
        </form>
      </div>

      {/* ==================== MODAL DE CONFIRMACIÓN DE SEGURIDAD ==================== */}
      {mostrarModalSeguridad && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1200 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "420px" }}>
            <div className="modal-content border-0 p-3" style={{ borderRadius: "20px" }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-danger">⚠️ Validación Obligatoria</h5>
              </div>
              <div className="modal-body py-2">
                <p className="text-muted small">
                  Estás intentando otorgar privilegios de <strong>Administrador</strong> a una cuenta nueva. 
                  Por favor, confirma tu identidad introduciendo tu contraseña actual:
                </p>
                <input 
                  type="password" 
                  className="form-control mt-2" 
                  placeholder="Tu contraseña de administrador" 
                  value={passAdmin} 
                  onChange={(e) => setPassAdmin(e.target.value)} 
                  style={{ borderRadius: "8px" }}
                />
              </div>
              <div className="modal-footer border-0 pt-2 d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-light btn-sm fw-bold px-3" onClick={cancelarCambioRol}>Cancelar</button>
                <button type="button" className="btn btn-danger btn-sm fw-bold px-4" onClick={verificarYAutorizarRol}>Autorizar Privilegio</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}