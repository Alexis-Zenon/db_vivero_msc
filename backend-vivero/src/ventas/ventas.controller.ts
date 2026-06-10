import { Controller, Post, Body } from '@nestjs/common';
import { VentasService } from './ventas.service';

@Controller('ventas') // 📍 Habilita el endpoint https://db-vivero-msc.onrender.com/ventas
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  async registrarNuevaVenta(@Body() body: any) {
    // Recibe el JSON completo con el cajero, total y el arreglo de productos desde React
    return this.ventasService.registrarVenta(body);
  }
}
