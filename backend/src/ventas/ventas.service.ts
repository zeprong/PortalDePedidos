import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventasRepository: Repository<Venta>,
  ) {}

  async crear(ventasDto: CreateVentaDto[]): Promise<Venta[]> {
    const ventas = this.ventasRepository.create(ventasDto);
    return this.ventasRepository.save(ventas);
  }

  async obtenerTodos(): Promise<Venta[]> {
    return this.ventasRepository.find();
  }

  async eliminarTodos(): Promise<void> {
    await this.ventasRepository.clear();
  }
}
