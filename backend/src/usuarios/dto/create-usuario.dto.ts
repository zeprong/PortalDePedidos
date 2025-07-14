import { IsString, IsNotEmpty, IsEnum, Length, IsEmail, IsOptional } from 'class-validator';

export enum RolUsuario {
  ADMIN = 'admin',
  VENDEDOR = 'vendedor',
  COMPRADOR = 'comprador',
  ALMACEN = 'almacen',
  GERENTE = 'gerente',
}

export enum EstadoUsuario {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  documento: string;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  usuario: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 255)
  password: string;

  @IsNotEmpty()
  @IsEnum(RolUsuario)
  rol: RolUsuario;

  @IsEnum(EstadoUsuario)
  @IsOptional()
  estado?: EstadoUsuario = EstadoUsuario.ACTIVO;

  @IsEmail()
  @IsOptional()
  correo?: string;

  @IsOptional()
  imagen?: Express.Multer.File;
}