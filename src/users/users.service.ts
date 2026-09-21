import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private validateEmail(email: string) {
    if (!email) {
      throw new BadRequestException('Email tidak boleh kosong!');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Format email tidak valid!');
    }
  }

  async registerMember(dto: any) {
    const userEmail = dto.email;
    this.validateEmail(userEmail);

    const username = dto.username || (userEmail ? userEmail.split('@')[0] : 'member_' + Date.now());

    // Cek duplikasi email atau username
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: userEmail }, { username: username }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email atau Username tersebut sudah terdaftar!');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: username,
          email: userEmail,
          password: hashedPassword,
          role: 'member',
        },
      });

      const member = await tx.member.create({
        data: {
          nama_member: dto.nama_member || dto.nama || username,
          instansi: dto.instansi || null,
          alamat: dto.alamat || null,
          telp: dto.telp || dto.no_telepon || '-',
          foto: dto.foto || null,
          id_user: user.id,
        },
      });

      return { user, member };
    });

    return {
      status: true,
      statusCode: 201,
      message: 'Registrasi member / pelanggan berhasil!',
      data: {
        id_user: result.user.id,
        id_member: result.member.id,
        username: result.user.username,
        email: result.user.email,
        nama_member: result.member.nama_member,
        instansi: result.member.instansi,
        telp: result.member.telp,
      },
    };
  }

  async registerAdmin(dto: any) {
    const adminEmail = dto.email || `${dto.username || 'admin_' + Date.now()}@adminspace.com`;
    this.validateEmail(adminEmail);

    const username = dto.username || adminEmail.split('@')[0];

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: adminEmail }, { username: username }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email atau Username admin sudah digunakan!');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: username,
          email: adminEmail,
          password: hashedPassword,
          role: 'admin_space',
        },
      });

      const spaceOwner = await tx.spaceOwner.create({
        data: {
          nama_coworking: dto.nama_coworking || 'Moklet Hub Coworking',
          nama_pemilik: dto.nama_pemilik || username,
          telp: dto.telp || '-',
          alamat: dto.alamat || null,
          deskripsi_fasilitas: dto.deskripsi_fasilitas || dto.fasilitas || null,
          id_user: user.id,
        },
      });

      return { user, spaceOwner };
    });

    return {
      status: true,
      statusCode: 201,
      message: 'Registrasi pengelola/admin space berhasil!',
      data: {
        id_user: result.user.id,
        id_owner: result.spaceOwner.id,
        username: result.user.username,
        email: result.user.email,
        nama_coworking: result.spaceOwner.nama_coworking,
        nama_pemilik: result.spaceOwner.nama_pemilik,
        telp: result.spaceOwner.telp,
      },
    };
  }

  async login(dto: any) {
    const identifier = dto.username || dto.email;
    if (!identifier) {
      throw new BadRequestException('Username atau Email harus diisi!');
    }

    if (!dto.password) {
      throw new BadRequestException('Password harus diisi!');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
      include: {
        member: true,
        space_owner: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Kredensial login tidak valid!');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Kredensial login tidak valid!');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      status: true,
      statusCode: 200,
      message: 'Login berhasil!',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.role === 'admin_space' ? user.space_owner : user.member,
        token: token,
      },
    };
  }

  async getProfile(user: any) {
    if (!user) {
      throw new UnauthorizedException('User belum login!');
    }

    const userData = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        member: true,
        space_owner: true,
      },
    });

    if (!userData) {
      throw new UnauthorizedException('Data user tidak ditemukan!');
    }

    return {
      status: true,
      statusCode: 200,
      message: 'Profil pengguna berhasil dimuat',
      data: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        member: userData.member,
        space_owner: userData.space_owner,
      },
    };
  }
}
