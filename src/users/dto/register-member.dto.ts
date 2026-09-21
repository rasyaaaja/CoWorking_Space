import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, IsOptional, IsEmail } from 'class-validator';

export class RegisterMemberDto {
  @ApiProperty({ example: 'johndoe', description: 'Username unik untuk login member' })
  @IsNotEmpty({ message: 'Username wajib diisi!' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'johndoe@gmail.com', description: 'Email aktif member (Validasi Email)' })
  @IsNotEmpty({ message: 'Email wajib diisi!' })
  @IsEmail({}, { message: 'Format email tidak valid!' })
  email: string;

  @ApiProperty({ example: 'Secret123!', description: 'Kata sandi akun member minimal 6 karakter' })
  @IsNotEmpty({ message: 'Password wajib diisi!' })
  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter!' })
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Nama lengkap pelanggan / member coworking' })
  @IsNotEmpty({ message: 'Nama member wajib diisi!' })
  @IsString()
  nama_member: string;

  @ApiProperty({ example: 'Universitas Indonesia / PT Maju', description: 'Nama asal instansi, kampus, atau perusahaan' })
  @IsNotEmpty({ message: 'Instansi wajib diisi!' })
  @IsString()
  instansi: string;

  @ApiProperty({ example: 'Jl. Sudirman No. 123, Jakarta', description: 'Alamat domisili lengkap pelanggan' })
  @IsNotEmpty({ message: 'Alamat wajib diisi!' })
  @IsString()
  alamat: string;

  @ApiProperty({ example: '081234567890', description: 'Nomor telepon aktif / WhatsApp member' })
  @IsNotEmpty({ message: 'Nomor telepon wajib diisi!' })
  @IsString()
  telp: string;

  @ApiPropertyOptional({ example: 'member_john.jpg', description: 'Nama file foto profil hasil upload (opsional)' })
  @IsOptional()
  @IsString()
  foto?: string;
}
