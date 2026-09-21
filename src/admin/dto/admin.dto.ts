import { ApiProperty } from '@nestjs/swagger';

export class UpdateCoworkingProfileDto {
  @ApiProperty({ example: 'Moklet Hub Coworking Space', description: 'Nama lokasi / brand coworking space' })
  nama_coworking: string;

  @ApiProperty({ example: 'Ahmad Bidin, S.Kom', description: 'Nama pemilik / penanggung jawab lokasi' })
  nama_pemilik: string;

  @ApiProperty({ example: '081298765432', description: 'Nomor telepon kontak resmi pengelola' })
  telp: string;
}

export class CreateMemberAdminDto {
  @ApiProperty({ example: 'user_budi', description: 'Username unik login akun member' })
  username: string;

  @ApiProperty({ example: 'Secret123!', description: 'Password awal untuk akun member' })
  password: string;

  @ApiProperty({ example: 'Budi Raharjo', description: 'Nama lengkap member baru' })
  nama_member: string;

  @ApiProperty({ example: 'SMK Telkom Malang', description: 'Nama instansi / asal organisasi member' })
  instansi: string;

  @ApiProperty({ example: 'Jl. Danau Ranau No. 1, Malang', description: 'Alamat lengkap tempat tinggal member' })
  alamat: string;

  @ApiProperty({ example: '085712345678', description: 'Nomor telepon aktif member' })
  telp: string;

  @ApiProperty({ example: 'budi_raharjo.jpg', required: false, description: 'Nama file foto profil member (opsional)' })
  foto?: string;
}

export class UpdateMemberAdminDto {
  @ApiProperty({ example: 'Budi Raharjo, S.T.', required: false, description: 'Nama lengkap member yang diperbarui' })
  nama_member?: string;

  @ApiProperty({ example: 'PT Teknologi Hebat', required: false, description: 'Nama instansi / organisasi baru' })
  instansi?: string;

  @ApiProperty({ example: 'Jl. Danau Ranau No. 2, Malang', required: false, description: 'Alamat domisili baru' })
  alamat?: string;

  @ApiProperty({ example: '085712345678', required: false, description: 'Nomor kontak baru' })
  telp?: string;

  @ApiProperty({ example: 'NewSecret123!', required: false, description: 'Password baru jika ingin mereset kata sandi' })
  password?: string;

  @ApiProperty({ example: 'budi_new.jpg', required: false, description: 'File foto baru jika diganti' })
  foto?: string;
}

export class CreateDiskonDto {
  @ApiProperty({ example: 'PROMOAGUSTUS', description: 'Kode promo unik (huruf kapital/angka tanpa spasi)' })
  nama_diskon: string;

  @ApiProperty({ example: 20, description: 'Besaran potongan harga dalam persen (1 - 100)' })
  persentase_diskon: number;

  @ApiProperty({ example: '2026-08-01T00:00:00Z', description: 'Waktu awal berlakunya promo (ISO 8601)' })
  tanggal_awal: string;

  @ApiProperty({ example: '2026-08-31T23:59:59Z', description: 'Waktu batas akhir berakhirnya promo (ISO 8601)' })
  tanggal_akhir: string;
}

export class UpdateDiskonDto {
  @ApiProperty({ example: 'PROMOAGUSTUS2026', required: false, description: 'Kode promo diskon yang diperbarui' })
  nama_diskon?: string;

  @ApiProperty({ example: 25, required: false, description: 'Persentase potongan harga baru' })
  persentase_diskon?: number;

  @ApiProperty({ example: '2026-08-01T00:00:00Z', required: false, description: 'Waktu awal berlaku baru' })
  tanggal_awal?: string;

  @ApiProperty({ example: '2026-09-15T23:59:59Z', required: false, description: 'Waktu akhir berlaku baru' })
  tanggal_akhir?: string;
}
