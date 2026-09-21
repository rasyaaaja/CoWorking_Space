import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DiskonService {
  constructor(private prisma: PrismaService) {}

  async findAllActive() {
    const now = new Date();
    const diskons = await this.prisma.diskon.findMany({
      where: {
        tanggal_awal: { lte: now },
        tanggal_akhir: { gte: now },
      },
      orderBy: { id: 'asc' },
    });

    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data: diskons,
      timestamp: new Date().toISOString(),
    };
  }

  async checkDiskon(dto: { kode_diskon?: string; nama_diskon?: string; nama_promo?: string; total_harga?: number }) {
    const kode = dto.nama_diskon || dto.kode_diskon || dto.nama_promo;
    if (!kode) {
      throw new BadRequestException('Kode promo tidak ditemukan atau sudah kedaluwarsa!');
    }

    const diskon = await this.prisma.diskon.findFirst({
      where: {
        nama_diskon: String(kode).trim(),
      },
    });

    const now = new Date();
    if (!diskon || new Date(diskon.tanggal_awal) > now || new Date(diskon.tanggal_akhir) < now) {
      throw new BadRequestException('Kode promo tidak ditemukan atau sudah kedaluwarsa!');
    }

    return {
      status: true,
      statusCode: 200,
      message: 'Kode promo valid dan masih berlaku!',
      data: {
        id: diskon.id,
        nama_diskon: diskon.nama_diskon,
        persentase_diskon: diskon.persentase_diskon,
        tanggal_awal: diskon.tanggal_awal,
        tanggal_akhir: diskon.tanggal_akhir,
        is_active: true,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async findOne(id: number) {
    const diskon = await this.prisma.diskon.findUnique({ where: { id: Number(id) } });
    if (!diskon) {
      throw new NotFoundException('Data diskon tidak ditemukan');
    }

    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data: diskon,
      timestamp: new Date().toISOString(),
    };
  }

  async findAll() {
    return await this.prisma.diskon.findMany();
  }

  async create(dto: any) {
    return await this.prisma.diskon.create({
      data: {
        nama_diskon: dto.nama_diskon || dto.nama_promo || dto.kode_diskon,
        persentase_diskon: Number(dto.persentase_diskon || dto.persentase || 0),
        tanggal_awal: new Date(dto.tanggal_awal || Date.now()),
        tanggal_akhir: new Date(dto.tanggal_akhir || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
      },
    });
  }

  async update(id: number, dto: any) {
    await this.findOne(id);
    return await this.prisma.diskon.update({
      where: { id: Number(id) },
      data: {
        nama_diskon: dto.nama_diskon || dto.nama_promo || dto.kode_diskon,
        persentase_diskon: dto.persentase_diskon ? Number(dto.persentase_diskon) : undefined,
        tanggal_awal: dto.tanggal_awal ? new Date(dto.tanggal_awal) : undefined,
        tanggal_akhir: dto.tanggal_akhir ? new Date(dto.tanggal_akhir) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.diskon.delete({ where: { id: Number(id) } });
  }
}