//app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemporadasModule } from './temporadas/temporadas.module';
import { PlantasModule } from './plantas/plantas.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { VentasModule } from './ventas/ventas.module';
import { ConfigTicketModule } from './config-ticket/config-ticket.module';
import { MermasModule } from './mermas/mermas.module';

@Module({
  imports: [
    // Habilita la lectura del archivo .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Configura la conexión a MySQL usando las variables de entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD') || '',
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false, // ¡IMPORTANTE! Déjalo en false para que respete tu base de datos y no intente borrar o alterar tus tablas reales.
      }),
    }),
    TemporadasModule,
    PlantasModule,
    AuthModule,
    UsuariosModule,
    VentasModule,
    ConfigTicketModule,
    MermasModule,
  ],
})
export class AppModule {}
