import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Memulai proses seeding...');

  const userMember = await prisma.user.create({
    data: {
      username: 'member1',
      email: 'member1@gmail.com',
      password: 'password123', 
      role: 'member',
      member: {
        create: {
          nama_member: 'Budi Santoso',
          instansi: 'PT Maju Bersama',
          alamat: 'Jl. Pemuda No. 123, Surabaya',
          telp: '081234567890',
        },
      },
    },
  });

  const userOwner = await prisma.user.create({
    data: {
      username: 'owner1',
      email: 'owner1@gmail.com',
      password: 'password123',
      role: 'owner',
      space_owner: {
        create: {
          nama_coworking: 'SubCo Working Space',
          nama_pemilik: 'Siti Rahma',
          telp: '089876543210',
          alamat: 'Jl. Raya Darmo No. 45, Surabaya',
          deskripsi_fasilitas: 'WiFi Cepat, Kopi Gratis, Ruangan AC',
        },
      },
    },
    include: {
      space_owner: true,
    },
  });

  const ownerId = userOwner.space_owner!.id;
  const member = await prisma.member.findUnique({
    where: { id_user: userMember.id },
  });

  const space1 = await prisma.space.create({
    data: {
      nama_space: 'Hot Desk Area A',
      harga_per_jam: 25000,
      tipe: 'desk',
      kapasitas: 1,
      deskripsi: 'Meja kerja fleksibel dengan colokan listrik terpisah',
      fasilitas: 'WiFi, Power Outlet, Water Refill',
      id_owner: ownerId,
    },
  });

  const diskon1 = await prisma.diskon.create({
    data: {
      nama_diskon: 'PROMO_AWAL_TAHUN',
      persentase_diskon: 10.0,
      tanggal_awal: new Date('2026-01-01'),
      tanggal_akhir: new Date('2026-12-31'),
    },
  });

  const reservasi1 = await prisma.reservasi.create({
    data: {
      kode_booking: 'BOOK-20260101-001',
      tanggal_reservasi: new Date(),
      jam_mulai: '09:00',
      jam_selesai: '12:00',
      durasi_jam: 3,
      status: 'disetujui',
      id_owner: ownerId,
      id_member: member!.id,
      detail_reservasi: {
        create: {
          id_space: space1.id,
          id_diskon: diskon1.id,
          total_harga: 67500, 
        },
      },
    },
  });

  console.log('Seeding berhasil selesaikan!');
}

main()
  .catch((e) => {
    console.error('Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });