import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('usuarios') // Nombre exacto de tu tabla en MySQL
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100, unique: true })
  correo: string;

  @Column({ length: 255 })
  password: string;

  @Column()
  id_rol: number; // 1 = Admin, 2 = Empleado, 3 = Cliente

  @Column({ length: 15, nullable: true })
  telefono: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_registro: Date;
}