import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthController } from './auth.controllers';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, AuthGuard, RolesGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
