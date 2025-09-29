import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Create new user with duplicate email check
 
async create(createUserDto: CreateUserDto): Promise<User> {
  // Check for empty fields manually
  const emptyFields = Object.entries(createUserDto)
    .filter(([_, value]) => value === undefined || value === null || value === '')
    .map(([key]) => key);

  if (emptyFields.length) {
    throw new BadRequestException({
      message: '❌ Required fields missing',
      fields: emptyFields,
    });
  }

  // Check if email already exists
  const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
  if (existingUser) {
    throw new BadRequestException({
      message: '❌ Email already exists',
      field: 'email',
    });
  }

  try {
    // ✅ Hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword, // overwrite plain password
    });

    return await createdUser.save();
  } catch (error) {
    throw new BadRequestException({
      message: '❌ Failed to create user',
      error: error.message,
    });
  }
}

  // Get all users
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Get single user by ID
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException({ message: '❌ User not found', field: 'id' });
    return user;
  }

  // Update user by ID
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Optional: prevent duplicate email on update
    if (updateUserDto.email) {
      const existingUser = await this.userModel.findOne({ email: updateUserDto.email }).exec();
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException({ message: '❌ Email already exists', field: 'email' });
      }
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) throw new NotFoundException({ message: '❌ User not found', field: 'id' });
    return updatedUser;
  }

  // Delete user by ID
  async remove(id: string): Promise<{ message: string }> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException({ message: '❌ User not found', field: 'id' });
    return { message: '✅ User deleted successfully' };
  }



}
