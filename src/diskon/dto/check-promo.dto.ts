import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CheckPromoDto {
  @ApiProperty({ example: 'DISKONHEMAT20', description: 'Kode unik promo yang dimasukkan pengguna pada form checkout' })
  @IsNotEmpty({ message: 'Nama/kode diskon wajib diisi!' })
  @IsString()
  nama_diskon: string;

  @ApiPropertyOptional({ example: 150000, description: 'Total harga sebelum diskon untuk menghitung potongan nominal' })
  @IsOptional()
  @IsNumber()
  total_harga?: number;
}
