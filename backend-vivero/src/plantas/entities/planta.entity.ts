// planta.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Temporada } from '../../temporadas/entities/temporada.entity';

@Entity('plantas')
export class Planta {
  @PrimaryGeneratedColumn({ name: 'id_planta' })
  idPlanta: number;

  @Column({ name: 'id_categoria', type: 'int', default: 1 }) // 👈 Para el POS
  idCategoria: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ name: 'nombre_cientifico', length: 100, nullable: true }) // 👈 Para el POS
  nombreCientifico: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  precio: number;

  @Column({ name: 'imagen_url', type: 'text', nullable: true })
  imagenUrl: string;

  @Column({ name: 'ubicacion_invernadero', length: 50, default: 'General' }) // 👈 Para el POS
  ubicacionInvernadero: string;

  @Column({ name: 'id_temporada', nullable: true })
  idTemporada: number;

  @Column({ type: 'boolean', default: true })
  visible: boolean;

  @ManyToOne(() => Temporada, (temporada) => temporada.plantas, { 
    nullable: true, // 👈 Esto permite que podamos ponerla en null para borrarla si se equivocan
    onDelete: 'SET NULL',// 👈 Si se borra o desvincula, no truena la base de datos
  })
  @JoinColumn({ name: 'id_temporada' })
  temporada: Temporada;
}
