import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { Cotizacion } from './entities/cotizacion.entity';

@Controller('cotizaciones') // Ruta plural siguiendo convención REST
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService) { }

  @Post()
  create(
    @Body() createCotizacionDto: CreateCotizacionDto,
  ): Promise<Cotizacion> {
    return this.cotizacionService.create(createCotizacionDto);
  }

  @Get()
  findAll(): Promise<Cotizacion[]> {
    return this.cotizacionService.findAll();
  }

  @Get('proximo')
  async getProximoNumero(): Promise<{ proximo: number }> {
    const proximo = await this.cotizacionService.getProximoNumero();
    return { proximo };
  }

  @Get('resumen')
  getResumenCotizaciones() {
    return this.cotizacionService.getResumenCotizaciones();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Cotizacion> {
    return this.cotizacionService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cotizacionService.remove(id);
  }
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCotizacionDto: Partial<CreateCotizacionDto>,
  ): Promise<Cotizacion> {
    return this.cotizacionService.update(id, updateCotizacionDto);
  }
  

}
