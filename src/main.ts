import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

//   // ✅ Static assets
//  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
//   prefix: '/uploads', // 👈 must be '/uploads'
// });

  // ✅ Enable CORS
  app.enableCors({
    origin: configService.get<string>('FRONTEND_DOMAIN') || 'http://localhost:3000',
    methods: ['GET', 'HEAD', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ✅ Global API prefix
  app.setGlobalPrefix(configService.get<string>('API_PREFIX') ?? 'api');

  // ✅ Swagger Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('POS API')
    .setDescription('API documentation for POS system')
    .setVersion('1.0')
    .addBearerAuth() // for JWT
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // ✅ Start server
  const port = configService.get<number>('PORT') ?? 3010;
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📑 Swagger docs on http://localhost:${port}/docs`);
}
bootstrap();

