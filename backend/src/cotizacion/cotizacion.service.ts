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

  async create(createCotizacionDto: CreateCotizacionDto): Promise<Cotizacion> {
    const data: Partial<Cotizacion> = {
      ...createCotizacionDto,
      productos: JSON.stringify(createCotizacionDto.productos),
    };

    const nueva = this.cotizacionRepository.create(data);
    return this.cotizacionRepository.save(nueva);
  }

  async findAll(): Promise<Cotizacion[]> {
    const cotizaciones = await this.cotizacionRepository.find({
      order: { fechaCreacion: 'DESC' },
    });

    return cotizaciones.map(cot => ({
      ...cot,
      productos: JSON.parse(cot.productos),
    }));
  }

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

  async remove(id: number): Promise<void> {
    const result = await this.cotizacionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cotización con id ${id} no encontrada`);
    }
  }

  async getProximoNumero(): Promise<number> {
    const ultima = await this.cotizacionRepository
      .createQueryBuilder('cotizacion')
      .orderBy('cotizacion.id', 'DESC')
      .getOne();

    return (ultima?.id ?? 0) + 1;
  }

  async getResumenCotizaciones(): Promise<{
    totalCotizaciones: number;
    totalClientes: number;
    valorTotal: number;
    porEstado: Record<string, number>;
    porVendedor: Record<string, number>;
  }> {
    const cotizaciones = await this.cotizacionRepository.find();

    const clientesSet = new Set<string>();
    const porEstado: Record<string, number> = {};
    const porVendedor: Record<string, number> = {};
    let valorTotal = 0;

    for (const cot of cotizaciones) {
      clientesSet.add(cot.clienteNit);

      // Agrupar por estado
      if (cot.estado) {
        porEstado[cot.estado] = (porEstado[cot.estado] || 0) + 1;
      }

      // Agrupar por vendedor
      if (cot. representanteNombre) {
        porVendedor[cot. representanteNombre] = (porVendedor[cot. representanteNombre] || 0) + 1;
      }

      try {
        const productos = JSON.parse(cot.productos);
        for (const prod of productos) {
          valorTotal += (prod.precio || 0) * (prod.cantidad || 0);
        }
      } catch (e) {
        console.error(`Error al procesar productos en cotización ${cot.id}:`, e);
      }
    }

    return {
      totalCotizaciones: cotizaciones.length,
      totalClientes: clientesSet.size,
      valorTotal: parseFloat(valorTotal.toFixed(2)),
      porEstado,
      porVendedor,
    };
  }


  async findAllByUser(representanteNombre: string): Promise<Cotizacion[]> {
    const cotizaciones = await this.cotizacionRepository.find({
      where: { representanteNombre },
      order: { fechaCreacion: 'DESC' },
    });
  
    return cotizaciones.map(cot => ({
      ...cot,
      productos: JSON.parse(cot.productos),
    }));
  }
  async update(id: number, dto: Partial<CreateCotizacionDto>): Promise<Cotizacion> {
    const cotizacion = await this.findOne(id);
  
    if (dto.productos) {
      cotizacion.productos = JSON.stringify(dto.productos);
    }
  
    cotizacion.clienteNombre = dto.clienteNombre ?? cotizacion.clienteNombre;
    cotizacion.estado = dto.estado ?? cotizacion.estado;
    cotizacion.representanteNombre = dto.representanteNombre ?? cotizacion.representanteNombre;
    cotizacion.fechaEntrega = dto.fechaEntrega ?? cotizacion.fechaEntrega;
  
    return this.cotizacionRepository.save(cotizacion);
  }
  

}
