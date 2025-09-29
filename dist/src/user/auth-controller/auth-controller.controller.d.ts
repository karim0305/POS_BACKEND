import { User } from '../entities/user.entity';
import { UserService } from '../user.service';
declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private readonly userService;
    constructor(userService: UserService);
    login(loginDto: LoginDto): Promise<User>;
}
export {};
