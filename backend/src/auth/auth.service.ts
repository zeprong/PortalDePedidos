// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Usuario } from '../usuarios/entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida credenciales del usuario.
   * @returns Usuario si es válido, o null si no existe o la contraseña es incorrecta.
   */
  async validarUsuario(usuario: string, password: string): Promise<Usuario | null> {
    const usuarioEncontrado = await this.usuariosService.obtenerPorUsuario(usuario);
    if (!usuarioEncontrado) return null;

    const esValida = await bcrypt.compare(password, usuarioEncontrado.password);
    if (!esValida) return null;

    return usuarioEncontrado;
  }

  /**
   * Genera el token JWT y prepara la respuesta de login.
   * Incluye el avatar en Base64 si existe.
   */
  async login(usuario: Usuario) {
    // 1. Crear el payload para el token
    const payload = {
      sub: usuario.id_usuario,
      usuario: usuario.usuario,
      rol: usuario.rol,
    
    };

    // 2. Firmar el token
    const token = this.jwtService.sign(payload);

    // 3. Convertir la imagen (Buffer) a Base64, si existe
    let avatarBase64: string | null = null;
    if (usuario.imagen) {
      // Asuma que es jpeg, ajústalo si puede ser png u otro
      avatarBase64 = `data:image/jpeg;base64,${usuario.imagen.toString('base64')}`;
    }

    // 4. Devolver todos los datos que necesita el frontend
    return {
      token,
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      rol: usuario.rol,
      estado: usuario.estado,
      correo:   usuario.correo,
      avatar: avatarBase64,  

    };
  }
}