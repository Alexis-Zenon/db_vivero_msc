import { useState } from "react";
import PuntoDeVenta from "./PuntoDeVenta"; // Tu componente base actual
import RegistroMermas from "./RegistroMermas"; // Tu interfaz de mermas existente

export default function VistaEmpleado({ plantas, temporadas, usuario, datosTicket, onVentaCompletada }) {
  const [subSeccion, setSubSeccion] = useState("pos"); // 'pos' o 'mermas'

  return (
    <div className="w-100">
      {/* Selector de módulos estilo barra de herramientas */}
      <div className="bg-light p-2 mb-3 d-flex gap-2 shadow-sm" style={{ borderRadius: "10px" }}>
        <button 
          className={`btn ${subSeccion === "pos" ? "btn-success" : "btn-light"}`}
          onClick={() => setSubSeccion("pos")}
        >
          🛒 Punto de Venta y Caja
        </button>
        <button 
          className={`btn ${subSeccion === "mermas" ? "btn-danger" : "btn-light"}`}
          onClick={() => setSubSeccion("mermas")}
        >
          🍂 Registro de Pérdidas (Mermas)
        </button>
      </div>

      {/* Renderizado Condicional de la Herramienta */}
      {subSeccion === "pos" ? (
        <PuntoDeVenta 
          plantas={plantas}
          temporadas={temporadas}
          usuario={usuario}
          datosTicket={datosTicket}
          onVentaCompletada={onVentaCompletada}
        />
      ) : (
        <RegistroMermas usuario={usuario} />
      )}
    </div>
  );
}