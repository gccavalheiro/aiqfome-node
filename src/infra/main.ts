import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { Env } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get<ConfigService<Env>>(ConfigService)
  const port = configService.get('PORT', { infer: true })

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Aiqfome API')
    .setDescription('API para gerenciamento de clientes e favoritos')
    .setVersion('1.0')
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
    .addTag('auth', 'Autenticação de clientes')
    .addTag('customers', 'Gerenciamento de clientes')
    .addTag('favorites', 'Gerenciamento de favoritos')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })

  await app.listen(port ?? 3333)
}

bootstrap()
