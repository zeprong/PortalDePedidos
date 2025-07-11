import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cotizacion } from './entities/cotizacion.entity';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';

@Injectable()
export class CotizacionService {
  constructor(
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
  ) {}

  /**
   * Crea una nueva cotización y guarda en la base de datos.
   * Los productos se guardan como JSON string.
   */
  async create(createCotizacionDto: CreateCotizacionDto): Promise<Cotizacion> {
    const data: Partial<Cotizacion> = {
      ...createCotizacionDto,
      productos: JSON.stringify(createCotizacionDto.productos),
    };

    const nueva = this.cotizacionRepository.create(data);
    return this.cotizacionRepository.save(nueva);
  }

  /**
   * Devuelve todas las cotizaciones existentes.
   * Incluye parseo de productos desde JSON.
   */
  async findAll(): Promise<Cotizacion[]> {
    const cotizaciones = await this.cotizacionRepository.find({
      order: { fechaCreacion: 'DESC' },
    });

    return cotizaciones.map(cot => ({
      ...cot,
      productos: JSON.parse(cot.productos),
    }));
  }

  /**
   * Devuelve una cotización por ID con parseo de productos.
   */
  async findOne(id: number): Promise<Cotizacion> {
    const cotizacion = await this.cotizacionRepository.findOne({ where: { id } });
    if (!cotizacion) {
      throw new NotFoundException(`Cotización con id ${id} no encontrada`);
    }
    return {
      ...cotizacion,
      productos: JSON.parse(cotizacion.productos),
    };
  }

  /**
   * Elimina una cotización por ID.
   */
  async remove(id: number): Promise<void> {
    const result = await this.cotizacionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cotización con id ${id} no encontrada`);
    }
  }

  /**
   * Devuelve el próximo número de cotización (último ID + 1).
   */
  async getProximoNumero(): Promise<number> {
    const ultima = await this.cotizacionRepository
      .createQueryBuilder('cotizacion')
      .orderBy('cotizacion.id', 'DESC')
      .getOne();

    return (ultima?.id ?? 0) + 1;
  }
}
