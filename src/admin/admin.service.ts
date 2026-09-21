import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  async getProfile(userId?: number) {
    let owner = await this.prisma.spaceOwner.findFirst({
      where: userId ? { id_user: Number(userId) } : undefined,
    });

    if (!owner) {
      owner = await this.prisma.spaceOwner.findFirst();
    }

    if (!owner) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      const user = await this.prisma.user.create({
        data: {
          username: 'admin_space',
          email: 'admin@mokletcoworking.com',
          password: hashedPassword,
          role: 'admin_space',
        },
      });

      owner = await this.prisma.spaceOwner.create({
        data: {
          nama_coworking: 'Moklet Hub Coworking Space',
          nama_pemilik: 'Ahmad Bidin, S.Kom',
          telp: '081298765432',
          alamat: 'Jl. Danau Ranau, Sawojajar, Kota Malang',
          deskripsi_fasilitas: 'Koneksi fiber optic 100Mbps, AC, free flow coffee & tea, proyektor, whiteboard',
          id_user: user.id,
        },
      });
    }

    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data: {
        id: owner.id,
        nama_coworking: owner.nama_coworking,
        nama_pemilik: owner.nama_pemilik,
        telp: owner.telp,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async updateProfile(userId: number | any, dto: any) {
    const actualDto = typeof userId === 'object' ? userId : dto || {};
    const targetUserId = typeof userId === 'number' ? userId : undefined;

    const existing = await this.getProfile(targetUserId);

    const updated = await this.prisma.spaceOwner.update({
      where: { id: existing.data.id },
      data: {
        nama_coworking: actualDto.nama_coworking ?? existing.data.nama_coworking,
        nama_pemilik: actualDto.nama_pemilik ?? existing.data.nama_pemilik,
        telp: actualDto.telp ?? existing.data.telp,
      },
    });

    return {
      status: true,
      statusCode: 200,
      message: 'Profil Coworking Space berhasil diperbarui!',
      data: {
        id: updated.id,
        nama_coworking: updated.nama_coworking,
        nama_pemilik: updated.nama_pemilik,
        telp: updated.telp,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async findAllMembers(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { nama_member: { contains: search } },
        { instansi: { contains: search } },
        { telp: { contains: search } },
      ];
    }

    const members = await this.prisma.member.findMany({
      where,
      orderBy: { id: 'asc' },
    });

    const data = members.map((m) => ({
      id: m.id,
      nama_member: m.nama_member,
      instansi: m.instansi,
      alamat: m.alamat,
      telp: m.telp,
      foto: m.foto,
      created_at: (m as any).created_at || new Date().toISOString(),
    }));

    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data,
      timestamp: new Date().toISOString(),
    };
  }

  async createMember(dto: any) {
    if (dto.foto) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const ext = dto.foto.substring(dto.foto.lastIndexOf('.')).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        throw new BadRequestException('Format file foto tidak valid! Hanya diperbolehkan format .jpg, .jpeg, .png, atau .webp');
      }
    }

    const username = dto.username || dto.email?.split('@')[0];
    if (!username) {
      throw new BadRequestException('Username wajib diisi!');
    }

    const existingUser = await this.prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      throw new BadRequestException(`Username "${username}" sudah digunakan oleh akun lain! Silakan gunakan username yang berbeda.`);
    }

    const email = dto.email || `${username}@gmail.com`;
    const hashedPassword = await bcrypt.hash(dto.password || 'Secret123!', 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role: 'member',
        },
      });

      const member = await tx.member.create({
        data: {
          nama_member: dto.nama_member,
          instansi: dto.instansi || null,
          alamat: dto.alamat || null,
          telp: dto.telp || '-',
          foto: dto.foto || null,
          id_user: user.id,
        },
      });

      return member;
    });

    return {
      status: true,
      statusCode: 201,
      message: 'Data member baru berhasil ditambahkan!',
      data: {
        id: result.id,
        nama_member: result.nama_member,
        instansi: result.instansi,
        alamat: result.alamat,
        telp: result.telp,
        foto: result.foto,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async findOneMember(id: number) {
    const member = await this.prisma.member.findUnique({
      where: { id: Number(id) },
    });

    if (!member) {
      throw new NotFoundException('Data member tidak ditemukan');
    }

    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data: {
        id: member.id,
        nama_member: member.nama_member,
        instansi: member.instansi,
        alamat: member.alamat,
        telp: member.telp,
        foto: member.foto,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async updateMember(id: number, dto: any) {
    await this.findOneMember(id);

    // Validasi Ekstensi Foto
    if (dto.foto) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const ext = dto.foto.substring(dto.foto.lastIndexOf('.')).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        throw new BadRequestException('Format file foto tidak valid! Hanya diperbolehkan format .jpg, .jpeg, .png, atau .webp');
      }
    }

    const updated = await this.prisma.member.update({
      where: { id: Number(id) },
      data: {
        nama_member: dto.nama_member,
        instansi: dto.instansi,
        alamat: dto.alamat,
        telp: dto.telp,
        foto: dto.foto,
      },
    });

    return {
      status: true,
      statusCode: 200,
      message: 'Data member berhasil diperbarui!',
      data: {
        id: updated.id,
        nama_member: updated.nama_member,
        instansi: updated.instansi,
        alamat: updated.alamat,
        telp: updated.telp,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async removeMember(id: number) {
    const member = await this.prisma.member.findUnique({
      where: { id: Number(id) },
    });

    if (!member) {
      throw new NotFoundException('Data member tidak ditemukan');
    }

    if (member.id_user) {
      await this.prisma.user.delete({ where: { id: member.id_user } });
    } else {
      await this.prisma.member.delete({ where: { id: Number(id) } });
    }

    return {
      status: true,
      statusCode: 200,
      message: 'Data member berhasil dihapus!',
      data: {
        id: Number(id),
        deleted: true,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async findAllSpaces() {
    const spaces = await this.prisma.space.findMany({
      orderBy: { id: 'asc' },
    });

    const data = spaces.map((s) => ({
      id: s.id,
      nama_space: s.nama_space,
      harga_per_jam: s.harga_per_jam,
      tipe: s.tipe,
      kapasitas: s.kapasitas,
      foto: s.foto,
      foto_url: s.foto ? `http://localhost:3000/uploads/spaces/${s.foto}` : null,
    }));

    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data,
      timestamp: new Date().toISOString(),
    };
  }

  async createSpace(dto: any) {
    if (dto.foto) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const ext = dto.foto.substring(dto.foto.lastIndexOf('.')).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        throw new BadRequestException('Format file foto tidak valid! Hanya diperbolehkan format .jpg, .jpeg, .png, atau .webp');
      }
    }

    if (!dto.nama_space) {
      throw new BadRequestException('Nama space wajib diisi!');
    }

    const existingSpace = await this.prisma.space.findFirst({
      where: { nama_space: dto.nama_space },
    });

    if (existingSpace) {
      throw new BadRequestException(`Space dengan nama "${dto.nama_space}" sudah terdaftar! Silakan gunakan nama yang berbeda.`);
    }

    const owner = await this.prisma.spaceOwner.findFirst();
    const space = await this.prisma.space.create({
      data: {
        nama_space: dto.nama_space,
        kapasitas: Number(dto.kapasitas || 1),
        harga_per_jam: Number(dto.harga_per_jam || dto.harga || 0),
        tipe: dto.tipe || 'desk',
        deskripsi: dto.deskripsi || null,
        fasilitas: dto.fasilitas || null,
        foto: dto.foto || null,
        id_owner: dto.id_owner ? Number(dto.id_owner) : owner?.id || 1,
      },
    });

    return {
      status: true,
      statusCode: 201,
      message: 'Space baru berhasil ditambahkan!',
      data: {
        id: space.id,
        nama_space: space.nama_space,
        harga_per_jam: space.harga_per_jam,
        tipe: space.tipe,
        kapasitas: space.kapasitas,
        deskripsi: space.deskripsi,
        foto: space.foto,
        id_owner: space.id_owner,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async findOneSpace(id: number) {
    const space = await this.prisma.space.findUnique({
      where: { id: Number(id) },
    });

    if (!space) {
      throw new NotFoundException('Data space tidak ditemukan');
    }

    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data: {
        id: space.id,
        nama_space: space.nama_space,
        harga_per_jam: space.harga_per_jam,
        tipe: space.tipe,
        kapasitas: space.kapasitas,
        deskripsi: space.deskripsi,
        foto: space.foto,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async updateSpace(id: number, dto: any) {
    await this.findOneSpace(id);

    if (dto.foto) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const ext = dto.foto.substring(dto.foto.lastIndexOf('.')).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        throw new BadRequestException('Format file foto tidak valid! Hanya diperbolehkan format .jpg, .jpeg, .png, atau .webp');
      }
    }

    const updated = await this.prisma.space.update({
      where: { id: Number(id) },
      data: {
        nama_space: dto.nama_space ?? undefined,
        kapasitas: dto.kapasitas ? Number(dto.kapasitas) : undefined,
        harga_per_jam: dto.harga_per_jam || dto.harga ? Number(dto.harga_per_jam || dto.harga) : undefined,
        tipe: dto.tipe ?? undefined,
        deskripsi: dto.deskripsi ?? undefined,
        fasilitas: dto.fasilitas ?? undefined,
        foto: dto.foto ?? undefined,
      },
    });

    return {
      status: true,
      statusCode: 200,
      message: 'Data space berhasil diperbarui!',
      data: {
        id: updated.id,
        nama_space: updated.nama_space,
        harga_per_jam: updated.harga_per_jam,
        tipe: updated.tipe,
        kapasitas: updated.kapasitas,
        deskripsi: updated.deskripsi,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async removeSpace(id: number) {
    const space = await this.prisma.space.findUnique({
      where: { id: Number(id) },
    });

    if (!space) {
      throw new NotFoundException('Data space tidak ditemukan');
    }

    await this.prisma.space.delete({ where: { id: Number(id) } });

    return {
      status: true,
      statusCode: 200,
      message: 'Space berhasil dihapus!',
      data: {
        id: Number(id),
        deleted: true,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async findAllDiskon() {
    const data = await this.prisma.diskon.findMany({
      orderBy: { id: 'asc' },
    });

    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data,
      timestamp: new Date().toISOString(),
    };
  }

  async createDiskon(dto: any) {
    const namaDiskon = dto.nama_diskon || dto.nama_promo || dto.kode_diskon;
    if (!namaDiskon) {
      throw new BadRequestException('Nama diskon / kode promo wajib diisi!');
    }

    const existing = await this.prisma.diskon.findFirst({
      where: { nama_diskon: namaDiskon },
    });
    if (existing) {
      throw new BadRequestException(`Kode promo "${namaDiskon}" sudah terdaftar!`);
    }

    const diskon = await this.prisma.diskon.create({
      data: {
        nama_diskon: namaDiskon,
        persentase_diskon: Number(dto.persentase_diskon || dto.persentase || 0),
        tanggal_awal: new Date(dto.tanggal_awal || Date.now()),
        tanggal_akhir: new Date(dto.tanggal_akhir || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
      },
    });

    return {
      status: true,
      statusCode: 201,
      message: 'Kode promo baru berhasil dibuat!',
      data: {
        id: diskon.id,
        nama_diskon: diskon.nama_diskon,
        persentase_diskon: diskon.persentase_diskon,
        tanggal_awal: diskon.tanggal_awal,
        tanggal_akhir: diskon.tanggal_akhir,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async findOneDiskon(id: number) {
    const diskon = await this.prisma.diskon.findUnique({
      where: { id: Number(id) },
    });

    if (!diskon) {
      throw new NotFoundException('Data promo/diskon tidak ditemukan');
    }

    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data: {
        id: diskon.id,
        nama_diskon: diskon.nama_diskon,
        persentase_diskon: diskon.persentase_diskon,
        tanggal_awal: diskon.tanggal_awal,
        tanggal_akhir: diskon.tanggal_akhir,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async updateDiskon(id: number, dto: any) {
    const existing = await this.findOneDiskon(id);

    const updated = await this.prisma.diskon.update({
      where: { id: Number(id) },
      data: {
        nama_diskon: dto.nama_diskon ?? existing.data.nama_diskon,
        persentase_diskon: dto.persentase_diskon ? Number(dto.persentase_diskon) : undefined,
        tanggal_awal: dto.tanggal_awal ? new Date(dto.tanggal_awal) : undefined,
        tanggal_akhir: dto.tanggal_akhir ? new Date(dto.tanggal_akhir) : undefined,
      },
    });

    return {
      status: true,
      statusCode: 200,
      message: 'Data promo diskon berhasil diperbarui!',
      data: {
        id: updated.id,
        nama_diskon: updated.nama_diskon,
        persentase_diskon: updated.persentase_diskon,
        tanggal_awal: updated.tanggal_awal,
        tanggal_akhir: updated.tanggal_akhir,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async removeDiskon(id: number) {
    await this.findOneDiskon(id);

    await this.prisma.diskon.delete({ where: { id: Number(id) } });

    return {
      status: true,
      statusCode: 200,
      message: 'Kode promo berhasil dihapus!',
      data: {
        id: Number(id),
        deleted: true,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async findAllReservasi(query: { month?: string; year?: string; status?: string; id_space?: string; tanggal?: string }) {
    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.tanggal) {
      const date = new Date(query.tanggal);
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      where.tanggal_reservasi = { gte: start, lte: end };
    } else if (query.month && query.year) {
      const m = Number(query.month);
      const y = Number(query.year);
      const start = new Date(y, m - 1, 1, 0, 0, 0);
      const end = new Date(y, m, 0, 23, 59, 59, 999);
      where.tanggal_reservasi = { gte: start, lte: end };
    }

    if (query.id_space) {
      where.detail_reservasi = {
        some: { id_space: Number(query.id_space) },
      };
    }

    const reservations = await this.prisma.reservasi.findMany({
      where,
      include: {
        member: true,
        detail_reservasi: {
          include: {
            space: true,
            diskon: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    const data = reservations.map((r) => {
      const detail = r.detail_reservasi[0];
      const space = detail?.space;
      const hargaPerJam = space ? space.harga_per_jam : 0;
      const hargaAwal = hargaPerJam * r.durasi_jam;
      const totalBayar = detail?.total_harga ?? hargaAwal;
      const potonganDiskon = Math.max(0, hargaAwal - totalBayar);

      return {
        id: r.id,
        kode_booking: r.kode_booking || `BOOK-${new Date(r.tanggal_reservasi).toISOString().slice(0,10).replace(/-/g,'')}-${String(r.id).padStart(4, '0')}`,
        tanggal_reservasi: new Date(r.tanggal_reservasi).toISOString().slice(0, 10),
        jam_mulai: r.jam_mulai || '09:00',
        jam_selesai: r.jam_selesai || '12:00',
        durasi_jam: r.durasi_jam,
        total_harga_awal: hargaAwal,
        potongan_diskon: potonganDiskon,
        total_bayar: totalBayar,
        status: r.status,
        member: r.member ? {
          id: r.member.id,
          nama_member: r.member.nama_member,
          telp: r.member.telp,
        } : null,
        space: space ? {
          id: space.id,
          nama_space: space.nama_space,
          tipe: space.tipe,
        } : null,
      };
    });

    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data,
      timestamp: new Date().toISOString(),
    };
  }

  async updateStatusReservasi(id: number, status: string) {
    const reservasi = await this.prisma.reservasi.findUnique({ where: { id: Number(id) } });
    if (!reservasi) throw new NotFoundException('Data reservasi tidak ditemukan');

    if (reservasi.status === 'dibatalkan') {
      throw new BadRequestException('Reservasi ini sudah dibatalkan oleh member dan tidak dapat diubah statusnya lagi!');
    }
    if (reservasi.status === 'selesai') {
      throw new BadRequestException('Reservasi ini sudah selesai dan ditutup!');
    }

    const updated = await this.prisma.reservasi.update({
      where: { id: Number(id) },
      data: { status },
    });

    return {
      status: true,
      statusCode: 200,
      message: `Status reservasi berhasil diperbarui menjadi ${status}`,
      data: {
        id: updated.id,
        status: updated.status,
        updated_at: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };
  }

  async checkIn(id: number) {
    const reservasi = await this.prisma.reservasi.findUnique({ where: { id: Number(id) } });
    if (!reservasi) throw new NotFoundException('Data reservasi tidak ditemukan');

    const updated = await this.prisma.reservasi.update({
      where: { id: Number(id) },
      data: { status: 'aktif' },
    });

    return {
      status: true,
      statusCode: 200,
      message: 'Check-in member berhasil! Status reservasi aktif.',
      data: {
        id: updated.id,
        status: updated.status,
        check_in_time: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };
  }

  async checkOut(id: number) {
    const reservasi = await this.prisma.reservasi.findUnique({ where: { id: Number(id) } });
    if (!reservasi) throw new NotFoundException('Data reservasi tidak ditemukan');

    const updated = await this.prisma.reservasi.update({
      where: { id: Number(id) },
      data: { status: 'selesai' },
    });

    return {
      status: true,
      statusCode: 200,
      message: 'Check-out member berhasil! Reservasi telah selesai.',
      data: {
        id: updated.id,
        status: updated.status,
        check_out_time: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };
  }
  
  async getMonthlyReport(query: { month?: string; year?: string }) {
    const now = new Date();
    const month = query.month ? Number(query.month) : now.getMonth() + 1;
    const year = query.year ? Number(query.year) : now.getFullYear();

    const start = new Date(year, month - 1, 1, 0, 0, 0);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const reservations = await this.prisma.reservasi.findMany({
      where: {
        tanggal_reservasi: { gte: start, lte: end },
        status: { notIn: ['dibatalkan', 'belum_dikonfirm'] },
      },
      include: {
        detail_reservasi: {
          include: {
            space: true,
          },
        },
      },
    });

    let totalTransaksi = reservations.length;
    let totalJamTerpakai = 0;
    let estimasiKotor = 0;
    let totalPotonganDiskon = 0;
    let realisasiBersih = 0;

    const typeMap: Record<string, { label: string; total_booking: number; total_jam: number; total_pendapatan: number }> = {
      desk: { label: 'Personal Desk', total_booking: 0, total_jam: 0, total_pendapatan: 0 },
      meeting_room: { label: 'Meeting Room', total_booking: 0, total_jam: 0, total_pendapatan: 0 },
      private_office: { label: 'Private Office', total_booking: 0, total_jam: 0, total_pendapatan: 0 },
    };

    for (const r of reservations) {
      totalJamTerpakai += r.durasi_jam;
      const detail = r.detail_reservasi[0];
      const space = detail?.space;
      const tipe = space?.tipe || 'desk';

      const hargaPerJam = space ? space.harga_per_jam : 0;
      const hargaAwal = hargaPerJam * r.durasi_jam;
      const bayar = detail?.total_harga ?? hargaAwal;
      const potongan = Math.max(0, hargaAwal - bayar);

      estimasiKotor += hargaAwal;
      totalPotonganDiskon += potongan;
      realisasiBersih += bayar;

      if (typeMap[tipe]) {
        typeMap[tipe].total_booking += 1;
        typeMap[tipe].total_jam += r.durasi_jam;
        typeMap[tipe].total_pendapatan += bayar;
      }
    }

    const rincian_per_tipe_space = Object.keys(typeMap).map((tipe) => ({
      tipe,
      label: typeMap[tipe].label,
      total_booking: typeMap[tipe].total_booking,
      total_jam: typeMap[tipe].total_jam,
      total_pendapatan: typeMap[tipe].total_pendapatan,
    }));

    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data: {
        month,
        year,
        total_transaksi: totalTransaksi,
        total_jam_terpakai: totalJamTerpakai,
        estimasi_pendapatan_kotor: estimasiKotor,
        total_potongan_diskon: totalPotonganDiskon,
        realisasi_pendapatan_bersih: realisasiBersih,
        rincian_per_tipe_space,
      },
      timestamp: new Date().toISOString(),
 };
  }

  async getIncomeReport(query: { month?: string; year?: string }) {
    const report = await this.getMonthlyReport(query);
    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data: {
        month: report.data.month,
        year: report.data.year,
        realisasi_pendapatan_bersih: report.data.realisasi_pendapatan_bersih,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
  