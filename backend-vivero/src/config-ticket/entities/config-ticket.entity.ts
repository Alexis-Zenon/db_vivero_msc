// config-ticket.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('config_ticket')
export class ConfigTicket {
  @PrimaryGeneratedColumn({ name: 'id_config' })
  id_config: number;

  @Column({ name: 'nombreVivero', type: 'varchar', length: 150, nullable: true })
  nombreVivero: string;

  @Column({ name: 'direccion', type: 'varchar', length: 255, nullable: true })
  direccion: string;

  @Column({ name: 'localidad', type: 'varchar', length: 100, nullable: true })
  localidad: string;

  @Column({ name: 'telefono', type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ name: 'leyenda', type: 'varchar', length: 255, nullable: true })
  leyenda: string;
}
