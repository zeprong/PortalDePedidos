import {
  Controller, Get, Post, Body, Param, Put, Delete,
  UploadedFile, UseInterceptors
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  async crear(
    @UploadedFile() imagen: Express.Multer.File,
    @Body() datos: CreateUsuarioDto,
  ): Promise<Usuario> {
    const datosConImagen = {
      ...datos,
      imagen: imagen?.buffer,
    };
    return this.usuariosService.crear(datosConImagen);
  }

  @Get()
  listarTodos(): Promise<Usuario[]> {
    return this.usuariosService.listarTodos();
  }

  @Get(':id_usuario')
  obtenerPorId(@Param('id_usuario') id_usuario: number): Promise<Usuario> {
    return this.usuariosService.obtenerPorId(id_usuario);
  }

  @Put(':id_usuario')
  @UseInterceptors(FileInterceptor('imagen'))
  actualizar(
    @Param('id_usuario') id_usuario: number,
    @UploadedFile() imagen: Express.Multer.File,
    @Body() datos: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const datosActualizados = {
      ...datos,
      imagen: imagen?.buffer,
    };
    return this.usuariosService.actualizar(id_usuario, datosActualizados);
  }

  @Delete(':id_usuario')
  eliminar(@Param('id_usuario') id_usuario: number): Promise<void> {
    return this.usuariosService.eliminar(id_usuario);
  }
}
