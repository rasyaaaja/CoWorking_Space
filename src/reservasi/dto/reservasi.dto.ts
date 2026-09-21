import { ApiProperty } from '@nestjs/swagger';

export class CheckPromoDto {
  @ApiProperty({ example: 'DISKONHEMAT20', description: 'Kode unik promo yang dimasukkan pengguna pada form checkout' })
  nama_diskon: string;
}

export class CreateReservasiDto {
  @ApiProperty({ example: 1, description: 'ID unik space/meja/ruangan yang akan dipesan' })
  id_space: number;

  @ApiProperty({ example: '2026-08-30', description: 'Tanggal rencana sewa space (format YYYY-MM-DD)' })
  tanggal_reservasi: string;

  @ApiProperty({ example: '09:00', description: 'Jam mulai sewa (format HH:mm 24-jam)' })
  jam_mulai: string;

  @ApiProperty({ example: 3, description: 'Durasi penggunaan dalam jam (minimal 1 jam)' })
  durasi_jam: number;

  @ApiProperty({ example: 1, required: false, description: 'ID promo diskon yang dipilih dari katalog (opsional)' })
  id_diskon?: number;

  @ApiProperty({ example: 'DISKONHEMAT20', required: false, description: 'Kode promo diskon alternatif jika diinput manual' })
  kode_promo?: string;
}

export class UpdateReservasiStatusDto {
  @ApiProperty({ example: 'disetujui', description: "Status baru: 'belum_dikonfirm', 'disetujui', 'aktif', 'selesai', 'dibatalkan'" })
  status: string;
}
