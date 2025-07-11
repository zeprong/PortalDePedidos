import { IsString, IsInt, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateExistenciaDto {
  @IsString()
  bodega: string;

  @IsString()
  descBodega: string;

  @IsInt()
  item: number;

  @IsString()
  listaPrecio: string;

  @IsInt()
  referencia: number;

  @IsString()
  notasItem: string;

  @IsInt()
  ubicacion: number;

  @IsString()
  lote: string;

  @IsOptional()
  @IsDateString()
  fechaLote?: string;

  @IsString()
  unidadMedida: string;

  @IsInt()
  existencia: number;

  @IsString()
  grupos: string;

  @IsString()
  lineas: string;

  @IsInt()
  cantDisponible: number;

  @IsInt()
  factorUMOrden: number;

  @IsInt()
  cantDisponibleOrd: number;

  @IsNumber()
  precioUnitario: number;

  @IsNumber()
  precioOrdenFactor: number;

  @IsNumber()
  precioMinimo: number;

  @IsNumber()
  precioMaximo: number;
}
