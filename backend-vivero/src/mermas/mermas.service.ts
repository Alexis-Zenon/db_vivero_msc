import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merma } from './entities/merma.entity';
import { Planta } from '../plantas/entities/planta.entity';

@Injectable()
export class MermasService {
  constructor(
    @InjectRepository(Merma)
    private readonly mermaRepository: Repository<Merma>,
    @InjectRepository(Planta)
    private readonly plantaRepository: Repository<Planta>,
  ) {}

  // REGISTRAR PÉRDIDA Y RESTAR STOCK
  async registrarMerma(idProducto: number, cantidad: number, motivo: string) {
    const planta = await this.plantaRepository.findOne({ where: { idPlanta: idProducto } });
    
    if (!planta) {
      throw new BadRequestException(`No se encontró la planta con ID #${idProducto}`);
    }

    if (planta.stock < cantidad) {
      throw new BadRequestException(`Stock insuficiente. Solo quedan ${planta.stock} pz e intentas mermar ${cantidad} pz.`);
    }

    try {
      // Transacción nativa para asegurar consistencia
      await this.mermaRepository.manager.transaction(async (entityManager) => {
        await entityManager.query(
          'INSERT INTO mermas (id_producto, cantidad, motivo, fecha_registro) VALUES (?, ?, ?, NOW())',
          [idProducto, cantidad, motivo]
        );

        await entityManager.query(
          'UPDATE plantas SET stock = stock - ? WHERE id_planta = ?',
          [cantidad, idProducto]
        );
      });

      return { completado: true, mensaje: 'Merma registrada y stock descontado con éxito.' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al procesar la merma en la base de datos.');
    }
  }

  // BALANCE FINANCIERO (Semanas, Meses, Año)
  async obtenerBalance(periodo: string) {
    let formatoFecha = '%Y-%m-%d'; 
    if (periodo === 'mes') formatoFecha = '%Y-%u'; // Agrupado por semanas del mes
    if (periodo === 'ano') formatoFecha = '%Y-%m'; // Agrupado por meses del año

    try {
      // 1. Sumamos ingresos desde detalle_ventas
      const ingresos = await this.mermaRepository.manager.query(`
        SELECT 
          DATE_FORMAT(v.fecha_venta, '${formatoFecha}') AS intervalo,
          SUM(dv.cantidad * dv.precio_unitario) AS total_ingresos
        FROM detalle_ventas dv
        JOIN ventas v ON dv.id_venta = v.id_venta
        GROUP BY intervalo
        ORDER BY intervalo ASC
      `);

      // 2. Sumamos pérdidas monetarias multiplicando la cantidad de mermas por el precio de la planta
      const perdidas = await this.mermaRepository.manager.query(`
        SELECT 
          DATE_FORMAT(m.fecha_registro, '${formatoFecha}') AS intervalo,
          SUM(m.cantidad * p.precio) AS total_perdidas
        FROM mermas m
        JOIN plantas p ON m.id_producto = p.id_planta
        GROUP BY intervalo
        ORDER BY intervalo ASC
      `);

      return { ingresos, perdidas };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al calcular el balance financiero.');
    }
  }
}