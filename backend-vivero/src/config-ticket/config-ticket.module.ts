// src/config-ticket/config-ticket.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigTicketService } from './config-ticket.service';
import { ConfigTicketController } from './config-ticket.controller';
import { ConfigTicket } from './entities/config-ticket.entity'; // 👈 Asegúrate de importar tu entidad del ticket

@Module({
  imports: [
    // 👇 ESTA LÍNEA ES LA QUE LE FALTA A TU MODULO PARA CONECTAR EL REPOSITORIO
    TypeOrmModule.forFeature([ConfigTicket]), 
  ],
  controllers: [ConfigTicketController],
  providers: [ConfigTicketService],
})
export class ConfigTicketModule {}
