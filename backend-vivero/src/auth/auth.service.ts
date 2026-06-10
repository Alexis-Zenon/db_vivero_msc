import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private codigosTemporales: Record<string, string> = {};

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly mailerService: MailerService,
  ) {}

  async validarUsuario(correo: string, passwordRecibida: string) {
    const usuario = await this.usuariosService.buscarPorCorreo(correo);
    if (!usuario) {
      throw new UnauthorizedException('El correo o la contraseña son incorrectos.');
    }

    const coincide = await bcrypt.compare(passwordRecibida, usuario.password);
    if (!coincide) {
      throw new UnauthorizedException('El correo o la contraseña son incorrectos.');
    }

    let nombreRol = 'Cliente';
    if (usuario.id_rol === 1) nombreRol = 'Administrador';
    if (usuario.id_rol === 2) nombreRol = 'Empleado';

    return {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: nombreRol,
      token: 'TOKEN_PROVISIONAL_VIVERO_MSC',
    };
  }

  async comprobarExistenciaDeCorreo(correo: string) {
    const usuario = await this.usuariosService.buscarPorCorreo(correo);
    if (!usuario) {
      throw new BadRequestException('El correo electrónico no está registrado.');
    }

    const codigoVerificacion = Math.floor(100000 + Math.random() * 900000).toString();
    this.codigosTemporales[correo] = codigoVerificacion;

    console.log(`🌿 Código enviado para MSC Vivero: [ ${codigoVerificacion} ]`);

    await this.mailerService.sendMail({
      to: correo,
      subject: 'Código de Recuperación - MSC Vivero 🌿',
      html: `<p>Hola, ${usuario.nombre}. Tu código es: <strong>${codigoVerificacion}</strong></p>`,
    });

    return { valido: true, message: 'Código enviado al correo con éxito.' };
  }

  async cambiarPasswordPorCorreo(correo: string, claveNueva: string, codigoRecibido: string) {
    const usuario = await this.usuariosService.buscarPorCorreo(correo);
    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    const codigoGuardado = this.codigosTemporales[correo];
    if (!codigoGuardado || codigoGuardado !== codigoRecibido) {
      throw new BadRequestException('El código de verificación es incorrecto o ha expirado.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(claveNueva, salt);

    await this.usuariosService.actualizarUsuario(usuario.id_usuario, { password: passwordEncriptada });

    delete this.codigosTemporales[correo];

    return { completado: true, message: 'Contraseña actualizada con éxito.' };
  }
}
