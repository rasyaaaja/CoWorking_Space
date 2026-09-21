import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    return await this.prisma.member.create({
      data: {
        nama_member: dto.nama_member || dto.nama,
        instansi: dto.instansi || null,
        alamat: dto.alamat || null,
        telp: dto.telp || dto.no_telepon || '-',
        foto: dto.foto || null,
      },
    });
  }

  async findAll() {
    return await this.prisma.member.findMany({
      include: { user: true },
    });
  }

  async findOne(id: number) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!member) throw new NotFoundException('Member tidak ditemukan');
    return member;
  }

  async update(id: number, dto: any) {
    await this.findOne(id);
    return await this.prisma.member.update({
      where: { id },
      data: {
        nama_member: dto.nama_member || dto.nama,
        instansi: dto.instansi,
        alamat: dto.alamat,
        telp: dto.telp || dto.no_telepon,
        foto: dto.foto,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.member.delete({ where: { id } });
  }
}
