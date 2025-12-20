"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: http://0.0.0.0:${port}`);
    console.log(`Local: http://localhost:${port}`);
    console.log(`Para usar tunnel, configure EXPO_PUBLIC_API_URL no .env`);
}
bootstrap();
//# sourceMappingURL=main.js.map