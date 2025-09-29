import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth-controller.controller';
import { AuthService } from './auth-service.service';
import { User, UserSchema } from '../schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }, // ✅ Register UserModel
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret', // ✅ move to .env
      signOptions: { expiresIn: '1h' },                // ✅ token expiry
    }),
  ],
  controllers: [AuthController],   // ✅ Register Controller
  providers: [AuthService],        // ✅ Register Service
  exports: [AuthService, JwtModule], // ✅ Export if other modules need Auth
})
export class AuthModule {}
