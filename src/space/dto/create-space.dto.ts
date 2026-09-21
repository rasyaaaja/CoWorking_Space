import { ApiProperty } from '@nestjs/swagger';

export class CreateSpaceDto {
  @ApiProperty({ example: 'Personal Desk Alpha 01', description: 'Nama spesifik space / ruangan / meja' })
  nama_space: string;

  @ApiProperty({ example: 25000, description: 'Tarif sewa per jam dalam satuan Rupiah (IDR)' })
  harga_per_jam: number;

  @ApiProperty({ example: 'desk', description: "Kategori tipe space: 'desk', 'meeting_room', 'private_office'" })
  tipe: string;

  @ApiProperty({ example: 1, description: 'Jumlah kapasitas maksimal orang' })
  kapasitas: number;

  @ApiProperty({ example: 'WiFi 100Mbps, stopkontak, coffee', description: 'Rincian spesifikasi fasilitas yang tersedia' })
  deskripsi: string;

  @ApiProperty({ example: 'desk_alpha_01.jpg', required: false, description: 'Nama file foto ruangan hasil upload' })
  foto?: string;
}
