import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [PrismaModule, AuthModule],
  providers: [],
  controllers: [],
  exports: [],
})
export class UploadsModule {}
