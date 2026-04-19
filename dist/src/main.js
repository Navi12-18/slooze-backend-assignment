"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const register_enums_1 = require("./graphql/register-enums");
async function bootstrap() {
    (0, register_enums_1.registerGraphqlEnums)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        credentials: true,
        allowedHeaders: ['Authorization', 'Content-Type', 'Apollo-Require-Preflight'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map