import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Sequelize } from 'sequelize-typescript';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:3001',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const sequelize: Sequelize = app.get(Sequelize);
  await sequelize.sync({ alter: true });

  const config = new DocumentBuilder()
    .setTitle('API de Gerenciamento de Usuários')
    .setDescription('Documentação da API para gerenciamento de usuários.')
    .setVersion('3.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = 80;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
