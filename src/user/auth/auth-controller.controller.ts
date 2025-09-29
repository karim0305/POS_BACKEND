import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth-service.service';

class LoginDto {
  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  password: string;
}

class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR...' })
  access_token: string;

  @ApiProperty({
    example: {
      _id: '651f1c0d9a1234567890abcd',
      email: 'test@example.com',
      name: 'John Doe',
    },
  })
  user: any;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login and get JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
