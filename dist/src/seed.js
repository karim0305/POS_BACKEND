"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const bcrypt = require("bcrypt");
async function seed() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const userModel = app.get('UserModel');
    const existingAdmin = await userModel.findOne({ role: 'Admin' });
    if (existingAdmin) {
        console.log(`✅ Admin already exists: ${existingAdmin.email}`);
        await app.close();
        return;
    }
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await userModel.create({
        fullName: 'Super Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'Admin',
        status: 'Active',
    });
    console.log('🎉 Admin user created successfully (admin@example.com / admin123)');
    await app.close();
}
seed();
//# sourceMappingURL=seed.js.map