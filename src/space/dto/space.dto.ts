import { IsNumber, IsString, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateSpaceDto {
  @IsString() @IsNotEmpty() nama_space: string;
  @IsNumber() @Min(0) harga_per_jam: number;
  @IsString() @IsNotEmpty() tipe: string;
  @IsNumber() @Min(0) kapasitas: number;
  @IsString() @IsNotEmpty() deskripsi: string;
  @IsString() @IsOptional() foto?: string;
}
