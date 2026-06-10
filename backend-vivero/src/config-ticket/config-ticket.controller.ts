// config-ticket.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ConfigTicketService } from './config-ticket.service';

@Controller('config-ticket')
export class ConfigTicketController {
  constructor(private readonly configService: ConfigTicketService) {}

  @Get()
  getOrCreate() {
    // 👈 Llama al método correcto del servicio
    return this.configService.getOrCreate();
  }

  @Post()
  updateConfig(@Body() datos: any) {
    // 👈 Llama al método correcto del servicio
    return this.configService.updateConfig(datos);
  }
}
