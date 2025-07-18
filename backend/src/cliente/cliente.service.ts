import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,
  ) {}

  findAll(): Promise<Cliente[]> {
    return this.clienteRepo.find();
  }

  async create(data: CreateClienteDto): Promise<Cliente> {
    const nuevo = this.clienteRepo.create(data);
    return await this.clienteRepo.save(nuevo);
  }

  async update(id: number, data: CreateClienteDto): Promise<Cliente> {
    const cliente = await this.clienteRepo.findOneBy({ id });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    const actualizado = Object.assign(cliente, data);
    return this.clienteRepo.save(actualizado);
  }
}
