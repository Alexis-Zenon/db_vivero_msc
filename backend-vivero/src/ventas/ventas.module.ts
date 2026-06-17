// ventas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Venta } from './entities/venta.entity'; 
import { DetalleVenta } from './entities/detalle-venta.entity'; // 👈 1. Importa la entidad de detalles

@Module({
  imports: [
    // 👈 2. Registramos AMBAS entidades dentro del arreglo para que TypeORM cargue sus metadatos
    TypeOrmModule.forFeature([Venta, DetalleVenta]),
  ],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
