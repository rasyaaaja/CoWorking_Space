import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminSpaceGuard } from '../auth/roles.guard';

@ApiTags('Admin - Manajemen Member')
@Controller('admin/members')
export class AdminMemberController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Get()
  @ApiOperation({ summary: 'Admin Space: Daftar Semua Member / Pelanggan Coworking' })
  @ApiQuery({ name: 'search', required: false, example: 'Budi' })
  findAll(@Query('search') search?: string) {
    return this.adminService.findAllMembers(search);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Post()
  @ApiOperation({ summary: 'Admin Space: Tambah Data Member Baru oleh Admin' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'user_budi' },
        password: { type: 'string', example: 'Secret123!' },
        nama_member: { type: 'string', example: 'Budi Raharjo' },
        instansi: { type: 'string', example: 'SMK Telkom Malang' },
        alamat: { type: 'string', example: 'Jl. Danau Ranau No. 1, Sawojajar, Malang' },
        telp: { type: 'string', example: '085712345678' },
        foto: { type: 'string', example: 'budi.jpg' },
      },
      required: ['username', 'password', 'nama_member'],
    },
  })
  create(@Body() dto: any) {
    return this.adminService.createMember(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Admin Space: Detail Data Member Berdasarkan ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id') id: string) {
    return this.adminService.findOneMember(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Admin Space: Update Data Member / Pelanggan' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nama_member: { type: 'string', example: 'John Doe, S.Kom' },
        instansi: { type: 'string', example: 'PT Inovasi Digital' },
        alamat: { type: 'string', example: 'Jl. Gatot Subroto No. 45, Jakarta' },
        telp: { type: 'string', example: '081298765432' },
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.adminService.updateMember(+id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Admin Space: Hapus Data Member / Pelanggan' })
  @ApiParam({ name: 'id', example: 1 })
  remove(@Param('id') id: string) {
    return this.adminService.removeMember(+id);
  }
}