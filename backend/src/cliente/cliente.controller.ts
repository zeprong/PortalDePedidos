import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ClientesService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clienteService: ClientesService) {}

  @Get()
  getAll() {
    return this.clienteService.findAll();
  }

  @Post()
  create(@Body() dto: CreateClienteDto) {
    return this.clienteService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreateClienteDto) {
    return this.clienteService.update(Number(id), dto);
  }
}
