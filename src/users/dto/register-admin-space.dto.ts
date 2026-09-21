import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, IsOptional, IsEmail } from 'class-validator';

export class RegisterAdminSpaceDto {
  @ApiProperty({ example: 'admin_space1', description: 'Username unik untuk login admin lokasi' })
  @IsNotEmpty({ message: 'Username wajib diisi!' })
  @IsString()
  username: string;

  @ApiPropertyOptional({ example: 'admin@mokletcoworking.com', description: 'Email resmi pengelola lokasi' })
  @IsOptional()
  @IsEmail({}, { message: 'Format email tidak valid!' })
  email?: string;

  @ApiProperty({ example: 'Admin123!', description: 'Kata sandi akun admin minimal 6 karakter' })
  @IsNotEmpty({ message: 'Password wajib diisi!' })
  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter!' })
  password: string;

  @ApiProperty({ example: 'Moklet Hub Coworking', description: 'Nama lokasi / branding tempat coworking space' })
  @IsNotEmpty({ message: 'Nama coworking wajib diisi!' })
  @IsString()
  nama_coworking: string;

  @ApiProperty({ example: 'Ahmad Bidin', description: 'Nama lengkap pemilik / penanggung jawab operasional' })
  @IsNotEmpty({ message: 'Nama pemilik wajib diisi!' })
  @IsString()
  nama_pemilik: string;

  @ApiProperty({ example: '081298765432', description: 'Nomor kontak / call center pengelola lokasi' })
  @IsNotEmpty({ message: 'Nomor telepon wajib diisi!' })
  @IsString()
  telp: string;
}
