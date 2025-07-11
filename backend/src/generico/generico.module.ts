import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenericoService } from './generico.service';
import { GenericoController } from './generico.controller';
import { Generico } from './entities/generico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Generico])],
  controllers: [GenericoController],
  providers: [GenericoService],
})
export class GenericoModule {}
