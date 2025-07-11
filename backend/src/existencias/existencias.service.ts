import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Existencias } from './entities/existencia.entity';
import { CreateExistenciaDto } from './dto/create-existencia.dto';

@Injectable()
export class ExistenciasService {
  constructor(
    @InjectRepository(Existencias)
    private readonly existenciasRepository: Repository<Existencias>,
  ) {}

  async crearMuchos(createExistenciasDto: CreateExistenciaDto[]): Promise<Existencias[]> {
    const existencias = this.existenciasRepository.create(createExistenciasDto);
    return this.existenciasRepository.save(existencias);
  }

  async eliminarTodos(): Promise<void> {
    await this.existenciasRepository.clear();
  }

  // Nuevo método para obtener existencias con filtros opcionales
  async obtenerExistenciasFiltradas(
    grupos: string[],
    lineas: string[],
  ): Promise<Existencias[]> {
    const query = this.existenciasRepository.createQueryBuilder('ex');

    if (grupos.length > 0) {
      query.andWhere('ex.grupos IN (:...grupos)', { grupos });
    }

    if (lineas.length > 0) {
      query.andWhere('ex.lineas IN (:...lineas)', { lineas });
    }

    return query.getMany();
  }
}
