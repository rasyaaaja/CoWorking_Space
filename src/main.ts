import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  app.useStaticAssets(join(process.cwd(), 'public'));

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('API Coworking Space UKK')
    .setDescription('Dokumentasi Lengkap API Reservasi Coworking Space - UKK RPL SMK Telkom Malang')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Informasi Sistem', 'Status server dan petunjuk penggunaan')
    .addTag('Auth & Users', 'Autentikasi dan hak akses pengguna')
    .addTag('Member', 'Manajemen data member')
    .addTag('Admin - Profil Space', 'Manajemen profil lokasi coworking')
    .addTag('Admin - Manajemen Member', 'Pengelolaan data member oleh admin')
    .addTag('Admin - Manajemen Ruangan', 'Pengelolaan ruangan dan meja space')
    .addTag('Admin - Manajemen Diskon', 'Pengelolaan kode promo dan diskon')
    .addTag('Admin - Manajemen Reservasi', 'Monitoring dan status pemesanan')
    .addTag('Admin - Laporan & Pendapatan', 'Rekapitulasi laporan finansial')
    .addTag('Space Coworking (Publik & User)', 'Daftar dan ketersediaan space')
    .addTag('Reservasi (Member & Tamu)', 'Pemesanan dan transaksi user')
    .addTag('Diskon & Promo (Publik & User)', 'Promo aktif dan validasi diskon')
    .addTag('Upload Berkas & Gambar', 'Pengunggahan file umum')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customCss = `
    .swagger-ui select {
      font-size: 15px !important;
      padding: 8px 12px !important;
      font-weight: 500 !important;
    }
  `;

  SwaggerModule.setup('api/docs', app, document, {
    customCss: customCss,
  });

  app.enableCors();

  await app.listen(3000);

  logger.log('🚀 Server running on: http://localhost:3000/api');
  logger.log('📄 Swagger UI: http://localhost:3000/api/docs');
  logger.log('💡 Status: Environment development is ready!');
}
bootstrap();