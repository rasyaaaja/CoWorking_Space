import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SpaceService {
  constructor(private prisma: PrismaService) {}

  async getTypes() {
    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data: [
        {
          tipe: 'desk',
          label: 'Personal Desk',
          deskripsi: 'Meja kerja individual yang nyaman dengan fasilitas colokan listrik, WiFi kencang, dan air minum.',
        },
        {
          tipe: 'meeting_room',
          label: 'Meeting Room',
          deskripsi: 'Ruang rapat tertutup dengan fasilitas proyektor/TV LED, whiteboard, sound system, dan AC dingin.',
        },
        {
          tipe: 'private_office',
          label: 'Private Office',
          deskripsi: 'Ruang kantor privat eksklusif untuk tim kecil hingga menengah dengan akses fleksibel dan keamanan 24 jam.',
        },
      ],
      timestamp: new Date().toISOString(),
    };
  }

  async checkAvailability(query: { id_space?: string | number; tanggal?: string; jam_mulai?: string; durasi_jam?: string | number }) {
    const idSpace = Number(query.id_space || 1);
    const durasi = Number(query.durasi_jam || 3);
    const jamMulai = query.jam_mulai || '09:00';
    const tanggal = query.tanggal || new Date().toISOString().split('T')[0];

    const space = await this.prisma.space.findUnique({
      where: { id: idSpace },
    });

    if (!space) {
      throw new NotFoundException('Space dengan ID tersebut tidak ditemukan!');
    }

    const [startHour, startMin] = jamMulai.split(':').map(Number);
    const endHour = startHour + durasi;
    const jamSelesai = `${String(endHour).padStart(2, '0')}:${String(startMin || 0).padStart(2, '0')}`;

    const tanggalFilter = new Date(tanggal);

    // KUNCI UTAMA: Hanya cek reservasi yang masih aktif/pending (abaikan 'selesai' & 'dibatalkan')
    const existingReservations = await this.prisma.reservasi.findMany({
      where: {
        status: { in: ['belum_dikonfirm', 'disetujui', 'aktif'] },
        tanggal_reservasi: tanggalFilter,
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
      throw new BadRequestException('Maaf, space sudah terisi atau dibooking pada jam tersebut!');
    }

    const estimasiTotal = space.harga_per_jam * durasi;

    return {
      status: true,
      statusCode: 200,
      message: 'Space tersedia untuk dipesan pada jadwal yang diminta',
      data: {
        available: true,
        id_space: space.id,
        nama_space: space.nama_space,
        tanggal: tanggal,
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai,
        durasi_jam: durasi,
        harga_per_jam: space.harga_per_jam,
        estimasi_total: estimasiTotal,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async findAll(tipe?: string, search?: string) {
    const where: any = {};
    if (tipe) {
      where.tipe = tipe;
    }
    if (search) {
      where.OR = [
        { nama_space: { contains: search } },
        { deskripsi: { contains: search } },
        { fasilitas: { contains: search } },
      ];
    }

    const spaces = await this.prisma.space.findMany({
      where,
      include: { space_owner: true },
      orderBy: { id: 'asc' },
    });

    const formattedData = spaces.map((s) => ({
      id: s.id,
      nama_space: s.nama_space,
      harga_per_jam: s.harga_per_jam,
      tipe: s.tipe,
      kapasitas: s.kapasitas,
      foto: s.foto,
      deskripsi: s.deskripsi,
      id_owner: s.id_owner,
      owner: s.space_owner
        ? {
            nama_coworking: s.space_owner.nama_coworking,
            nama_pemilik: s.space_owner.nama_pemilik,
            telp: s.space_owner.telp,
          }
        : null,
      foto_url: s.foto ? `http://localhost:3000/uploads/spaces/${s.foto}` : null,
    }));

    return {
      status: true,
      statusCode: 200,
      message: 'Berhasil memproses permintaan',
      data: formattedData,
      timestamp: new Date().toISOString(),
    };
  }

  async findOne(id: number) {
    const space = await this.prisma.space.findUnique({
      where: { id: Number(id) },
      include: { space_owner: true },
    });

    if (!space) {
      throw new NotFoundException('Space dengan ID tersebut tidak ditemukan!');
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
        foto: space.foto,
        deskripsi: space.deskripsi,
        id_owner: space.id_owner,
        owner: space.space_owner
          ? {
              id: space.space_owner.id,
              nama_coworking: space.space_owner.nama_coworking,
              nama_pemilik: space.space_owner.nama_pemilik,
              telp: space.space_owner.telp,
            }
          : null,
        foto_url: space.foto ? `http://localhost:3000/uploads/spaces/${space.foto}` : null,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async create(dto: any) {
    return await this.prisma.space.create({
      data: {
        nama_space: dto.nama_space,
        kapasitas: Number(dto.kapasitas || 1),
        harga_per_jam: Number(dto.harga_per_jam || dto.harga || 0),
        tipe: dto.tipe || 'desk',
        deskripsi: dto.deskripsi || null,
        fasilitas: dto.fasilitas || null,
        foto: dto.foto || null,
        id_owner: dto.id_owner ? Number(dto.id_owner) : null,
      },
    });
  }

  async update(id: number, dto: any) {
    await this.findOne(id);
    return await this.prisma.space.update({
      where: { id: Number(id) },
      data: {
        nama_space: dto.nama_space,
        kapasitas: dto.kapasitas !== undefined ? Number(dto.kapasitas) : undefined,
        harga_per_jam: dto.harga_per_jam || dto.harga ? Number(dto.harga_per_jam || dto.harga) : undefined,
        tipe: dto.tipe,
        deskripsi: dto.deskripsi,
        fasilitas: dto.fasilitas,
        foto: dto.foto,
        id_owner: dto.id_owner ? Number(dto.id_owner) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.space.delete({ where: { id: Number(id) } });
  }
}