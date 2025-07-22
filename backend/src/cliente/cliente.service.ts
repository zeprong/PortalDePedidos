import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
@Injectable()
export class ClientesService {
  constructor(@InjectRepository(Cliente) private repo: Repository<Cliente>) {}

  findAll() {
    return this.repo.find({ order: { nombreApellidos: 'ASC' } });
  }

  async findOne(id: number) {
    const cliente = await this.repo.findOneBy({ id });
    if (!cliente) throw new NotFoundException(`Cliente #${id} no existe`);
    return cliente;
  }

  create(dto: CreateClienteDto) {
    const cliente = this.repo.create(dto);
    return this.repo.save(cliente);
  }

  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.repo.preload({ id, ...updateClienteDto });
    if (!cliente) throw new NotFoundException(`Cliente #${id} no existe`);
    return this.repo.save(cliente);
  }
  

  async remove(id: number) {
    const cliente = await this.findOne(id);
    return this.repo.remove(cliente);
  }
}