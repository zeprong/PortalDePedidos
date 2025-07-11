import { IsOptional, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateProductoDto {
  @IsNumber()
  item: number;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsString()
  laboratorio?: string;

  @IsNumber()
  id_generico: number;

  @IsOptional()
  @IsString()
  lab_dist?: string;

  @IsOptional()
  @IsString()
  proveedor?: string;

  @IsNumber()
  costo_proveedor: number;

  @IsNumber()
  ultimo_costo_unitario: number;

  @IsNumber()
  precio: number;

  @IsString()
  tipo_producto: string;

  @IsString()
  invima: string;

  @IsOptional()
  @IsString()
  cum?: string;

  @IsEnum(['sí', 'no'])
  regulado: 'sí' | 'no';

  @IsNumber()
  iva: number;
}
