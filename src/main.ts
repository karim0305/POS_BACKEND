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

  // ✅ Serve uploaded files (optional if you want local fallback)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads', // URL: /uploads/filename.jpg
  });

  // ✅ Enable CORS
  const frontendDomain =
    configService.get<string>('VERCEL_DOMAIN') || // vercel wali domain ENV me rakho
    configService.get<string>('FRONTEND_DOMAIN') || // agar ye na ho to frontend wali
    '*'; // agar dono na ho to *
 

  app.enableCors({
   origin: frontendDomain,
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
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // ✅ Use dynamic port (required for Render/Heroku)
  const port = Number(process.env.PORT) || 3010;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
  console.log(`📑 Swagger docs available at /docs`);
}

bootstrap();
