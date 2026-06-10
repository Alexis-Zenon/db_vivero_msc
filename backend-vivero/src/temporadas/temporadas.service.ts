// temporadas.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Temporada } from './entities/temporada.entity';
// 📑 CORREGIDO: Apuntando a tus DTOs reales
import { CreateTemporadaDto } from './dto/create-temporada.dto'; 
import { UpdateTemporadaDto } from './dto/update-temporada.dto';

@Injectable()
export class TemporadasService {
  constructor(
    @InjectRepository(Temporada)
    private readonly temporadaRepository: Repository<Temporada>,
  ) {}

  async create(createTemporadaDto: CreateTemporadaDto) {
    const nueva = this.temporadaRepository.create(createTemporadaDto);
    return await this.temporadaRepository.save(nueva);
  }

  async update(id: number, updateTemporadaDto: UpdateTemporadaDto) {
    await this.temporadaRepository.update({ idTemporada: id }, updateTemporadaDto);
    return this.findOne(id);
  }

  async findAll() {
    return await this.temporadaRepository.find();
  }

  async findOne(id: number) {
    return await this.temporadaRepository.findOne({ where: { idTemporada: id } });
  }

  async remove(id: number) {
    await this.temporadaRepository.delete(id);
    return { eliminado: true, idTemporada: id };
  }

  // ==========================================
  // ⚡ PROCESADOR CENTRAL DE TRANSICIÓN ESTACIONAL
  // ==========================================
  async procesarModoEstacional(modoAuto: boolean, idManual?: number) {
    if (modoAuto) {
      // 1. Obtener la fecha actual en formato YYYY-MM-DD
      const hoy = new Date().toISOString().split('T')[0];

      // 2. CORREGIDO: Apagar todas usando QueryBuilder para evitar el "Empty criteria"
      await this.temporadaRepository
        .createQueryBuilder()
        .update(Temporada)
        .set({ activa: false })
        .execute();

      // 3. Buscar cuál abarca el día de hoy
      const temporadaActual = await this.temporadaRepository.findOne({
        where: {
          fechaInicio: LessThanOrEqual(hoy),
          fechaFin: MoreThanOrEqual(hoy),
        }
      });

      if (temporadaActual) {
        temporadaActual.activa = true;
        await this.temporadaRepository.save(temporadaActual);
      }
      
      return this.findAll();

    } else {
      // MODO MANUAL
      if (!idManual) throw new NotFoundException('Falta especificar el ID de la temporada manual.');

      // 1. CORREGIDO: Apagar todas usando QueryBuilder
      await this.temporadaRepository
        .createQueryBuilder()
        .update(Temporada)
        .set({ activa: false })
        .execute();

      // 2. Encender únicamente la elegida
      const temporadaAActivar = await this.findOne(idManual);
      if (!temporadaAActivar) throw new NotFoundException('La temporada indicada no existe.');

      temporadaAActivar.activa = true;
      await this.temporadaRepository.save(temporadaAActivar);

      return this.findAll();
    }
  }
}
