import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { GenericoService } from './generico.service';
import { CreateGenericoDto } from './dto/create-generico.dto';
import { UpdateGenericoDto } from './dto/update-generico.dto';

@Controller('generico')
export class GenericoController {
  constructor(private readonly genericoService: GenericoService) {}

  @Post()
  create(@Body() dto: CreateGenericoDto) {
    return this.genericoService.create(dto);
  }

  @Get()
  findAll() {
    return this.genericoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genericoService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGenericoDto) {
    return this.genericoService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genericoService.remove(Number(id));
  }

  @Delete()
  removeAll() {
    return this.genericoService.removeAll();
  }
}
