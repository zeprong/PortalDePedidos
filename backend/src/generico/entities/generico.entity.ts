// src/generico/entities/generico.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('item_generico') // nombre exacto de la tabla en MySQL
export class Generico {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id_generico: number;

  @Column('text')
  item_generico: string;

  @Column('text', { nullable: true })
  descripcion: string | null;

  @Column({ type: 'enum', enum: ['si', 'no'] })
  reabastecimiento: 'si' | 'no';

  @Column({ type: 'varchar', length: 10 })
  estado: string;
}
