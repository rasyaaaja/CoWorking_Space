import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule } from './member/member.module';
import { SpaceModule } from './space/space.module';
import { ReservasiModule } from './reservasi/reservasi.module';
import { AdminModule } from './admin/admin.module';
import { DiskonModule } from './diskon/diskon.module';
import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module'; 

@Module({
  imports: [
    AuthModule, 
    MemberModule,
    SpaceModule,
    ReservasiModule,
    AdminModule,
    DiskonModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}