import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Informasi Sistem')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Status API & Petunjuk Penggunaan' })
  getHello() {
    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data: {
        name: 'Coworking Space Backend API - UKK RPL Paket B',
        version: '1.0.0',
        status: 'online',
        swagger_docs: '/docs',
        description: 'Backend service untuk menunjang kelas frontend dalam ujian UKK dengan multi-tenancy App Maker.',
        documentation_links: {
          swagger: 'http://localhost:3000/docs',
          swagger_json: 'http://localhost:3000/docs-json'
        }
      },
      timestamp: new Date().toISOString()
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health Check Server' })
  getHealth() {
    const currentTime = new Date().toISOString();
    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data: {
        status: 'ok',
        timestamp: currentTime
      },
      timestamp: currentTime
    };
  }
}
