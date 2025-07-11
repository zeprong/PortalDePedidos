import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Existencias } from 'src/existencias/entities/existencia.entity';
import { Generico } from 'src/generico/entities/generico.entity';
import { Venta } from 'src/ventas/entities/venta.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Cotizacion } from 'src/cotizacion/entities/cotizacion.entity';


@Module({
  imports: [
    ConfigModule.forRoot(), 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Usuario,Existencias,Generico, Venta, Producto,Cliente,Cotizacion],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}