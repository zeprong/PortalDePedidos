import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  create(dto: CreateProductoDto) {
    const producto = this.productoRepo.create(dto);
    return this.productoRepo.save(producto);
  }

  findAll() {
    return this.productoRepo.find();
  }

  findOne(id: number) {
    return this.productoRepo.findOne({ where: { id_producto: id } });
  }

  async update(id: number, dto: UpdateProductoDto) {
    await this.productoRepo.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.productoRepo.delete(id);
  }
}
