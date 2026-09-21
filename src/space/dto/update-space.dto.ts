import { ApiProperty } from '@nestjs/swagger';

export class UpdateSpaceDto {
  @ApiProperty({ example: 'Personal Desk Alpha 01 (Updated)', required: false, description: 'Nama baru ruangan/meja' })
  nama_space?: string;

  @ApiProperty({ example: 30000, required: false, description: 'Tarif sewa baru per jam' })
  harga_per_jam?: number;

  @ApiProperty({ example: 'desk', required: false, description: "Tipe space ('desk', 'meeting_room', 'private_office')" })
  tipe?: string;

  @ApiProperty({ example: 2, required: false, description: 'Kapasitas jumlah orang baru' })
  kapasitas?: number;

  @ApiProperty({ example: 'Fasilitas upgrade monitor 27 inch 4K', required: false, description: 'Perubahan deskripsi fasilitas' })
  deskripsi?: string;

  @ApiProperty({ example: 'desk_alpha_new.jpg', required: false, description: 'File foto baru jika diubah' })
  foto?: string;
}
