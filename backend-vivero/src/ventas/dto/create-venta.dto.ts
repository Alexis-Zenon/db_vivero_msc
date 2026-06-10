export class CreateVentaDto {
  id_usuario_cajero: number;
  id_cliente?: number;
  metodo_pago: string;
  total: number;

  // 👈 Agrega esto para que no te marque error al separar (...datosCabecera)
  detalles: any[]; 
}
