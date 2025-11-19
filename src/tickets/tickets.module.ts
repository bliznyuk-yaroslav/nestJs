import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
    imports: [PrismaModule, AuthModule],
    providers: [TicketsService],
    controllers: [TicketsController],
    exports: [TicketsService],
})
export class TicketsModule {}
