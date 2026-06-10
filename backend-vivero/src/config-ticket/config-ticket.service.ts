// config-ticket.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigTicket } from './entities/config-ticket.entity';

@Injectable()
export class ConfigTicketService {
  constructor(
    @InjectRepository(ConfigTicket)
    private readonly configRepository: Repository<ConfigTicket>,
  ) {}

  // 🔍 Busca la configuración o la crea en la BD si no existe
  async getOrCreate() {
    try {
      let config = await this.configRepository.findOne({ where: {} });

      // Si la tabla está vacía, creamos e insertamos el primer registro en MariaDB
      if (!config) {
        const nuevaConfig = this.configRepository.create({
          nombreVivero: 'MsC Vivero',
          direccion: 'Dirección por configurar',
          localidad: 'San Felipe del Progreso',
          telefono: '7120000000',
          leyenda: '¡Gracias por su compra!',
        });
        config = await this.configRepository.save(nuevaConfig);
      }

      return config; // Retorna los datos reales de la base de datos
    } catch (error) {
      console.error('Error al obtener/crear la configuración:', error);
      throw new InternalServerErrorException('Error al conectar con la base de datos en config_ticket');
    }
  }

  // 💾 Actualiza los datos cuando edites desde el formulario
  async updateConfig(datos: any) {
    try {
      let config = await this.configRepository.findOne({ where: {} });

      if (config) {
        // Mapea y actualiza los cambios sobre el registro existente
        this.configRepository.merge(config, datos);
        return await this.configRepository.save(config);
      } else {
        // En caso de que no existiera por alguna razón, lo crea
        const nuevaConfig = this.configRepository.create(datos);
        return await this.configRepository.save(nuevaConfig);
      }
    } catch (error) {
      console.error('Error al actualizar la configuración del ticket:', error);
      throw new InternalServerErrorException('No se pudieron guardar los cambios en la base de datos');
    }
  }
}
