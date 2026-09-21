import { Controller, Get, Patch, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminSpaceGuard } from '../auth/roles.guard';

@ApiTags('Admin - Manajemen Reservasi')
@Controller('admin/reservasi')
export class AdminReservasiController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Get()
  @ApiOperation({ summary: 'Admin Space: Lihat Seluruh Data Reservasi Coworking Space' })
  @ApiQuery({ name: 'month', required: false, example: '8' })
  @ApiQuery({ name: 'year', required: false, example: '2026' })
  @ApiQuery({ 
    name: 'status', 
    required: false, 
    enum: ['belum_dikonfirm', 'disetujui', 'aktif', 'selesai', 'dibatalkan'],
    example: 'belum_dikonfirm',
    description: 'Filter berdasarkan status reservasi'
  })
  @ApiQuery({ name: 'id_space', required: false, example: '1' })
  @ApiQuery({ name: 'tanggal', required: false, example: '2026-08-30' })
  findAll(
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('status') status?: string,
    @Query('id_space') id_space?: string,
    @Query('tanggal') tanggal?: string,
  ) {
    return this.adminService.findAllReservasi({ month, year, status, id_space, tanggal });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Admin Space: Konfirmasi & Ubah Status Pemesanan' })
  @ApiParam({ name: 'id', example: 12 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { 
          type: 'string', 
          enum: ['belum_dikonfirm', 'disetujui', 'aktif', 'selesai', 'dibatalkan'],
          example: 'disetujui',
          description: 'Pilih status pemesanan yang diinginkan'
        },
      },
      required: ['status'],
    },
  })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updateStatusReservasi(+id, status);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Post(':id/check-in')
  @ApiOperation({ summary: 'Admin Space: Check-In Pelanggan (Ubah Status ke Aktif)' })
  @ApiParam({ name: 'id', example: 12 })
  checkIn(@Param('id') id: string) {
    return this.adminService.checkIn(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Post(':id/check-out')
  @ApiOperation({ summary: 'Admin Space: Check-Out Pelanggan (Ubah Status ke Selesai)' })
  @ApiParam({ name: 'id', example: 12 })
  checkOut(@Param('id') id: string) {
    return this.adminService.checkOut(+id);
  }
}