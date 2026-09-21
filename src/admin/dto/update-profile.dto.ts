import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Moklet Hub Coworking Space (Updated)', required: false })
  @IsOptional()
  @IsString()
  nama_coworking?: string;

  @ApiProperty({ example: 'Ahmad Bidin, S.Kom', required: false })
  @IsOptional()
  @IsString()
  nama_pemilik?: string;

  @ApiProperty({ example: '081298765432', required: false })
  @IsOptional()
  @IsString()
  telp?: string;

  @ApiProperty({ example: 'Jl. Danau Ranau, Sawojajar, Kota Malang', required: false })
  @IsOptional()
  @IsString()
  alamat?: string;

  @ApiProperty({ example: 'WiFi 100Mbps, AC, Free Coffee', required: false })
  @IsOptional()
  @IsString()
  deskripsi_fasilitas?: string;
}