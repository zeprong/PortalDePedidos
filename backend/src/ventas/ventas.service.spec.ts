import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
  ) {}

  // Inserción masiva de registros
  async insertarMultiples(data: CreateVentaDto[]): Promise<Venta[]> {
    const registros = this.ventaRepository.create(data);
    return this.ventaRepository.save(registros);
  }

  // Agrupar por mes y sumar valor_neto_local
  async obtenerTotalesPorMes(): Promise<
    { mes: string; total: number }[]
  > {
    return this.ventaRepository
      .createQueryBuilder('venta')
      .select("DATE_FORMAT(venta.fecha, '%Y-%m')", 'mes') // Agrupar por mes y año
      .addSelect('SUM(venta.valor_neto_local)', 'total')
      .groupBy('mes')
      .orderBy('mes', 'ASC')
      .getRawMany();
  }
}
