import { Module } from '@nestjs/common';
import { ReservasiService } from './reservasi.service';
import { ReservasiController } from './reservasi.controller';
import { PrismaService } from '../prisma.service'; 
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ReservasiController],
  providers: [ReservasiService, PrismaService], 
  exports: [ReservasiService],
})
export class ReservasiModule {}