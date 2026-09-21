import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterMemberDto, RegisterAdminSpaceDto, LoginDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth & Users')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register/member')
  @ApiOperation({ summary: 'Publik: Registrasi Akun Member / Pelanggan Baru' })
  registerMember(@Body() dto: RegisterMemberDto) {
    return this.authService.registerMember(dto);
  }

  @Post('register/admin-space')
  @ApiOperation({ summary: 'Publik: Registrasi Pengelola Lokasi / Admin Coworking Space' })
  registerAdminSpace(@Body() dto: RegisterAdminSpaceDto) {
    return this.authService.registerAdminSpace(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Publik: Login Akun User (Member atau Admin Space) Mengembalikan JWT Token' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Bearer User: Lihat Profil Pengguna yang Sedang Login' })
  getProfile(@Request() req: any) {
    const userId = req.user?.sub || req.user?.id;
    return this.authService.getProfile(userId);
  }
}