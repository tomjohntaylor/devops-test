import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const config = require('config');
const containerPort = config.get('containerPort');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(containerPort);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
