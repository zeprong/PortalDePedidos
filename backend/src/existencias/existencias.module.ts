import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Existencias } from './entities/existencia.entity';
import { ExistenciasService } from './existencias.service';
import { ExistenciasController } from './existencias.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Existencias])],
  controllers: [ExistenciasController],
  providers: [ExistenciasService],
})
export class ExistenciasModule {}