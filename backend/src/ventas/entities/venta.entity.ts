// src/venta/entities/venta.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ventas') // Asegúrate de que este sea el nombre real en tu BD
export class Venta {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'desc_tipo_docto', type: 'varchar', length: 100, nullable: true })
  descTipoDocto: string;

  @Column({ name: 'tipo_docto', type: 'varchar', length: 50, nullable: true })
  tipoDocto: string;

  @Column({ name: 'nro_documento', type: 'varchar', length: 50, nullable: true })
  nroDocumento: string;

  @Column({ name: 'fecha_entrega_item', type: 'date', nullable: true })
  fechaEntregaItem: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  item: string;

  @Column({ name: 'notas_item', type: 'text', nullable: true })
  notasItem: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lote: string;

  @Column({ type: 'date', nullable: true })
  fecha: string;

  @Column({ name: 'fecha_vcto_lote', type: 'date', nullable: true })
  fechaVctoLote: string;

  @Column({ name: 'desc_bodega', type: 'varchar', length: 100, nullable: true })
  descBodega: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bodega: string;

  @Column({ name: 'cantidad_inv', type: 'decimal', precision: 10, scale: 2, nullable: true })
  cantidadInv: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cantidad: number;

  @Column({ name: 'precio_unit', type: 'decimal', precision: 12, scale: 2, nullable: true })
  precioUnit: number;

  @Column({ name: 'costo_promedio_uni_inst', type: 'decimal', precision: 12, scale: 2, nullable: true })
  costoPromedioUniInst: number;

  @Column({ name: 'costo_mp', type: 'decimal', precision: 12, scale: 2, nullable: true })
  costoMp: number;

  @Column({ name: 'costo_promedio_total', type: 'decimal', precision: 12, scale: 2, nullable: true })
  costoPromedioTotal: number;

  @Column({ name: 'valor_neto_local', type: 'decimal', precision: 14, scale: 2, nullable: true })
  valorNetoLocal: number;

  @Column({ name: 'razon_social_cliente_despacho', type: 'varchar', length: 255, nullable: true })
  razonSocialClienteDespacho: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  estado: string;

  @Column({ name: 'nombre_vendedor', type: 'varchar', length: 100, nullable: true })
  nombreVendedor: string;

  @Column({ name: 'id_generico', type: 'int', unsigned: true, nullable: true })
  idGenerico: number;
}
