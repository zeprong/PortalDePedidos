import { IsString, IsEmail } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  nombreApellidos: string;

  @IsString()
  cliente: string;

  @IsString()
  razonSocial: string;

  @IsString()
  direccion: string;

  @IsString()
  telefono: string;

  @IsString()
  ciudad: string;

  @IsEmail()
  correoElectronico: string;

  @IsString()
  tipoNegocio: string;
}
