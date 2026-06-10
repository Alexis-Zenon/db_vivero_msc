// plantas.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlantasService } from './plantas.service';
import { CreatePlantaDto } from './dto/create-planta.dto';
import { UpdatePlantaDto } from './dto/update-planta.dto';

@Controller('plantas')
export class PlantasController {
  constructor(private readonly plantasService: PlantasService) {}

  // 1. CREAR (Soluciona el error 404 POST)
  @Post()
  create(@Body() createPlantaDto: CreatePlantaDto) {
    return this.plantasService.create(createPlantaDto);
  }

  // 2. LEER TODAS
  @Get()
  findAll() {
    return this.plantasService.findAll();
  }

  // 3. LEER UNA
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plantasService.findOne(+id);
  }

  // 4. EDITAR GENERAL
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlantaDto: UpdatePlantaDto) {
    return this.plantasService.update(+id, updatePlantaDto);
  }

  // 5. OCULTAR / MOSTRAR AL CLIENTE
  @Patch(':id/visibilidad')
  cambiarVisibilidad(@Param('id') id: string, @Body('visible') visible: boolean) {
    return this.plantasService.setVisibilidad(+id, visible);
  }

  // 6. ELIMINAR (Manejo seguro de eliminación)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plantasService.remove(+id);
  }
}
