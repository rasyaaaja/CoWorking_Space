import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Auth & Users')
@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register/member')
  @ApiOperation({ summary: 'Publik: Registrasi Akun Member / Pelanggan Baru' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'johndoe' },
        email: { type: 'string', example: 'johndoe@gmail.com' },
        password: { type: 'string', example: 'Secret123!' },
        nama_member: { type: 'string', example: 'John Doe' },
        instansi: { type: 'string', example: 'Universitas Brawijaya' },
        alamat: { type: 'string', example: 'Jl. Danau Ranau No. 1' },
        telp: { type: 'string', example: '081234567890' },
        foto: { type: 'string', example: 'avatar_member.png' },
      },
      required: ['username', 'email', 'password', 'nama_member', 'telp'],
    },
  })
  registerMember(@Body() dto: any) {
    return this.usersService.registerMember(dto);
  }

  @Post('register/admin-space')
  @ApiOperation({ summary: 'Publik: Registrasi Pengelola Lokasi / Admin Coworking Space' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'admin_space1' },
        email: { type: 'string', example: 'admin@mokletcoworking.com' },
        password: { type: 'string', example: 'Admin123!' },
        nama_coworking: { type: 'string', example: 'Moklet Hub Coworking' },
        nama_pemilik: { type: 'string', example: 'Ahmad Bidin' },
        telp: { type: 'string', example: '081298765432' },
        alamat: { type: 'string', example: 'Jl. Danau Ranau Sawojajar' },
        deskripsi_fasilitas: { type: 'string', example: 'Full AC, High Speed WiFi 100Mbps, Free Coffee' },
      },
      required: ['username', 'password', 'nama_coworking'],
    },
  })
  registerAdmin(@Body() dto: any) {
    return this.usersService.registerAdmin(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Publik: Login Akun User (Member atau Admin Space) Mengembalikan JWT Token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'johndoe', description: 'Bisa berupa username atau email' },
        password: { type: 'string', example: 'Secret123!' },
      },
      required: ['username', 'password'],
    },
  })
  login(@Body() dto: any) {
    return this.usersService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bearer User: Cek Profil & Hak Akses Pengguna yang Sedang Login' })
  getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user);
  }
}

