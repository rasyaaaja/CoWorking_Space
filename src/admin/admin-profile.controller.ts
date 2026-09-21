import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminSpaceGuard } from '../auth/roles.guard';

class UpdateProfileSwaggerDto {
  @ApiProperty({ example: 'Moklet Hub Coworking Space (Updated)', required: false })
  nama_coworking?: string;

  @ApiProperty({ example: 'Ahmad Bidin, S.Kom', required: false })
  nama_pemilik?: string;

  @ApiProperty({ example: '081298765432', required: false })
  telp?: string;

  @ApiProperty({ example: 'Jl. Danau Ranau No. 1, Sawojajar, Malang', required: false })
  alamat?: string;

  @ApiProperty({ example: 'Koneksi fiber optic 100Mbps, AC, free coffee', required: false })
  deskripsi_fasilitas?: string;
}

@ApiTags('Admin - Profil Space')
@Controller('admin/profile')
export class AdminProfileController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Get()
  @ApiOperation({ summary: 'Admin Space: Lihat Data Profil Lokasi Coworking Space' })
  getProfile(@Request() req: any) {
    const userId = req.user?.sub || req.user?.id;
    return this.adminService.getProfile(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminSpaceGuard)
  @Put()
  @ApiOperation({ summary: 'Admin Space: Update Data Profil Lokasi Coworking Space' })
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileSwaggerDto) {
    const userId = req.user?.sub || req.user?.id;
    return this.adminService.updateProfile(userId, dto);
  }
}