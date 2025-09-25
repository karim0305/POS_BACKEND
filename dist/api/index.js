"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const serverless_http_1 = require("serverless-http");
let cachedHandler;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
    await app.init();
    return (0, serverless_http_1.default)(app.getHttpAdapter().getInstance());
}
async function handler(req, res) {
    if (!cachedHandler) {
        cachedHandler = await bootstrap();
    }
    return cachedHandler(req, res);
}
//# sourceMappingURL=index.js.map