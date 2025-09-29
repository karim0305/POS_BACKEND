import { AuthService } from './auth-service.service';
declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
}
export {};
