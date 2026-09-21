import { Module } from '@nestjs/common';
import { AdminProfileController } from './admin-profile.controller';
import { AdminMemberController } from './admin-member.controller';
import { AdminSpaceController } from './admin-space.controller';
import { AdminDiskonController } from './admin-diskon.controller';
import { AdminReservasiController } from './admin-reservasi.controller';
import { AdminReportsController } from './admin-reports.controller';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    AuthModule, 
  ],
  controllers: [
    AdminProfileController,
    AdminMemberController,
    AdminSpaceController,
    AdminDiskonController,
    AdminReservasiController,
    AdminReportsController,
  ],
  providers: [AdminService, PrismaService],
  exports: [AdminService],
})
export class AdminModule {}