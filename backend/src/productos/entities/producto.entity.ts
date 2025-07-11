import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id_producto: number;

  @Column()
  item: number;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  notas?: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  laboratorio?: string;

  @Column()
  id_generico: number;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  lab_dist?: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  proveedor?: string;

  @Column('double', { precision: 10, scale: 2 })
  costo_proveedor: number;

  @Column('double', { precision: 10, scale: 2 })
  ultimo_costo_unitario: number;

  @Column('double', { precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'varchar', length: 255 })
  tipo_producto: string;

  @Column({ type: 'varchar', length: 50 })
  invima: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  cum?: string;

  @Column({ type: 'enum', enum: ['sí', 'no'], default: 'no' })
  regulado: 'sí' | 'no';

  @Column('double', { precision: 5, scale: 2, default: 0.00 })
  iva: number;
}
