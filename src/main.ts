import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { PORT } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(PORT, () => {
    Logger.log(`🚀 App is running on http://localhost:${PORT}`);
  });
}
bootstrap();
