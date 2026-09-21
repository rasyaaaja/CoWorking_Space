import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class CreateReservasiDto {
  @ApiProperty({ example: 1, description: 'ID unik space/meja/ruangan yang akan dipesan' })
  @IsNotEmpty({ message: 'id_space wajib diisi!' })
  @IsNumber()
  id_space: number;

  @ApiPropertyOptional({ example: 1, description: 'ID unik member pemesan' })
  @IsOptional()
  @IsNumber()
  id_member?: number;

  @ApiProperty({ example: '2026-08-30', description: 'Tanggal rencana sewa space (format YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'tanggal_reservasi wajib diisi!' })
  @IsString()
  tanggal_reservasi: string;

  @ApiProperty({ example: '09:00', description: 'Jam mulai sewa (format HH:mm 24-jam)' })
  @IsNotEmpty({ message: 'jam_mulai wajib diisi!' })
  @IsString()
  jam_mulai: string;

  @ApiPropertyOptional({ example: '12:00', description: 'Jam selesai sewa (format HH:mm 24-jam)' })
  @IsOptional()
  @IsString()
  jam_selesai?: string;

  @ApiProperty({ example: 3, description: 'Durasi penggunaan dalam jam (minimal 1 jam)' })
  @IsNotEmpty({ message: 'durasi_jam wajib diisi!' })
  @IsNumber()
  @Min(1, { message: 'Durasi sewa minimal 1 jam!' })
  durasi_jam: number;

  @ApiPropertyOptional({ example: 1, description: 'ID promo diskon yang dipilih dari katalog (opsional)' })
  @IsOptional()
  @IsNumber()
  id_diskon?: number;

  @ApiPropertyOptional({ example: 'DISKONHEMAT20', description: 'Kode promo diskon alternatif jika diinput manual' })
  @IsOptional()
  @IsString()
  kode_promo?: string;
}
