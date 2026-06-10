import { Controller, Post, Get, Body, Query, ParseIntPipe } from '@nestjs/common';
import { MermasService } from './mermas.service';

@Controller('mermas')
export class MermasController {
  constructor(private readonly mermasService: MermasService) {}

  // POST: http://localhost:3000/mermas/registrar
  @Post('registrar')
  async crearMerma(
    @Body('idProducto', ParseIntPipe) idProducto: number,
    @Body('cantidad', ParseIntPipe) cantidad: number,
    @Body('motivo') motivo: string,
  ) {
    return await this.mermasService.registrarMerma(idProducto, cantidad, motivo);
  }

  // GET: http://localhost:3000/mermas/balance?periodo=mes
  @Get('balance')
  async verBalance(@Query('periodo') periodo: string = 'semana') {
    return await this.mermasService.obtenerBalance(periodo);
  }
}