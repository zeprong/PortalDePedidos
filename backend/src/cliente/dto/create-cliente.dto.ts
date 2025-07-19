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

  @IsEmail()
  correoElectronico: string;

  @IsString()
  telefono: string;

  @IsString()
  ciudad: string;

  @IsString()
  tipoNegocio: string;
}
