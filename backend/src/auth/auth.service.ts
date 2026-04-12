import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private getBranchContext(user: any) {
    const userBranches = user.userBranches || [];
    const branchIds = userBranches.map((ub: any) => ub.branchId);
    const defaultBranchId = userBranches.find((ub: any) => ub.isDefault)?.branchId || branchIds[0];
    const branches = userBranches.map((ub: any) => ({
      id: ub.branch.id,
      name: ub.branch.name,
      code: ub.branch.code,
      isDefault: ub.isDefault,
    }));
    return { branchIds, defaultBranchId, branches };
  }

  async login(loginDto: LoginDto) {
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
        userBranches: { include: { branch: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get user roles and permissions
    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = [
      ...new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map((rp) => rp.permission.key),
        ),
      ),
    ];

    const branchContext = this.getBranchContext(user);
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      roles,
      permissions,
      branchIds: branchContext.branchIds,
      defaultBranchId: branchContext.defaultBranchId,
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
        branches: branchContext.branches,
        defaultBranchId: branchContext.defaultBranchId,
      },
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
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
          userBranches: { include: { branch: true } },
        },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const roles = user.userRoles.map((ur) => ur.role.name);
      const permissions = [
        ...new Set(
          user.userRoles.flatMap((ur) =>
            ur.role.rolePermissions.map((rp) => rp.permission.key),
          ),
        ),
      ];

      const branchContext = this.getBranchContext(user);
      const newPayload = {
        sub: user.id,
        email: user.email,
        name: user.name,
        roles,
        permissions,
        branchIds: branchContext.branchIds,
        defaultBranchId: branchContext.defaultBranchId,
      };

      const accessToken = this.generateAccessToken(newPayload);
      const newRefreshToken = await this.generateRefreshToken(user.id);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async getProfile(userId: string) {
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
        userBranches: { include: { branch: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = [
      ...new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map((rp) => rp.permission.key),
        ),
      ),
    ];

    const branchContext = this.getBranchContext(user);
    return {
      ...user,
      roles,
      permissions,
      branches: branchContext.branches,
      branchIds: branchContext.branchIds,
      defaultBranchId: branchContext.defaultBranchId,
      userRoles: undefined,
      userBranches: undefined,
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  private generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m',
    });
  }

  private async generateRefreshToken(userId: string, rememberMe: boolean = false): Promise<string> {
    const expiresIn = rememberMe
      ? this.configService.get<string>('JWT_REFRESH_REMEMBER_EXPIRES_IN') || '30d'
      : this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn,
      },
    );

    // Store refresh token in database
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });

    return refreshToken;
  }
}
