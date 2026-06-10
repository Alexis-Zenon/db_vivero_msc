//temporadas.module.ts
import { Module } from '@nestjs/common';
import { TemporadasService } from './temporadas.service';
import { TemporadasController } from './temporadas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Temporada } from './entities/temporada.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Temporada])], // Mapea la entidad
  controllers: [TemporadasController],
  providers: [TemporadasService],
  exports: [TypeOrmModule], // Lo exportamos para que el módulo de plantas pueda verlo si se necesita
})
export class TemporadasModule {}
