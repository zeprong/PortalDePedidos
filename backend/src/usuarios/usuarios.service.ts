import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async crear(usuarioData: Partial<Usuario>): Promise<Usuario> {
    const hashedPassword = await bcrypt.hash(usuarioData.password ?? '', 10);
    const nuevoUsuario = this.usuarioRepo.create({
      ...usuarioData,
      password: hashedPassword,
    });
    return this.usuarioRepo.save(nuevoUsuario);
  }

  async listarTodos(): Promise<Usuario[]> {
    return this.usuarioRepo.find();
  }

  async obtenerPorId(id_usuario: number): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOneBy({ id_usuario });
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    return usuario;
  }

  async actualizar(id_usuario: number, datos: Partial<Usuario>): Promise<Usuario> {
    if (datos.password) {
      datos.password = await bcrypt.hash(datos.password, 10);
    }
    await this.usuarioRepo.update(id_usuario, datos);
    return this.obtenerPorId(id_usuario);
  }

  async eliminar(id_usuario: number): Promise<void> {
    await this.usuarioRepo.delete(id_usuario);
  }

  async obtenerPorUsuario(usuario: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { usuario } });
  }
}