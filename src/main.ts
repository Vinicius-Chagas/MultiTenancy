import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        disableErrorMessages: false,
        validationError: {
          target: false,
          value: false,
        },
      }),
    );

    app.use(compression());

    const port = process.env.PORT ?? 3000;
    await app.listen(port ?? 3000);
    console.log(`Application successfully started on port ${port}`);
    return { success: true };
  } catch (error) {
    console.error(`Failed to start application: ${error.message}`, error.stack);
    process.exit(1);
  }
}
bootstrap().catch((err) => {
  console.error('Unhandled bootstrap error:', err);
  process.exit(1);
});
