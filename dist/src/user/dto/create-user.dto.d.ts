import { UserRole } from '../enum/user.enum';
export declare class CreateUserDto {
    fullName: string;
    email: string;
    lastLogin: Date;
    status: string;
    password: string;
    role: UserRole;
}
