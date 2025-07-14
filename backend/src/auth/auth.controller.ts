import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { usuario: string; password: string }) {
    const usuario = await this.authService.validarUsuario(body.usuario, body.password);
   
    
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.authService.login(usuario);
  }
}