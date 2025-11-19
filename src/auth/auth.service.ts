import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtSignOptions } from '@nestjs/jwt';

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
    const payload = {sub:user.id, email:user.email, role:user.role as any};
    const access_token = await this.signAccessToken(payload);
    const refresh_token = await this.signRefreshToken(payload);
    await this.saveRefreshToken(user.id, refresh_token);
    return { access_token, refresh_token };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = {sub: user.id, email:user.email, role:user.role as any}
    const access_token = await this.signAccessToken(payload)
    const refresh_token = await this.signRefreshToken(payload)
    await this.saveRefreshToken(user.id, refresh_token)
    return { access_token, refresh_token };
  }

  async refresh(refreshToken: string){
    const payload = await this.verifyRefreshToken(refreshToken)
    const user = await this.prisma.user.findUnique({where:{id:payload.sub}})
    if(!user||!user.refreshToken)throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(refreshToken, user.refreshToken);
    if(!ok) throw new UnauthorizedException("Invalid refresh token")
  
      const newPayload = { sub:user.id, email: user.email, role: user.role as any}
      const access_token = await this.signAccessToken(newPayload)
      const refresh_token = await this.signRefreshToken(newPayload)
      await this.saveRefreshToken(user.id, refresh_token)
      return { access_token, refresh_token }
  }
  async logout(userId: number){
    await this.prisma.user.update({
      where:{id:userId},
      data: {refreshToken:null}
    });
    return {success:true}
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
  
  private async signAccessToken(payload: Record<string, any>){
    const expiresIn = process.env.JWT_ACCESS_EXPIRES ?? '15m';
    return this.jwt.signAsync(payload,{
      secret:process.env.JWT_ACCESS_SECRET||"access-dev",
      expiresIn,
    }as JwtSignOptions);
  }
  private async signRefreshToken(payload: Record<string, any>){
    const expiresIn = process.env.JWT_REFRESH_EXPIRES??"7d"
    return this.jwt.signAsync(payload,{
      secret: process.env.JWT_REFRESH_SECRET ||'refresh-dev',
      expiresIn,
    } as JwtSignOptions);
  }
  private async saveRefreshToken(userId:number, refreshToken: string){
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where:{id:userId},
      data:{refreshToken:hash},
    });
   
  }
   private async verifyRefreshToken(token: string){
      return this.jwt.verifyAsync(token,{
        secret:process.env.JWT_REFRESH_SECRET||"refresh-dev"
      })
    }
}
