// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // En tu auth.controller.ts
  @Post('login')
  async login(@Body() body: { correo: string; password: string }) {
    // Debug para ver qué llega
    console.log('Cuerpo recibido en login:', body);

    if (!body.correo) {
      throw new BadRequestException('El campo "correo" es obligatorio');
    }

    // Aquí es donde sucede el error: si body.correo es undefined,
    // se lo pasas a validarUsuario, que a su vez llama a buscarPorCorreo
    return await this.authService.validarUsuario(body.correo, body.password);
  }

  // 🔍 PASO 1: Verificar si el correo existe y enviar código
  // auth.controller.ts
  @Post('verificar-correo')
  async verificarCorreo(@Body() body: { correo: string }) {
    // Verificamos que el correo no llegue vacío antes de llamar al servicio
    if (!body.correo) {
      throw new BadRequestException('El campo "correo" es obligatorio');
    }
    return await this.authService.comprobarExistenciaDeCorreo(body.correo);
  }

  // 🔑 PASO 2: Restablecer la contraseña validando el código que viene de React
  @Put('restablecer-password')
  async restablecerPassword(
    @Body()
    body: {
      correo: string;
      claveNueva: string;
      codigoRecibido: string;
    },
  ) {
    // Debug para ver qué está llegando
    console.log('Datos recibidos en el backend:', body);

    if (!body.correo || !body.claveNueva || !body.codigoRecibido) {
      throw new BadRequestException(
        'Faltan datos requeridos (correo, clave, o código)',
      );
    }

    return await this.authService.cambiarPasswordPorCorreo(
      body.correo,
      body.claveNueva,
      body.codigoRecibido,
    );
  }
}
