import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { VercelRequest, VercelResponse } from '@vercel/node';
import serverless from 'serverless-http';

let cachedHandler: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Keep your same configs
  app.enableCors();
  app.setGlobalPrefix('api');

  await app.init();

  return serverless(app.getHttpAdapter().getInstance());
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!cachedHandler) {
    cachedHandler = await bootstrap();
  }
  return cachedHandler(req, res);
}
