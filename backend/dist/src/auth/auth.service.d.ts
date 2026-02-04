import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            roles: string[];
            permissions: string[];
        };
    }>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<void>;
    getProfile(userId: string): Promise<{
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
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void>;
    private generateAccessToken;
    private generateRefreshToken;
}
