// src/views/DashboardGeneral.jsx
import { useState, useEffect } from "react";
import miLogo from "../assets/logotipo.png";
import ModalTemporadas from "./ModalTemporadas";

import PuntoDeVenta from "../vistas/PuntoDeVenta";
import CatalogoCliente from "../vistas/CatalogoCliente";
import RegistroMermas from "../vistas/RegistroMermas";
import BitacoraEmpleados from "../vistas/BitacoraEmpleados";
import AltaAdministradores from "../vistas/AltaAdministradores";

import InventarioGeneral from "../vistas/InventarioGeneral";
import AltaPlantaForm from "../vistas/AltaPlantaForm";
import BalanceFinanciero from "../vistas/BalanceFinanciero"; 
// ➕ PASO 1: Importar el nuevo módulo de gestión de fechas
import GestionTemporadas from "../vistas/GestionTemporadas"; 

import ModalConfigLocalidad from "./ModalConfigLocalidad";

export default function DashboardGeneral({ usuario, onLogout }) {
  const rolUsuario = usuario?.rol || "Cliente";

  const [vistaActiva, setVistaActiva] = useState(
    rolUsuario.toLowerCase() === "cliente" ? "catalogo" : "pos"
  );

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalConfigAbierto, setModalConfigAbierto] = useState(false);
  const [modalTemporadasAbierto, setModalTemporadasAbierto] = useState(false);

  const [datosTicket, setDatosTicket] = useState(null);
  const [temporadas, setTemporadas] = useState([]);
  const [plantas, setPlantas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 PASO 2: Centralizar la función de carga para reutilizarla al refrescar estados
  const obtenerDatosDelVivero = async () => {
    try {
      // Carga de temporadas
      try {
        const resTemporadas = await fetch('http://db-vivero-msc.onrender.com/temporadas');
        if (resTemporadas.ok) setTemporadas(await resTemporadas.json());
      } catch (errTemp) {
        console.error("Error al cargar temporadas:", errTemp);
      }

      // Carga de plantas
      try {
        const resPlantas = await fetch('http://db-vivero-msc.onrender.com/plantas');
        if (resPlantas.ok) {
          const dataPlantas = await resPlantas.json();
          setPlantas(dataPlantas);
        }
      } catch (errPlantas) {
        console.error("Error al cargar el catálogo de plantas:", errPlantas);
      }
    } catch (error) {
      console.error("Error en la actualización de datos:", error);
    }
  };

  useEffect(() => {
    const cargaInicial = async () => {
      setLoading(true);
      await obtenerDatosDelVivero();
      
      // Carga de configuración del ticket
      try {
        const resConfig = await fetch('http://db-vivero-msc.onrender.com/config-ticket');
        if (resConfig.ok) {
          const datosBD = await resConfig.json();
          if (datosBD) setDatosTicket(datosBD);
        }
      } catch (errConfig) {
        console.error("Error al conectar con /config-ticket:", errConfig);
      }
      setLoading(false);
    };
    
    cargaInicial();
  }, []);

  const refrescarCatalogo = async () => {
    await obtenerDatosDelVivero();
  };

  const guardarConfiguracionLocalidad = async (nuevosDatos) => {
    try {
      const respuesta = await fetch('http://db-vivero-msc.onrender.com/config-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevosDatos),
      });

      if (respuesta.ok) {
        const configActualizada = await respuesta.json();
        setDatosTicket(configActualizada);
        alert("¡Configuración del ticket actualizada en la Base de Datos!");
      } else {
        alert("El backend devolvió un error al intentar guardar.");
      }
    } catch (error) {
      console.error("Error al conectar con /config-ticket al guardar:", error);
      alert("Error de red: No se pudo conectar con el servidor.");
    }
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div className="position-relative vh-100 d-flex flex-column bg-light">
      
      {/* ==================== MENÚ LATERAL PRINCIPAL ==================== */}
      {menuAbierto && (
        <div 
          className="position-fixed top-0 start-0 vh-100 p-4 text-white shadow-lg d-flex flex-column" 
          style={{ width: "340px", backgroundColor: "#345e43", zIndex: 1050, borderRadius: "0 25px 25px 0" }}
        >
          <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
            <div>
              <h4 className="m-0 fw-bold">Mago(MSC)</h4>
              <span className="badge bg-warning text-dark mt-1 fw-bold text-uppercase">✨ {rolUsuario}</span>
            </div>
            <button className="btn btn-outline-light btn-sm rounded-circle" onClick={() => setMenuAbierto(false)}>✕</button>
          </div>

          <div className="flex-grow-1 overflow-auto pe-1 d-flex flex-column gap-2" style={{ maxHeight: "calc(100vh - 160px)" }}>
            
            {(rolUsuario.toLowerCase() === "administrador" || rolUsuario.toLowerCase() === "empleado") && (
              <>
                <div className="text-white-50 small fw-bold mt-2 text-uppercase">Operaciones de Venta</div>
                <button 
                  className={`btn text-start py-2 d-flex align-items-center gap-2 ${vistaActiva === 'pos' ? 'btn-light text-dark fw-bold' : 'btn-dark'}`}
                  onClick={() => { setVistaActiva("pos"); setMenuAbierto(false); }}
                >
                  <span>🌿</span> Punto de Venta
                </button>

                <div className="text-white-50 small fw-bold mt-2 text-uppercase">Mermas e Incidencias</div>
                <button 
                  className={`btn text-start py-2 d-flex align-items-center gap-2 ${vistaActiva === 'mermas' ? 'btn-light text-dark fw-bold' : 'btn-dark'}`}
                  onClick={() => { setVistaActiva("mermas"); setMenuAbierto(false); }}
                >
                  <span>📉</span> Pérdidas de Plantas
                </button>
              </>
            )}

            <div className="text-white-50 small fw-bold mt-2 text-uppercase">Consulta</div>
            <button 
              className={`btn text-start py-2 d-flex align-items-center gap-2 ${vistaActiva === 'catalogo' ? 'btn-light text-dark fw-bold' : 'btn-dark'}`}
              onClick={() => { setVistaActiva("catalogo"); setMenuAbierto(false); }}
            >
              <span>🌸</span> Ver Catálogo Disponible
            </button>

            {rolUsuario.toLowerCase() === "administrador" && (
              <>
                <div className="text-white-50 small fw-bold mt-3 text-uppercase">Gestión de Producción</div>
                
                <div className="d-flex flex-column bg-black bg-opacity-25 rounded p-1 gap-1">
                  <button 
                    className={`btn text-start py-2 d-flex align-items-center gap-2 ${vistaActiva === 'inventario' ? 'btn-light text-dark fw-bold' : 'btn-dark'}`}
                    onClick={() => { setVistaActiva("inventario"); setMenuAbierto(false); }}
                  >
                    <span>📋</span> Inventario General
                  </button>

                  <button 
                    className={`btn text-start py-2 d-flex align-items-center gap-2 ${vistaActiva === 'alta-planta' ? 'btn-light text-dark fw-bold' : 'btn-dark'}`}
                    onClick={() => { setVistaActiva("alta-planta"); setMenuAbierto(false); }}
                  >
                    <span>➕</span> Dar de Alta Planta
                  </button>

                  {/* ⚡ BOTÓN DEL MODAL INTERRUPTOR QUICK-SWITCH */}
                  <button className="btn btn-dark text-start py-2 d-flex align-items-center justify-content-between" onClick={() => { setModalTemporadasAbierto(true); setMenuAbierto(false); }}>
                    <span>🍂 Interruptor de Época</span>
                    <span className="badge bg-success text-white" style={{ fontSize: "10px" }}>Auto / Manual</span>
                  </button>

                  {/* ➕ PASO 3: BOTÓN DE CONFIGURACIÓN DE FECHAS EN EL MENÚ */}
                  <button 
                    className={`btn text-start py-2 d-flex align-items-center gap-2 ${vistaActiva === 'gestion-temporadas' ? 'btn-light text-dark fw-bold' : 'btn-dark'}`}
                    onClick={() => { setVistaActiva("gestion-temporadas"); setMenuAbierto(false); }}
                  >
                    <span>⚙️</span> Configurar Fechas Estacionales
                  </button>
                </div>

                <div className="text-white-50 small fw-bold mt-3 text-uppercase">Auditoría y Finanzas</div>
                <button 
                  className={`btn text-start py-2 d-flex align-items-center gap-2 ${vistaActiva === 'balance' ? 'btn-light text-dark fw-bold' : 'btn-dark'}`}
                  onClick={() => { setVistaActiva("balance"); setMenuAbierto(false); }}
                >
                  <span>📊</span> Balance de Temporadas
                </button>
                
                <button 
                  className={`btn text-start py-2 d-flex align-items-center gap-2 ${vistaActiva === 'bitacora' ? 'btn-light text-dark fw-bold' : 'btn-dark'}`} 
                  onClick={() => { setVistaActiva("bitacora"); setMenuAbierto(false); }}
                >
                  <span>👁️‍🗨️</span> Bitácora de Empleados
                </button>

                <div className="text-white-50 small fw-bold mt-3 text-uppercase">Estructura</div>
                <button 
                  className={`btn text-start py-2 d-flex align-items-center gap-2 ${vistaActiva === 'altaAdmin' ? 'btn-light text-dark fw-bold' : 'btn-dark'}`} 
                  onClick={() => { setVistaActiva("altaAdmin"); setMenuAbierto(false); }}
                >
                  <span>🛡️</span> Alta de Administradores
                </button>
                <button className="btn btn-warning text-start py-2 fw-bold text-dark d-flex align-items-center gap-2" onClick={() => { setModalConfigAbierto(true); setMenuAbierto(false); }}>
                  <span>📍</span> Configurar Ticket de Localidad
                </button>
              </>
            )}
          </div>

          <div className="border-top pt-3 mt-auto">
            <button className="btn btn-danger w-100 py-2 fw-bold" onClick={onLogout}>
              {rolUsuario.toLowerCase() === "cliente" ? "🚪 Salir del Catálogo" : "🔒 Cerrar Sesión"}
            </button>
          </div>
        </div>
      )}

      {/* ==================== ENCABEZADO SUPERIOR ==================== */}
      <header className="p-3 text-white d-flex align-items-center gap-3" style={{ backgroundColor: "#1e4d2b" }}>
        <button className="btn btn-success p-2" onClick={() => setMenuAbierto(true)}>☰</button>
        <h4 className="m-0 flex-grow-1">Sistema MSC Vivero</h4> {/* 🏷️ Corrección de MSC */}
        <img src={miLogo} alt="Logo" style={{ width: "45px", height: "45px", borderRadius: "50%" }} />
      </header>

      {/* ==================== ÁREA DE CONTENIDO DINÁMICO ==================== */}
      <main className="flex-grow-1 overflow-auto p-3">
        {vistaActiva === "pos" && (
          <PuntoDeVenta 
            plantas={plantas} 
            temporadas={temporadas} 
            usuario={usuario} 
            datosTicket={datosTicket || { nombreVivero: "Cargando...", direccion: "" }} 
            onVentaCompletada={refrescarCatalogo}
          />
        )}

        {vistaActiva === "catalogo" && (
          /* 🛡️ PASADO: Enviamos las temporadas al Catálogo para que filtre localmente */
          <CatalogoCliente plantas={plantas} temporadas={temporadas} />
        )}

        {vistaActiva === "mermas" && (
          <RegistroMermas plantas={plantas} onMermaRegistrada={refrescarCatalogo} />
        )}

        {vistaActiva === "inventario" && (
          <InventarioGeneral plantas={plantas} temporadas={temporadas} onInventarioModificado={refrescarCatalogo} />
        )}

        {vistaActiva === "alta-planta" && (
          <AltaPlantaForm temporadas={temporadas} onPlantaRegistrada={refrescarCatalogo} />
        )}

        {vistaActiva === "balance" && (
          <BalanceFinanciero />
        )}

        <div className="text-white-50 small fw-bold mt-2 text-uppercase">Consulta</div>
        <button 
          className={`btn text-start py-2 d-flex align-items-center gap-2 ${vistaActiva === 'catalogo' ? 'btn-light text-dark fw-bold' : 'btn-dark'}`}
          onClick={() => { setVistaActiva("catalogo"); setMenuAbierto(false); }}
        >
          <span>🌸</span> Ver Catálogo Disponible
        </button>

        {/* ➕ PASO 4: Renderizado de la nueva pantalla completa de Gestión de Fechas */}
        {vistaActiva === "gestion-temporadas" && (
          <GestionTemporadas />
        )}

        {vistaActiva === "bitacora" && (
          <BitacoraEmpleados />
        )}

        {vistaActiva === "altaAdmin" && (
          <AltaAdministradores 
            usuarioActivo={usuario} 
            onRegistroExitoso={() => setVistaActiva("bitacora")} 
          />
        )}
      </main>

      {/* ==================== MODALES ==================== */}
      <ModalConfigLocalidad 
        isOpen={modalConfigAbierto} 
        onClose={() => setModalConfigAbierto(false)} 
        datosTicket={datosTicket || { nombreVivero: "", direccion: "", localidad: "", telefono: "", leyenda: "" }} 
        onSave={guardarConfiguracionLocalidad} 
        usuario={usuario}
      />

      {/* 🔄 PASO 5: Vinculación de la función refrescar para que actualice todo en caliente */}
      <ModalTemporadas 
        isOpen={modalTemporadasAbierto} 
        onClose={() => setModalTemporadasAbierto(false)} 
        temporadas={temporadas} 
        plantas={plantas} 
        onRefrescarDatos={obtenerDatosDelVivero}
      />
    </div>
  );
}