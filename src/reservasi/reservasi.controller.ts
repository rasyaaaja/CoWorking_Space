import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ReservasiService } from './reservasi.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Reservasi (Member & Tamu)') // <-- Diperbarui agar menyatu rapi
@Controller('reservasi')
export class ReservasiController {
  constructor(private readonly reservasiService: ReservasiService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Member: Buat Pemesanan Space Baru (+ Kode Promo & Perhitungan Otomatis)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id_space: { type: 'number', example: 1 },
        tanggal_reservasi: { type: 'string', example: '2026-08-30' },
        jam_mulai: { type: 'string', example: '09:00' },
        durasi_jam: { type: 'number', example: 3 },
        id_diskon: { type: 'number', example: 1 },
        kode_promo: { type: 'string', example: 'DISKONHEMAT20' },
      },
      required: ['id_space', 'tanggal_reservasi', 'jam_mulai', 'durasi_jam'],
    },
  })
  create(@Request() req: any, @Body() dto: any) {
    const userId = req.user?.sub || req.user?.id;
    return this.reservasiService.create(userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my')
  @ApiOperation({ summary: 'Member: Lihat Status Semua Pemesanan Milik Sendiri' })
  getMyReservations(@Request() req: any) {
    const userId = req.user?.sub || req.user?.id;
    return this.reservasiService.getMyReservations(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my/history')
  @ApiOperation({ summary: 'Member: Lihat Histori Pemesanan Berdasarkan Bulan & Tahun' })
  @ApiQuery({ name: 'month', required: false, example: 8 })
  @ApiQuery({ name: 'year', required: false, example: 2026 })
  getMyHistory(
    @Request() req: any,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const userId = req.user?.sub || req.user?.id;
    return this.reservasiService.getMyHistory(userId, month, year);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/e-ticket')
  @ApiOperation({ summary: 'Member/Admin: Cetak E-Ticket / Bukti Nota Digital Reservasi (+ QR Code)' })
  @ApiParam({ name: 'id', example: 12 })
  getETicket(@Param('id') id: string) {
    return this.reservasiService.getETicket(Number(id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Member/Admin: Lihat Detail Reservasi Berdasarkan ID' })
  @ApiParam({ name: 'id', example: 12 })
  findOne(@Param('id') id: string) {
    return this.reservasiService.findOne(Number(id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Member: Batalkan Pemesanan Space' })
  @ApiParam({ name: 'id', example: 12 })
  cancel(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.sub || req.user?.id;
    return this.reservasiService.cancel(Number(id), userId);
  }
}