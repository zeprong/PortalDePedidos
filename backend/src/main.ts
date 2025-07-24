import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aumentar el tamaño máximo permitido del cuerpo de las peticiones (por ejemplo para archivos JSON grandes)
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // Activar CORS para tu frontend
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Configuración global de validación con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTOs
      forbidNonWhitelisted: true, // Lanza error si llegan propiedades no permitidas
      transform: true, // Transforma payloads a instancias de clases DTO
    }),
  );

  await app.listen(3000, '0.0.0.0');
  console.log('Servidor corriendo en http://localhost:3000');
}
bootstrap();
