import { Module } from '@nestjs/common';
import { PlantasService } from './plantas.service';
import { PlantasController } from './plantas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planta } from './entities/planta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Planta])], // Mapea la entidad
  controllers: [PlantasController],
  providers: [PlantasService],
})
export class PlantasModule {}
