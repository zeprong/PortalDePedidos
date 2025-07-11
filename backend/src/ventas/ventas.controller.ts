import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { Venta } from './entities/venta.entity';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post('subir')
  async subirVentas(@Body() ventas: CreateVentaDto[]) {
    const resultado = await this.ventasService.crear(ventas);
    return { mensaje: 'Ventas guardadas correctamente', cantidad: resultado.length };
  }

  @Get()
  async obtenerVentas(): Promise<Venta[]> {
    return this.ventasService.obtenerTodos();
  }

  @Delete()
  async eliminarVentas() {
    await this.ventasService.eliminarTodos();
    return { mensaje: 'Todas las ventas han sido eliminadas' };
  }
}
