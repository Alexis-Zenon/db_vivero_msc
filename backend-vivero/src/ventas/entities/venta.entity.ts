// src/ventas/entities/venta.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { DetalleVenta } from './detalle-venta.entity'; // 👈 Asegúrate de que estén en la misma carpeta

@Entity({ name: 'ventas' })
export class Venta {
  @PrimaryGeneratedColumn()
  id_venta: number;

  @CreateDateColumn()
  fecha_venta: Date;

  @Column()
  id_usuario_cajero: number;

  @Column({ type: 'int', nullable: true })
  id_cliente: number | null;

  @Column({ default: 'Efectivo' })
  metodo_pago: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  // Agrega estas dos columnas al final de tu clase Venta, justo antes de @OneToMany
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  pago_con: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  cambio: number;

  @OneToMany(() => DetalleVenta, (detalle) => detalle.venta)
  detalles: DetalleVenta[];
}
