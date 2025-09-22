import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enum/user.enum';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: '❌ Full name is required' })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john@example.com',
  })
  @IsNotEmpty({ message: '❌ Email is required' })
  @IsEmail({}, { message: '❌ Invalid email address' })
  email: string;

  @ApiProperty({
    description: 'Last login status of the user',
    example: Date.now(),
    default: Date.now(),
  })


  @IsOptional() // not required because default handles it
  @IsDate()
  @Type(() => Date) // ensures string gets converted into Date
  lastLogin: Date;

  @ApiProperty({
    description: 'active status of the user',
    example: 'Active',
    default: 'Active',
  })
  @IsNotEmpty({ message: '❌ Status is required', })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Password for the user account (min 6 characters)',
    example: 'password123',
    minLength: 6,
  })
  @IsNotEmpty({ message: '❌ Password is required' })
  @MinLength(6, { message: '❌ Password must be at least 6 characters' })
  password: string;

  @ApiProperty({
    description: 'Role of the user',
    example: 'Admin',
    enum: UserRole,
  })
  @IsNotEmpty({ message: '❌ Role is required' })
  @IsString()
  role: UserRole; // e.g. "Admin" | "Teacher" | "Student"
}
