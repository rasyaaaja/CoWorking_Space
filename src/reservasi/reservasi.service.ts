import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReservasiService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { member: true },
    });

    const memberId = user?.member?.id || Number(dto.id_member || 0);
    if (!memberId) {
      throw new BadRequestException('Pengguna tidak terdaftar sebagai member!');
    }

    const idSpace = Number(dto.id_space);
    const durasiJam = Number(dto.durasi_jam || 1);
    const jamMulai = dto.jam_mulai;
    const tglReservasi = new Date(dto.tanggal_reservasi);

    const [startHour, startMin] = jamMulai.split(':').map(Number);
    if (isNaN(startHour) || startHour < 0 || startHour > 23) {
      throw new BadRequestException('Format jam mulai tidak valid! Gunakan format 24 jam (00:00 - 23:59).');
    }

    const now = new Date();
    const targetDateTime = new Date(tglReservasi);
    targetDateTime.setHours(startHour, startMin || 0, 0, 0);

    if (targetDateTime < now) {
      throw new BadRequestException('Tidak dapat membuat reservasi untuk tanggal atau jam yang sudah berlalu (masa lalu)!');
    }

    const totalEndMinutes = (startHour * 60) + (startMin || 0) + (durasiJam * 60);
    const endHour = Math.floor(totalEndMinutes / 60) % 24; 
    const endMin = totalEndMinutes % 60;

    const jamSelesai = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

    const space = await this.prisma.space.findUnique({ where: { id: idSpace } });
    if (!space) {
      throw new NotFoundException('Space tidak ditemukan!');
    }

    const existingReservations = await this.prisma.reservasi.findMany({
      where: {
        status: { in: ['belum_dikonfirm', 'disetujui', 'aktif'] },
        tanggal_reservasi: tglReservasi,
        detail_reservasi: {
          some: { id_space: idSpace },
        },
      },
    });

    const isBentrok = existingReservations.some((r) => {
      const existingStart = r.jam_mulai;
      const existingEnd = r.jam_selesai || '';
      if (!existingStart || !existingEnd) return false;
      return jamMulai < existingEnd && jamSelesai > existingStart;
    });

    if (isBentrok) {
      throw new BadRequestException('Space tidak tersedia karena jadwal bersinggungan/bentrok pada tanggal dan jam tersebut!');
    }

    let diskonId: number | null = null;
    let persentaseDiskon = 0;

    const kodePromo = dto.kode_promo ? String(dto.kode_promo).trim() : null;
    const inputDiskonId = dto.id_diskon ? Number(dto.id_diskon) : null;

    if (kodePromo && inputDiskonId) {
      const diskon = await this.prisma.diskon.findFirst({
        where: {
          id: inputDiskonId,
          nama_diskon: kodePromo,
        },
      });

      if (!diskon) {
        throw new BadRequestException('Kombinasi ID Diskon dan Kode Promo tidak cocok atau tidak valid!');
      }

      diskonId = diskon.id;
      persentaseDiskon = diskon.persentase_diskon;
    } else if (kodePromo) {
      const diskon = await this.prisma.diskon.findFirst({
        where: { nama_diskon: kodePromo },
      });

      if (!diskon) {
        throw new BadRequestException('Kode promo tidak valid atau tidak ditemukan!');
      }

      diskonId = diskon.id;
      persentaseDiskon = diskon.persentase_diskon;
    } else if (inputDiskonId) {
      const diskon = await this.prisma.diskon.findUnique({
        where: { id: inputDiskonId },
      });

      if (!diskon) {
        throw new BadRequestException('ID Diskon tidak valid atau tidak ditemukan!');
      }

      diskonId = diskon.id;
      persentaseDiskon = diskon.persentase_diskon;
    }

    const hargaPerJam = Number(space.harga_per_jam);
    const hargaKotor = hargaPerJam * durasiJam;
    const potonganDiskon = (hargaKotor * persentaseDiskon) / 100;
    const totalBayar = Math.max(0, hargaKotor - potonganDiskon);

    const dateFormatted = dto.tanggal_reservasi.replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const kodeBooking = `BOOK-${dateFormatted}-${randomSuffix}`;

    const newReservasi = await this.prisma.reservasi.create({
      data: {
        kode_booking: kodeBooking,
        id_member: memberId,
        id_owner: space.id_owner || null,
        tanggal_reservasi: tglReservasi,
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai,
        durasi_jam: durasiJam,
        status: 'belum_dikonfirm',
        detail_reservasi: {
          create: {
            id_space: idSpace,
            id_diskon: diskonId,
            total_harga: totalBayar,
          },
        },
      },
    });

    return {
      status: true,
      statusCode: 201,
      message: 'Reservasi berhasil dibuat! Silakan tunggu konfirmasi admin.',
      data: {
        id: newReservasi.id,
        kode_booking: newReservasi.kode_booking,
        id_member: memberId,
        id_space: idSpace,
        id_diskon: diskonId,
        tanggal_reservasi: dto.tanggal_reservasi,
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai,
        durasi_jam: durasiJam,
        harga_per_jam: hargaPerJam,
        total_harga_awal: hargaKotor,
        potongan_diskon: potonganDiskon,
        total_bayar: totalBayar,
        status: newReservasi.status,
        created_at: newReservasi.created_at || new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };
  }

  async getMyReservations(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { member: true },
    });

    if (!user?.member) {
      throw new BadRequestException('Akses khusus member!');
    }

    const items = await this.prisma.reservasi.findMany({
      where: { id_member: user.member.id },
      include: {
        detail_reservasi: {
          include: { space: true },
        },
      },
      orderBy: { id: 'desc' },
    });

    const formatted = items.map((r) => {
      const detail = r.detail_reservasi[0];
      const space = detail?.space;
      const totalBayar = detail?.total_harga || 0;
      const [sh, sm] = r.jam_mulai.split(':').map(Number);
      const eh = sh + r.durasi_jam;
      const jamSelesai = r.jam_selesai || `${String(eh).padStart(2, '0')}:${String(sm || 0).padStart(2, '0')}`;
      const tgl = new Date(r.tanggal_reservasi).toISOString().split('T')[0];

      return {
        id: r.id,
        kode_booking: r.kode_booking,
        tanggal_reservasi: tgl,
        jam_mulai: r.jam_mulai,
        jam_selesai: jamSelesai,
        durasi_jam: r.durasi_jam,
        total_bayar: totalBayar,
        status: r.status,
        space: space
          ? {
              id: space.id,
              nama_space: space.nama_space,
              tipe: space.tipe,
            }
          : null,
      };
    });

    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data: formatted,
      timestamp: new Date().toISOString(),
    };
  }

  async getMyHistory(userId: number, monthQuery?: string | number, yearQuery?: string | number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { member: true },
    });

    if (!user?.member) {
      throw new BadRequestException('Akses khusus member!');
    }

    const now = new Date();
    const month = monthQuery ? Number(monthQuery) : now.getMonth() + 1;
    const year = yearQuery ? Number(yearQuery) : now.getFullYear();

    const start = new Date(year, month - 1, 1, 0, 0, 0);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const items = await this.prisma.reservasi.findMany({
      where: {
        id_member: user.member.id,
        tanggal_reservasi: { gte: start, lte: end },
      },
      include: {
        detail_reservasi: {
          include: { space: true },
        },
      },
      orderBy: { id: 'desc' },
    });

    let totalPengeluaran = 0;
    const formattedItems = items.map((r) => {
      const detail = r.detail_reservasi[0];
      const space = detail?.space;
      const totalBayar = detail?.total_harga || 0;
      totalPengeluaran += totalBayar;

      const [sh, sm] = r.jam_mulai.split(':').map(Number);
      const eh = sh + r.durasi_jam;
      const jamSelesai = r.jam_selesai || `${String(eh).padStart(2, '0')}:${String(sm || 0).padStart(2, '0')}`;
      const tgl = new Date(r.tanggal_reservasi).toISOString().split('T')[0];

      return {
        id: r.id,
        kode_booking: r.kode_booking,
        tanggal_reservasi: tgl,
        jam_mulai: r.jam_mulai,
        jam_selesai: jamSelesai,
        durasi_jam: r.durasi_jam,
        total_bayar: totalBayar,
        status: r.status,
        space_name: space?.nama_space || 'Personal Desk',
      };
    });

    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data: {
        month,
        year,
        total_reservasi: items.length,
        total_pengeluaran: totalPengeluaran,
        items: formattedItems,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async getETicket(id: number) {
    const reservasi = await this.prisma.reservasi.findUnique({
      where: { id: Number(id) },
      include: {
        member: true,
        detail_reservasi: {
          include: {
            space: {
              include: { space_owner: true },
            },
            diskon: true,
          },
        },
      },
    });

    if (!reservasi) {
      throw new NotFoundException('Data reservasi tidak ditemukan!');
    }

    const detail = reservasi.detail_reservasi[0];
    const space = detail?.space;
    const owner = space?.space_owner;
    const diskon = detail?.diskon;
    const member = reservasi.member;
    const totalBayar = detail?.total_harga || 0;

    const [sh, sm] = reservasi.jam_mulai.split(':').map(Number);
    const eh = sh + reservasi.durasi_jam;
    const jamSelesai = reservasi.jam_selesai || `${String(eh).padStart(2, '0')}:${String(sm || 0).padStart(2, '0')}`;

    const tarifKotor = (space?.harga_per_jam || 0) * reservasi.durasi_jam;
    const potongan = Math.max(0, tarifKotor - totalBayar);

    const tglFormatted = new Date(reservasi.tanggal_reservasi).toISOString().split('T')[0].replace(/-/g, '');
    const sequence = String(reservasi.id).padStart(4, '0');

    return {
      status: true,
      statusCode: 200,
      message: 'E-Ticket berhasil dimuat',
      data: {
        e_ticket_number: `TICKET-MOKLET-${tglFormatted}-${sequence}`,
        kode_booking: reservasi.kode_booking,
        coworking_space: {
          nama: owner?.nama_coworking || 'Moklet Hub Coworking Space',
          telepon: owner?.telp || '081298765432',
        },
        member: {
          nama: member?.nama_member || 'Pelanggan',
          instansi: member?.instansi || '-',
          telp: member?.telp || '-',
        },
        space: {
          nama: space?.nama_space || 'Space Desk',
          tipe: space?.tipe === 'desk' ? 'Personal Desk' : space?.tipe || 'Desk',
          harga_per_jam: space?.harga_per_jam || 0,
        },
        jadwal: {
          tanggal: new Date(reservasi.tanggal_reservasi).toISOString().split('T')[0],
          jam_mulai: reservasi.jam_mulai,
          jam_selesai: jamSelesai,
          durasi: `${reservasi.durasi_jam} Jam`,
        },
        rincian_pembayaran: {
          tarif_kotor: tarifKotor,
          diskon_promo: diskon ? `${diskon.persentase_diskon}% (${diskon.nama_diskon})` : '0%',
          potongan: potongan,
          total_dibayar: totalBayar,
        },
        status_reservasi: reservasi.status,
        qr_code_payload: `VERIFY-RESERVASI-${reservasi.id}-mk_4ffb8c4b40a6499ea7767bfafb32f6e0`,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async findOne(id: number) {
    const reservasi = await this.prisma.reservasi.findUnique({
      where: { id: Number(id) },
      include: {
        member: true,
        detail_reservasi: {
          include: { space: true },
        },
      },
    });

    if (!reservasi) {
      throw new NotFoundException('Data reservasi tidak ditemukan!');
    }

    const detail = reservasi.detail_reservasi[0];
    const space = detail?.space;
    const totalBayar = detail?.total_harga || 0;
    const [sh, sm] = reservasi.jam_mulai.split(':').map(Number);
    const eh = sh + reservasi.durasi_jam;
    const jamSelesai = reservasi.jam_selesai || `${String(eh).padStart(2, '0')}:${String(sm || 0).padStart(2, '0')}`;

    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data: {
        id: reservasi.id,
        kode_booking: reservasi.kode_booking,
        id_member: reservasi.id_member,
        id_space: space?.id || null,
        tanggal_reservasi: new Date(reservasi.tanggal_reservasi).toISOString().split('T')[0],
        jam_mulai: reservasi.jam_mulai,
        jam_selesai: jamSelesai,
        durasi_jam: reservasi.durasi_jam,
        total_bayar: totalBayar,
        status: reservasi.status,
        member: reservasi.member
          ? {
              nama_member: reservasi.member.nama_member,
              telp: reservasi.member.telp,
            }
          : null,
        space: space
          ? {
              nama_space: space.nama_space,
              harga_per_jam: space.harga_per_jam,
            }
          : null,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async cancel(id: number, userId?: number) {
    const reservasi = await this.prisma.reservasi.findUnique({
      where: { id: Number(id) },
    });

    if (!reservasi) {
      throw new NotFoundException('Data reservasi tidak ditemukan!');
    }

    if (reservasi.status === 'selesai' || reservasi.status === 'aktif') {
      throw new BadRequestException('Reservasi yang sudah aktif atau selesai tidak dapat dibatalkan!');
    }

    const updated = await this.prisma.reservasi.update({
      where: { id: Number(id) },
      data: { status: 'dibatalkan' },
    });

    return {
      status: true,
      statusCode: 200,
      message: 'Reservasi berhasil dibatalkan oleh pengguna',
      data: {
        id: updated.id,
        status: updated.status,
        updated_at: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };
  }
}