import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'johndoe', description: 'Username atau email pengguna terdaftar' })
  @IsNotEmpty({ message: 'Username/email wajib diisi!' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Secret123!', description: 'Kata sandi akun pengguna' })
  @IsNotEmpty({ message: 'Password wajib diisi!' })
  @IsString()
  password: string;
}
