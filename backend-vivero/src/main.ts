import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para permitir peticiones desde React
  app.enableCors();

  await app.listen(3000);
}
// Corregido: Agregamos el catch para manejar la promesa
bootstrap();

//.catch((err) => console.error(err));
