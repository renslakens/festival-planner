import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors();
    if (process.env.NODE_ENV !== 'production') {
        await app.listen(3000);
    }
    return app.getHttpAdapter().getInstance();
}

export default bootstrap();