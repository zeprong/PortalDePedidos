// src/cotizacion/dto/create-cotizacion.dto.ts
import { IsString, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductoDto {
  @IsString()
  item: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precio: number;

  @IsString()
  @IsOptional()
  lote?: string;

  @IsString()
  @IsOptional()
  fechaVcto?: string;

  @IsString()
  @IsOptional()
  grupo?: string;

  @IsString()
  @IsOptional()
  linea?: string;
}

export class CreateCotizacionDto {
  @IsString()
  clienteNombre: string;

  @IsString()
  clienteNit: string;

  @IsString()
  clienteDireccion: string;

  @IsString()
  clienteTelefono: string;

  @IsString()
  clienteCiudad: string;

  @IsString()
  representanteNombre: string;

  @IsString()
  representanteDocumento: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoDto)
  productos: ProductoDto[];

  @IsString()
  estado: string;

  @IsOptional()
  fechaEntrega?: Date;
}
