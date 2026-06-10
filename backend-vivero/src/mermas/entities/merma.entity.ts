import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Planta } from '../../plantas/entities/planta.entity';

@Entity({ name: 'mermas' })
export class Merma {
  @PrimaryGeneratedColumn({ name: 'id_merma' })
  idMerma: number;

  @Column({ name: 'id_producto' })
  idProducto: number;

  @Column()
  cantidad: number;

  @Column({ length: 255 })
  motivo: string;

  @CreateDateColumn({ name: 'fecha_registro', type: 'timestamp' })
  fechaRegistro: Date;

  // Relación con Plantas
  @ManyToOne(() => Planta, (planta) => planta.idPlanta)
  @JoinColumn({ name: 'id_producto' })
  planta: Planta;
}
