import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreApellidos: string;

  @Column()
  cliente: string;

  @Column()
  razonSocial: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @Column()
  ciudad: string;

  @Column()
  correoElectronico: string;

  @Column()
  tipoNegocio: string;
}

