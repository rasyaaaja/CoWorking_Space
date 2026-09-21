import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterMemberDto, RegisterAdminSpaceDto, LoginDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, 
  ) { }

  async registerMember(dto: RegisterMemberDto) {
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new BadRequestException('Username sudah digunakan oleh akun lain!');
    }

    const email = dto.email || `${dto.username}@gmail.com`;
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: email,
        password: hashedPassword,
        role: 'member',
        member: {
          create: {
            nama_member: dto.nama_member,
            instansi: dto.instansi || null,
            alamat: dto.alamat || null,
            telp: dto.telp,
            foto: dto.foto || null,
          },
        },
      },
      include: {
        member: true,
      },
    });

    const accessToken = this.jwtService.sign({
      sub: newUser.id,
      username: newUser.username,
      role: newUser.role,
    });

    return {
      status: true,
      statusCode: 201,
      message: 'Registrasi member berhasil!',
      data: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        member: newUser.member,
        access_token: accessToken,
      },
      timestamp: new Date().toISOString(),
    };
  }

  // 2. POST /api/auth/register/admin-space (Sesuai Soal Hal. 15)
  async registerAdminSpace(dto: RegisterAdminSpaceDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (existingUser) {
      throw new BadRequestException('Username sudah digunakan oleh akun lain!');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newAdmin = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: `${dto.username}@coworking.admin`,
        password: hashedPassword,
        role: 'admin_space',
        space_owner: {
          create: {
            nama_coworking: dto.nama_coworking || 'Moklet Hub Coworking',
            nama_pemilik: dto.nama_pemilik || 'Ahmad Bidin',
            telp: dto.telp || '081298765432',
          },
        },
      },
      include: {
        space_owner: true,
      },
    });

    const accessToken = this.jwtService.sign({
      sub: newAdmin.id,
      username: newAdmin.username,
      role: newAdmin.role,
    });

    return {
      status: true,
      statusCode: 201,
      message: 'Registrasi Admin Space berhasil!',
      data: {
        id: newAdmin.id,
        username: newAdmin.username,
        role: newAdmin.role,
        space_owner: newAdmin.space_owner,
        access_token: accessToken,
      },
      timestamp: new Date().toISOString(),
    };
  }

  // 3. POST /api/auth/login (Sesuai Soal Hal. 16)
  async login(dto: LoginDto) {
    if (!dto || !dto.username || !dto.password) {
      throw new UnauthorizedException('Username atau Password salah!');
    }

    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
      include: { 
        member: true,
        space_owner: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Username atau Password salah!');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Username atau Password salah!');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      status: true,
      statusCode: 200,
      message: 'Login berhasil!',
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        maker_id: user.member?.id || user.space_owner?.id || null,
        member: user.role === 'member' ? user.member : null,
        space_owner: user.role === 'admin_space' ? user.space_owner : null,
        access_token: accessToken,
      },
      timestamp: new Date().toISOString(),
    };
  }

  // 4. GET /api/auth/profile (Sesuai Soal Hal. 16)
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        member: true,
        space_owner: true, 
      },
    });

    if (!user) {
      throw new BadRequestException('Pengguna tidak ditemukan.');
    }

    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        ...(user.role === 'member' 
          ? { member: user.member } 
          : { space_owner: user.space_owner }),
      },
      timestamp: new Date().toISOString(),
    };
  }
}