// plantas.service.ts
import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planta } from './entities/planta.entity';
import { CreatePlantaDto } from './dto/create-planta.dto';
import { UpdatePlantaDto } from './dto/update-planta.dto';

@Injectable()
export class PlantasService {
  constructor(
    @InjectRepository(Planta)
    private readonly plantaRepository: Repository<Planta>,
  ) {}

  async create(createPlantaDto: CreatePlantaDto) {
    // Usamos corchetes para leer la propiedad dinámica por si TypeScript no la ve en el DTO
    const nombreRecibido = createPlantaDto['nombre'] || '';
    const nombreNormalizado = nombreRecibido.trim();

    if (!nombreNormalizado) {
      throw new ConflictException('El nombre de la planta es obligatorio.');
    }

    // Buscamos si ya existe una planta activa con este nombre
    const plantaExistente = await this.plantaRepository.findOne({
      where: { nombre: nombreNormalizado }
    });

    if (plantaExistente) {
      throw new ConflictException(`La planta "${nombreNormalizado}" ya se encuentra registrada en el inventario.`);
    }

    const nuevaPlanta = this.plantaRepository.create(createPlantaDto);
    return await this.plantaRepository.save(nuevaPlanta);
  }

  // ... el resto de tus métodos (como remove) se quedan igual

  // LEER TODAS
  async findAll() {
    return await this.plantaRepository.find();
  }

  // LEER UNA
  async findOne(id: number) {
    const planta = await this.plantaRepository.findOne({ where: { idPlanta: id } });
    if (!planta) throw new NotFoundException(`Planta #${id} no encontrada`);
    return planta;
  }

  // EDITAR GENERAL
  async update(id: number, updatePlantaDto: UpdatePlantaDto) {
    await this.plantaRepository.update({ idPlanta: id }, updatePlantaDto);
    return this.findOne(id);
  }

  // ACTUALIZAR VISIBILIDAD
  async setVisibilidad(id: number, visible: boolean) {
    await this.plantaRepository.update({ idPlanta: id }, { visible });
    return this.findOne(id);
  }

  // ELIMINAR CON CONTROL DE LLAVE FORÁNEA (Manejo del error 1451)
  // ELIMINAR DE RAÍZ DESVINCULANDO RELACIONES
  async remove(id: number) {
    try {
      // 1. Desvinculamos la temporada con SQL nativo directo en MariaDB
      // Usamos el EntityManager para ejecutar texto plano y saltarnos restricciones de TypeORM
      await this.plantaRepository.manager.query(
        'UPDATE plantas SET id_temporada = NULL WHERE id_planta = ?',
        [id]
      );

      // 2. Intentamos el borrado físico real de la fila
      const resultado = await this.plantaRepository.manager.query(
        'DELETE FROM plantas WHERE id_planta = ?',
        [id]
      );
      
      // En consultas nativas de MySQL/MariaDB, el resultado trae un objeto con "affectedRows"
      if (resultado && resultado.affectedRows > 0) {
        return { eliminado: true, estrategia: 'fisico_nativo_limpio', idPlanta: id };
      }

      // Si no afectó filas es porque el ID no existía
      throw new NotFoundException(`No se encontró la planta con ID #${id}`);
      
    } catch (error) {
      // 3. Si salta el error 1451, significa que SÍ tiene registros reales en la tabla 'detalle_ventas'
      if (error.errno === 1451 || error.code === 'ER_ROW_IS_REFERENCED_2') {
        
        // Ejecutamos el borrado lógico nativo para resguardar tus reportes de la escuela
        await this.plantaRepository.manager.query(
          'UPDATE plantas SET visible = 0 WHERE id_planta = ?',
          [id]
        );

        return { eliminado: true, estrategia: 'logico_por_ventas_reales', idPlanta: id };
      }
      
      console.error("Error crítico en el DELETE nativo:", error);
      throw new InternalServerErrorException('Error al intentar eliminar el registro.');
    }
  }

}