import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('existencias')
export class Existencias {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  bodega: string;

  @Column({ name: 'desc_bodega', length: 255 })
  descBodega: string;

  @Column()
  item: number;

  @Column({ name: 'lista_precio', length: 100 })
  listaPrecio: string;

  @Column()
  referencia: number;

  @Column({ name: 'notas_item', length: 255 })
  notasItem: string;

  @Column()
  ubicacion: number;

  @Column({ length: 100 })
  lote: string;

  @Column({ name: 'fecha_lote', type: 'date', nullable: true })
  fechaLote?: string;

  @Column({ name: 'um', length: 50 })
  unidadMedida: string;

  @Column()
  existencia: number;

  @Column({ length: 100 })
  grupos: string;

  @Column({ length: 100 })
  lineas: string;

  @Column({ name: 'cant_disponible' })
  cantDisponible: number;

  @Column({ name: 'factor_um_orden' })
  factorUMOrden: number;

  @Column({ name: 'cant_disponible_ord' })
  cantDisponibleOrd: number;

  @Column({ name: 'precio_unitario', type: 'real' })
  precioUnitario: number;

  @Column({ name: 'precio_orden_factor', type: 'real' })
  precioOrdenFactor: number;

  @Column({ name: 'precio_minimo', type: 'real' })
  precioMinimo: number;

  @Column({ name: 'precio_maximo', type: 'real' })
  precioMaximo: number;
}
