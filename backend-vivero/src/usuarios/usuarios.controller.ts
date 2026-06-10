// usuarios.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param, BadRequestException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // 📝 NUEVO ENDPOINT: Registrar clientes de la tienda (MsC Vivero) desde el Login/Registro público
  @Post('registrar-cliente')
  async registrarCliente(@Body() datosCliente: any) {
    return await this.usuariosService.crearCliente(datosCliente);
  }

  // 🔐 Verificar password (Blindado contra valores undefined)
  @Post('verificar-password')
  async verificarPassword(@Body() datos: { id_usuario: number; password: string }) {
    if (!datos.id_usuario) {
      return { valido: false, message: 'ID de administrador no proporcionado o inválido.' };
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: datos.id_usuario }
    });

    if (!usuario) {
      return { valido: false, message: 'Usuario no encontrado' };
    }

    const esValida = await bcrypt.compare(datos.password, usuario.password); 

    if (!esValida) {
      return { valido: false, message: 'La contraseña no coincide' };
    }

    return { valido: true };
  }

  // 👥 Obtener lista completa para la bitácora
  @Get('lista-personal')
  async listarPersonal() {
    return await this.usuariosService.listarUsuarios();
  }

  // 🔄 Ruta para actualizar un usuario
  @Put(':id')
  async actualizar(@Param('id') id: number, @Body() datos: any) {
    return await this.usuariosService.actualizarUsuario(id, datos);
  }

  // ❌ Ruta para eliminar un usuario
  @Delete(':id')
  async eliminar(@Param('id') id: number) {
    return await this.usuariosService.eliminarUsuario(id);
  }

  // 🚀 Registrar nuevo personal (Sincronizado con el nuevo flujo del Frontend)
  @Post('registrar-personal')
  async registrarPersonal(
    @Body('idAdminActivo') idAdminActivo: number,
    @Body('nuevoUsuario') nuevoUsuario: { nombre: string; correo: string; contrasena: string; rol: string }
  ) {
    return await this.usuariosService.registrarConSeguridad(idAdminActivo, "", nuevoUsuario);
  }
}
