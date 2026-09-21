import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DiskonService } from './diskon.service';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Diskon & Promo (Publik & User)')
@Controller('diskon')
export class DiskonController {
  constructor(private readonly diskonService: DiskonService) {}

  @Get('active')
  @ApiOperation({ summary: 'Publik/User: Daftar Promo / Diskon yang Sedang Aktif' })
  findAllActive() {
    return this.diskonService.findAllActive();
  }

  @Post('check')
  @ApiOperation({ summary: 'Publik/User: Periksa Validitas & Hitung Potongan Kode Promo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nama_diskon: { type: 'string', example: 'DISKONHEMAT20' },
      },
      required: ['nama_diskon'],
    },
  })
  checkDiskon(@Body() dto: any) {
    return this.diskonService.checkDiskon(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Publik/User: Lihat Detail Diskon Berdasarkan ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id') id: string) {
    return this.diskonService.findOne(+id);
  }
}