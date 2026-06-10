// usuarios.service.ts
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async crearCliente(datosCliente: any) {
    const usuarioExistente = await this.usuariosRepository.findOne({
      where: { correo: datosCliente.email },
    });

    if (usuarioExistente) {
      throw new BadRequestException(
        'El correo electrónico ya está registrado. Intenta con otro.',
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(datosCliente.password, salt);

    const nuevoUsuario = this.usuariosRepository.create({
      nombre: datosCliente.nombre,
      correo: datosCliente.email,
      password: passwordEncriptada,
      id_rol: 3,
      telefono: datosCliente.telefono,
    });

    return await this.usuariosRepository.save(nuevoUsuario);
  }

  // 👥 Obtener empleados y administradores para la Bitácora
  async listarUsuarios() {
    try {
      return await this.usuariosRepository.find({
        select: {
          id_usuario: true,
          nombre: true,
          correo: true,
          id_rol: true,
        },
        order: { id_usuario: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener la lista de empleados.',
      );
    }
  }

  // 🚀 Registrar un empleado o administrador (Sincronizado con validación previa)
  async registrarConSeguridad(
    idAdminActivo: number,
    passAdmin: string,
    nuevoUsuarioDto: any,
  ) {
    const admin = await this.usuariosRepository.findOne({
      where: { id_usuario: idAdminActivo },
    });
    if (!admin) {
      throw new BadRequestException('El administrador operativo no existe.');
    }

    // 🔒 AJUSTE DE SEGURIDAD: Solo validamos con bcrypt si 'passAdmin' viene explícitamente en la petición.
    // Si viene como null o undefined, significa que el frontend ya la validó exitosamente en 'verificar-password'.
    if (passAdmin && passAdmin.trim() !== '') {
      const passValida = await bcrypt.compare(passAdmin, admin.password);
      if (!passValida) {
        throw new BadRequestException(
          '❌ La contraseña de administrador es incorrecta.',
        );
      }
    }

    const existeUser = await this.usuariosRepository.findOne({
      where: { correo: nuevoUsuarioDto.correo },
    });
    if (existeUser) {
      throw new BadRequestException(
        '⚠️ Este correo electrónico ya está registrado.',
      );
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashContrasena = await bcrypt.hash(
        nuevoUsuarioDto.contrasena,
        salt,
      );

      const nuevo = this.usuariosRepository.create({
        nombre: nuevoUsuarioDto.nombre,
        correo: nuevoUsuarioDto.correo,
        password: hashContrasena,
        id_rol: nuevoUsuarioDto.rol === 'administrador' ? 1 : 2, // 1 Admin, 2 Empleado
      });

      await this.usuariosRepository.save(nuevo);
      return { ok: true, mensaje: 'Usuario registrado con éxito.' };
    } catch (error) {
      throw new InternalServerErrorException('Error al insertar el usuario.');
    }
  }

  // usuarios.service.ts
  async buscarPorCorreo(correo: string) {
    if (!correo) {
      throw new Error('El correo proporcionado es undefined');
    }
    return await this.usuariosRepository.findOne({ where: { correo } });
  }

  // 🔄 Actualizar datos de un empleado o cambiar su rol
  async actualizarUsuario(id: number, datosActualizados: any) {
    const usuario = await this.usuariosRepository.findOne({
      where: { id_usuario: id },
    });
    if (!usuario) {
      throw new BadRequestException('El usuario no existe.');
    }

    if (
      datosActualizados.password &&
      datosActualizados.password.trim() !== ''
    ) {
      const salt = await bcrypt.genSalt(10);
      datosActualizados.password = await bcrypt.hash(
        datosActualizados.password,
        salt,
      );
    } else {
      delete datosActualizados.password;
    }

    if (datosActualizados.rol) {
      datosActualizados.id_rol =
        datosActualizados.rol === 'administrador' ? 1 : 2;
      delete datosActualizados.rol;
    }

    await this.usuariosRepository.update(id, datosActualizados);
    return { ok: true, mensaje: 'Usuario actualizado correctamente.' };
  }

  // ❌ Eliminar un usuario del sistema (Despido / Baja)
  async eliminarUsuario(id: number) {
    const usuario = await this.usuariosRepository.findOne({
      where: { id_usuario: id },
    });
    if (!usuario) {
      throw new BadRequestException(
        'El usuario que intentas eliminar no existe.',
      );
    }

    await this.usuariosRepository.delete(id);
    return { ok: true, mensaje: 'Usuario removido del sistema con éxito.' };
  }
}
