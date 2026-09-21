import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class RegisterMemberDto {
  @ApiProperty({ example: 'johndoe', description: 'Username unik untuk login member' })
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Secret123!', description: 'Kata sandi akun member minimal 6 karakter' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(6, { message: 'Password minimal harus 6 karakter' })
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Nama lengkap pelanggan / member coworking' })
  @IsNotEmpty({ message: 'Nama member tidak boleh kosong' })
  @IsString()
  nama_member: string;

  @ApiProperty({ example: 'johndoe@gmail.com', required: false, description: 'Email wajib berdomain @gmail.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Format email tidak valid' })
  @Matches(/@gmail\.com$/, {
    message: 'Email registrasi wajib menggunakan domain @gmail.com'
  })
  email?: string;

  @ApiProperty({ example: 'Universitas Indonesia / PT Maju Mundur', required: false, description: 'Nama asal instansi, kampus, atau perusahaan' })
  @IsOptional()
  @IsString()
  instansi?: string;

  @ApiProperty({ example: 'Jl. Sudirman No. 123, Jakarta Selatan', description: 'Alamat domisili lengkap pelanggan' })
  @IsNotEmpty({ message: 'Alamat tidak boleh kosong' })
  @IsString()
  alamat: string;

  @ApiProperty({ example: '081234567890', description: 'Nomor telepon aktif / WhatsApp member' })
  @IsNotEmpty({ message: 'Nomor telepon tidak boleh kosong' })
  @IsString()
  telp: string;

  @ApiProperty({ example: 'member_john.jpg', required: false, description: 'Nama file foto profil member (opsional)' })
  @IsOptional()
  @IsString()
  @Matches(/\.(jpg|jpeg|png|webp)$/i, {
    message: 'Format foto harus berupa file gambar valid (.jpg, .jpeg, .png, atau .webp)',
  })
  foto?: string;
}

export class RegisterAdminSpaceDto {
  @ApiProperty({ example: 'admin_space1', description: 'Username unik untuk login admin lokasi' })
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Admin123!', description: 'Kata sandi akun admin minimal 6 karakter' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(6, { message: 'Password minimal harus 6 karakter' })
  password: string;

  @ApiProperty({ example: 'Moklet Hub Coworking', description: 'Nama lokasi / branding tempat coworking space' })
  @IsNotEmpty({ message: 'Nama coworking tidak boleh kosong' })
  @IsString()
  nama_coworking: string;

  @ApiProperty({ example: 'Ahmad Bidin', description: 'Nama lengkap pemilik / penanggung jawab operasional' })
  @IsNotEmpty({ message: 'Nama pemilik tidak boleh kosong' })
  @IsString()
  nama_pemilik: string;

  @ApiProperty({ example: '081298765432', description: 'Nomor kontak / call center pengelola lokasi' })
  @IsNotEmpty({ message: 'Nomor telepon tidak boleh kosong' })
  @IsString()
  telp: string;

  @ApiProperty({ example: 'admin_space.jpg', required: false, description: 'Nama file foto profil/lokasi hasil upload (opsional)' })
  @IsOptional()
  @IsString()
  @Matches(/\.(jpg|jpeg|png|webp)$/i, {
    message: 'Format foto harus berupa file gambar valid (.jpg, .jpeg, .png, atau .webp)',
  })
  foto?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'johndoe', description: 'Username pengguna terdaftar' })
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Secret123!', description: 'Kata sandi akun pengguna' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @IsString()
  password: string;
}