"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async login(loginDto) {
        const { email, password, rememberMe } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email, deletedAt: null },
            include: {
                userRoles: {
                    include: {
                        role: {
                            include: {
                                rolePermissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const roles = user.userRoles.map((ur) => ur.role.name);
        const permissions = [
            ...new Set(user.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.key))),
        ];
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            roles,
            permissions,
        };
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = await this.generateRefreshToken(user.id, rememberMe);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                roles,
                permissions,
            },
        };
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub, deletedAt: null },
                include: {
                    userRoles: {
                        include: {
                            role: {
                                include: {
                                    rolePermissions: {
                                        include: {
                                            permission: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            if (!user || user.refreshToken !== refreshToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const roles = user.userRoles.map((ur) => ur.role.name);
            const permissions = [
                ...new Set(user.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.key))),
            ];
            const newPayload = {
                sub: user.id,
                email: user.email,
                name: user.name,
                roles,
                permissions,
            };
            const accessToken = this.generateAccessToken(newPayload);
            const newRefreshToken = await this.generateRefreshToken(user.id);
            return { accessToken, refreshToken: newRefreshToken };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId, deletedAt: null },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                avatar: true,
                isActive: true,
                createdAt: true,
                userRoles: {
                    include: {
                        role: {
                            include: {
                                rolePermissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const roles = user.userRoles.map((ur) => ur.role.name);
        const permissions = [
            ...new Set(user.userRoles.flatMap((ur) => ur.role.rolePermissions.map((rp) => rp.permission.key))),
        ];
        return {
            ...user,
            roles,
            permissions,
            userRoles: undefined,
        };
    }
    async changePassword(userId, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    }
    generateAccessToken(payload) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN') || '15m',
        });
    }
    async generateRefreshToken(userId, rememberMe = false) {
        const expiresIn = rememberMe
            ? this.configService.get('JWT_REFRESH_REMEMBER_EXPIRES_IN') || '30d'
            : this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d';
        const refreshToken = this.jwtService.sign({ sub: userId }, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn,
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken },
        });
        return refreshToken;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map