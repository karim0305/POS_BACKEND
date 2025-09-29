import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity'; // 👈 adjust path
import { UserDocument } from '../schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService, // 👈 inject JwtService
  ) {}

  async login(email: string, password: string): Promise<{ access_token: string; user: any }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException({
        message: '❌ User not found',
        field: 'email',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException({
        message: '❌ Invalid password',
        field: 'password',
      });
    }

    // 👇 JWT payload (you can add role, etc.)
    const payload = { sub: user._id, email: user.email };

    // 👇 generate token
    const token = this.jwtService.sign(payload);

    // return token + user (without password)
    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      access_token: token,
      user: userWithoutPassword,
    };
  }
}
