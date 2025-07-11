// src/cotizacion/entities/cotizacion.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('cotizacion')
export class Cotizacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  clienteNombre: string;

  @Column({ length: 50 })
  clienteNit: string;

  @Column({ length: 255 })
  clienteDireccion: string;

  @Column({ length: 50 })
  clienteTelefono: string;

  @Column({ length: 100 })
  clienteCiudad: string;

  @Column({ length: 255 })
  representanteNombre: string;

  @Column({ length: 50 })
  representanteDocumento: string;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  // Guardamos productos como JSON string
  @Column({ type: 'longtext' })
  productos: string;

  @CreateDateColumn({ type: 'datetime' })
  fechaCreacion: Date;
}
