import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ length: 20 })
  documento: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 50, unique: true })
  usuario: string;

  @Column({ type: 'mediumblob', nullable: true })
  imagen: Buffer;

  @Column({ length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'vendedor', 'comprador', 'almacen', 'gerente'],
  })
  rol: string;

  @Column({
    type: 'enum',
    enum: ['activo', 'inactivo'],
    default: 'activo',
  })
  estado: string;

  @Column({ length: 255 })
  correo: string;
}