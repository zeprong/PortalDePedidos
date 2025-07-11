import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { ExistenciasModule } from './existencias/existencias.module';
import { GenericoModule } from './generico/generico.module';
import { VentasModule } from './ventas/ventas.module';

import { ProductosModule } from './productos/productos.module';
import { ClientesModule } from './cliente/cliente.module';
import { CotizacionModule } from './cotizacion/cotizacion.module';



@Module({
  imports: [DatabaseModule, UsuariosModule, AuthModule, ExistenciasModule, GenericoModule,
             VentasModule, ProductosModule, ClientesModule, CotizacionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
