import {  Controller,  Get,  Post,  Body,  Param,  Delete,  Put,  ParseIntPipe,} from '@nestjs/common';
import { ClientesService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly service: ClientesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateClienteDto) {
    return this.service.create(dto);
  }

@Put(':id')
update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
  return this.service.update(+id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}