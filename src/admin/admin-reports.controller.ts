import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminSpaceGuard } from '../auth/roles.guard';

@ApiTags('Admin - Laporan & Pendapatan')
@Controller('admin/reports')
export class AdminReportsController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Get('monthly')
  @ApiOperation({ summary: 'Admin Space: Rekapitulasi Estimasi & Realisasi Pendapatan Per Bulan' })
  @ApiQuery({ name: 'month', required: false, example: '8' })
  @ApiQuery({ name: 'year', required: false, example: '2026' })
  getMonthly(@Query('month') month?: string, @Query('year') year?: string) {
    return this.adminService.getMonthlyReport({ month, year });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Get('income')
  @ApiOperation({ summary: 'Admin Space: Alias Endpoint untuk Rekapitulasi Pendapatan Bulanan' })
  @ApiQuery({ name: 'month', required: false, example: '8' })
  @ApiQuery({ name: 'year', required: false, example: '2026' })
  getIncome(@Query('month') month?: string, @Query('year') year?: string) {
    return this.adminService.getIncomeReport({ month, year });
  }
}