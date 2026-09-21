import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SpaceController],
  providers: [SpaceService, PrismaService],
})
export class SpaceModule {}
