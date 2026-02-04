import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, response: Response): Promise<{
        success: boolean;
        message: string;
        data: {
            accessToken: string;
            user: {
                id: string;
                email: string;
                name: string;
                roles: string[];
                permissions: string[];
            };
        };
    }>;
    refresh(request: Request, response: Response): Promise<{
        success: boolean;
        message: string;
        data: {
            accessToken: string;
        };
    }>;
    logout(userId: string, response: Response): Promise<{
        success: boolean;
        message: string;
        data: null;
    }>;
    me(user: any): Promise<{
        success: boolean;
        message: string;
        data: {
            roles: string[];
            permissions: string[];
            userRoles: undefined;
            id: string;
            name: string;
            createdAt: Date;
            email: string;
            phone: string | null;
            avatar: string | null;
            isActive: boolean;
        };
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
        data: null;
    }>;
}
