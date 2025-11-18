import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async register(email: string, password: string, name:string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already exists');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name
      },
    });
    const access_token = await this.signToken(user.id, user.email, user.role as any);
    return { access_token };
  }
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const access_token = await this.signToken(user.id, user.email, user.role as any);
    return { access_token };
  }

  async me(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    return { user };
  }
  private async signToken(userId: number, email: string, role: 'USER' | 'ADMIN' | 'ORGANIZER') {
    const payload = { sub: userId, email, role };
    return this.jwt.signAsync(payload);
  }
}
