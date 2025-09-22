// src/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { User } from './user/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

// A small service-like function for seeding
async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<User>>('UserModel'); // Nest will provide it

  // Check if Admin already exists
  const existingAdmin = await userModel.findOne({ role: 'Admin' });
  if (existingAdmin) {
    console.log(`✅ Admin already exists: ${existingAdmin.email}`);
    await app.close();
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin
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
