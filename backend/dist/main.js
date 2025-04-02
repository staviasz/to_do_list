"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const cors_setup_1 = require("./config/cors-setup");
const env_1 = require("./config/env");
const app_module_1 = require("./modules/app.module");
const prisma_exception_filter_1 = require("./modules/prisma/prisma-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors(cors_setup_1.corsOptionsConfig);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.useGlobalFilters(new prisma_exception_filter_1.PrismaExceptions());
    await app.listen(env_1.ENV_SERVER.port);
}
void bootstrap();
//# sourceMappingURL=main.js.map