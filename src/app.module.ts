import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AnalyticsService } from './analytics/analytics.service';
import { AnalyticsController } from './analytics/analytics.controller';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EventsModule,
    AnalyticsModule
  ],
  controllers: [AppController, AnalyticsController],
  providers: [AppService, AnalyticsService],
})
export class AppModule {}
