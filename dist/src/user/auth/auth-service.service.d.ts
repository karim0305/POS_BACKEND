import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../schema/user.schema';
export declare class AuthService {
    private readonly userModel;
    private readonly jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    login(email: string, password: string): Promise<{
        access_token: string;
        user: any;
    }>;
}
