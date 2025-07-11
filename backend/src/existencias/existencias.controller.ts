import { Controller, Get, Post, Delete, Body, Query } from '@nestjs/common';
import { ExistenciasService } from './existencias.service';
import { CreateExistenciaDto } from './dto/create-existencia.dto';

@Controller('existencias')
export class ExistenciasController {
  constructor(private readonly existenciasService: ExistenciasService) {}

  // Endpoint para obtener existencias con filtros opcionales
  @Get()
  obtenerExistencias(
    @Query('grupos') grupos?: string,
    @Query('lineas') lineas?: string,
  ) {
    // grupos y lineas pueden venir como cadenas separadas por comas
    const gruposArray = grupos ? grupos.split(',') : [];
    const lineasArray = lineas ? lineas.split(',') : [];
    return this.existenciasService.obtenerExistenciasFiltradas(gruposArray, lineasArray);
  }

  // Endpoint para carga masiva
  @Post('bulk')
  crearMuchos(@Body() createExistenciasDto: CreateExistenciaDto[]) {
    return this.existenciasService.crearMuchos(createExistenciasDto);
  }

  // Endpoint para eliminar todas las existencias
  @Delete()
  eliminarTodos() {
    return this.existenciasService.eliminarTodos();
  }
}
