import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminSpaceGuard } from '../auth/roles.guard';

@ApiTags('Admin - Manajemen Ruangan')
@Controller('admin/spaces')
export class AdminSpaceController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Get() 
  @ApiOperation({ summary: 'Admin Space: Daftar Semua Ruangan & Meja Milik Admin' })
  findAll() { 
    return this.adminService.findAllSpaces(); 
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Post() 
  @ApiOperation({ summary: 'Admin Space: Tambah Ruangan / Meja Space Baru Beserta Fasilitas & Foto' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nama_space: { type: 'string', example: 'Personal Desk Alpha 01' },
        harga_per_jam: { type: 'number', example: 25000 },
        tipe: { type: 'string', example: 'desk' },
        kapasitas: { type: 'number', example: 1 },
        deskripsi: { type: 'string', example: 'Dilengkapi colokan listrik, WiFi 100Mbps, monitor 24 inch, dan free flow kopi/teh.' },
        foto: { type: 'string', example: 'desk_alpha_01.jpg' },
      },
      required: ['nama_space', 'harga_per_jam', 'tipe'],
    },
  })
  create(@Body() dto: any) { 
    return this.adminService.createSpace(dto); 
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Get(':id') 
  @ApiOperation({ summary: 'Admin Space: Detail Data Space Berdasarkan ID' })
  @ApiParam({ name: 'id', example: 5 })
  findOne(@Param('id') id: string) { 
    return this.adminService.findOneSpace(+id); 
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Put(':id') 
  @ApiOperation({ summary: 'Admin Space: Update Data Ruangan & Fasilitas Space' })
  @ApiParam({ name: 'id', example: 5 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nama_space: { type: 'string', example: 'Personal Desk Alpha 01 (Updated)' },
        harga_per_jam: { type: 'number', example: 30000 },
        kapasitas: { type: 'number', example: 2 },
        deskripsi: { type: 'string', example: 'Fasilitas terupdate dengan monitor 27 inch 4K dan standing desk elektrik.' },
        foto: { type: 'string', example: 'desk_alpha_01_updated.jpg' },
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: any) { 
    return this.adminService.updateSpace(+id, dto); 
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Delete(':id') 
  @ApiOperation({ summary: 'Admin Space: Hapus Data Ruangan / Meja Space' })
  @ApiParam({ name: 'id', example: 5 })
  remove(@Param('id') id: string) { 
    return this.adminService.removeSpace(+id); 
  }
}