// src/venta/dto/create-venta.dto.ts
import {
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateVentaDto {
  @IsOptional() @IsString() descTipoDocto?: string;
  @IsOptional() @IsString() tipoDocto?: string;
  @IsOptional() @IsString() nroDocumento?: string;
  @IsOptional() @IsDateString() fechaEntregaItem?: string;
  @IsOptional() @IsString() item?: string;
  @IsOptional() @IsString() notasItem?: string;
  @IsOptional() @IsString() lote?: string;
  @IsOptional() @IsDateString() fecha?: string;
  @IsOptional() @IsDateString() fechaVctoLote?: string;
  @IsOptional() @IsString() descBodega?: string;
  @IsOptional() @IsString() bodega?: string;
  @IsOptional() @IsNumber() cantidadInv?: number;
  @IsOptional() @IsNumber() cantidad?: number;
  @IsOptional() @IsNumber() precioUnit?: number;
  @IsOptional() @IsNumber() costoPromedioUniInst?: number;
  @IsOptional() @IsNumber() costoMp?: number;
  @IsOptional() @IsNumber() costoPromedioTotal?: number;
  @IsOptional() @IsNumber() valorNetoLocal?: number;
  @IsOptional() @IsString() razonSocialClienteDespacho?: string;
  @IsOptional() @IsString() estado?: string;
  @IsOptional() @IsString() nombreVendedor?: string;
  @IsOptional() @IsNumber() idGenerico?: number;
}
