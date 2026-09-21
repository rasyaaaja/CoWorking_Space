import { Module } from '@nestjs/common';
import { DiskonService } from './diskon.service';
import { DiskonController } from './diskon.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DiskonController],
  providers: [DiskonService, PrismaService],
})
export class DiskonModule {}
