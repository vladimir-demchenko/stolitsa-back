import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { generateKeys } from './common/utils';

async function bootstrap() {
  generateKeys();
  const app = await NestFactory.create(AppModule);

  // Swagger module setting
  const { npm_package_name, npm_package_description, npm_package_version } =
    process.env;
  const config = new DocumentBuilder()
    .setTitle(npm_package_name)
    .setDescription(npm_package_description)
    .setVersion(npm_package_version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('swagger', app, document, customOptions);
  app.enableCors();
  await app.listen(3001);
}

bootstrap();
