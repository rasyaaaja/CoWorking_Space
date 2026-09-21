import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminSpaceGuard } from '../auth/roles.guard';

@ApiTags('Admin - Manajemen Diskon') // <-- Diperbarui agar tidak double/kosong
@Controller('admin/diskon')
export class AdminDiskonController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Get()
  @ApiOperation({ summary: 'Admin Space: Daftar Semua Kode Promo / Diskon Event' })
  findAll() {
    return this.adminService.findAllDiskon();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Post()
  @ApiOperation({ summary: 'Admin Space: Tambah Kode Promo / Diskon Event Baru' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nama_diskon: { type: 'string', example: 'PROMOAGUSTUS' },
        persentase_diskon: { type: 'number', example: 20 },
        tanggal_awal: { type: 'string', example: '2026-08-01T00:00:00Z' },
        tanggal_akhir: { type: 'string', example: '2026-08-31T23:59:59Z' },
      },
      required: ['nama_diskon', 'persentase_diskon', 'tanggal_awal', 'tanggal_akhir'],
    },
  })
  create(@Body() dto: any) {
    return this.adminService.createDiskon(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Admin Space: Detail Data Diskon Berdasarkan ID' })
  @ApiParam({ name: 'id', example: 4 })
  findOne(@Param('id') id: string) {
    return this.adminService.findOneDiskon(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Admin Space: Update Data Kode Promo / Diskon' })
  @ApiParam({ name: 'id', example: 4 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nama_diskon: { type: 'string', example: 'PROMOAGUSTUS2026' },
        persentase_diskon: { type: 'number', example: 25 },
        tanggal_akhir: { type: 'string', example: '2026-09-15T23:59:59Z' },
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.adminService.updateDiskon(+id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Admin Space: Hapus Kode Promo / Diskon' })
  @ApiParam({ name: 'id', example: 4 })
  remove(@Param('id') id: string) {
    return this.adminService.removeDiskon(+id);
  }
}