// src/cotizacion/cotizacion.controller.ts
import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { Cotizacion } from './entities/cotizacion.entity';

@Controller('cotizaciones')  // Ajustado a plural para REST convencional
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService) {}

  @Post()
  create(@Body() createCotizacionDto: CreateCotizacionDto): Promise<Cotizacion> {
    return this.cotizacionService.create(createCotizacionDto);
  }

  @Get()
  findAll(): Promise<Cotizacion[]> {
    return this.cotizacionService.findAll();
  }
    // Devuelve el próximo número de cotización (último id + 1)
@Get('proximo')
async getProximoNumero(): Promise<{ proximo: number }> {
  const proximo = await this.cotizacionService.getProximoNumero();
  return { proximo };
}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Cotizacion> {
    return this.cotizacionService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cotizacionService.remove(id);
  }


}
