// temporada.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Planta } from '../../plantas/entities/planta.entity';

@Entity('temporadas') // Se conecta exactamente a tu tabla "temporadas"
export class Temporada {
  @PrimaryGeneratedColumn({ name: 'id_temporada' })
  idTemporada: number;

  @Column({ name: 'nombre_temporada', length: 50 })
  nombreTemporada: string;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: string;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: string;

  @Column({ default: false })
  activa: boolean;

  @OneToMany(() => Planta, (planta) => planta.temporada)
  plantas: Planta[];
}