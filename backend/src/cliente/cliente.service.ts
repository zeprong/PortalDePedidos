import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  // Crear un nuevo cliente
  create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const cliente = this.clienteRepository.create(createClienteDto);
    return this.clienteRepository.save(cliente);
  }

  // Obtener todos los clientes
  findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find();
  }

  // Obtener un solo cliente por ID
  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOneBy({ id });
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    return cliente;
  }

  // Actualizar cliente por ID
  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    await this.clienteRepository.update(id, updateClienteDto);
    const cliente = await this.clienteRepository.findOneBy({ id });
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    return cliente;
  }

  // Eliminar cliente por ID
  async remove(id: number): Promise<void> {
    await this.clienteRepository.delete(id);
  }
}
