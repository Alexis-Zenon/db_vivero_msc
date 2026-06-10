// src/ventas/ventas.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Venta } from './entities/venta.entity'; // 👈 Revisa que esta ruta apunte bien a tu entidad Venta

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,

    private readonly dataSource: DataSource,
  ) {}

  async registrarVenta(createVentaDto: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Dentro de tu método registrarVenta, busca el paso 1 y 2 y déjalos así:

      // 1. Separamos los datos del JSON que viene de React
      const {
        detalles,
        productos,
        id_usuario_cajero,
        id_cliente,
        metodo_pago,
        total,
        pago_con,
        cambio,
      } = createVentaDto;

      const listaArticulos = detalles || productos || [];

      // 2. Construcción limpia de la cabecera
      const datosCabeceraLimpia = new Venta();
      datosCabeceraLimpia.id_usuario_cajero = id_usuario_cajero
        ? Number(id_usuario_cajero)
        : 1;
      datosCabeceraLimpia.id_cliente = id_cliente ? Number(id_cliente) : null;
      datosCabeceraLimpia.metodo_pago = metodo_pago || 'Efectivo';
      datosCabeceraLimpia.total = total ? Number(total) : 0;
      datosCabeceraLimpia.pago_con = pago_con ? Number(pago_con) : 0; // 👈 Guardar pago
      datosCabeceraLimpia.cambio = cambio ? Number(cambio) : 0; // 👈 Guardar cambio

      // Guardamos la venta principal
      const ventaGuardada = await queryRunner.manager.save(
        Venta,
        datosCabeceraLimpia,
      );

      // 3. Procesamos los artículos
      if (listaArticulos.length > 0) {
        for (const articulo of listaArticulos) {
          const idProductoReal = articulo.id_producto || articulo.id_planta;
          const cantidadReal = articulo.cantidad || 1;
          const precioReal = articulo.precio_unitario || articulo.precio || 0;

          if (!idProductoReal) {
            throw new Error(
              'El artículo no cuenta con un id_producto o id_planta válido.',
            );
          }

          // A. Detalle de venta directo en MariaDB
          await queryRunner.manager.query(
            `INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) 
             VALUES (?, ?, ?, ?)`,
            [ventaGuardada.id_venta, idProductoReal, cantidadReal, precioReal],
          );

          // B. Descuento de stock en la tabla plantas
          await queryRunner.manager.query(
            `UPDATE plantas 
             SET stock = stock - ? 
             WHERE id_planta = ?`,
            [cantidadReal, idProductoReal],
          );
        }
      }

      await queryRunner.commitTransaction();

      return {
        success: true,
        id_venta: ventaGuardada.id_venta,
        message: 'Venta procesada con éxito y stock actualizado en MariaDB',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error crítico detallado en VentasService:', error);
      throw new InternalServerErrorException({
        message: 'Error al registrar la venta en la base de datos',
        error: error.message || error,
      });
    } finally {
      await queryRunner.release();
    }
  }
}
