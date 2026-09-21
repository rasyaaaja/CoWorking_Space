import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMemberAdminDto {
  @IsString() @IsNotEmpty() username: string;
  @IsString() @IsNotEmpty() password: string;
  @IsString() @IsNotEmpty() nama_member: string;
  @IsString() @IsNotEmpty() instansi: string;
  @IsString() @IsNotEmpty() alamat: string;
  @IsString() @IsNotEmpty() telp: string;
  @IsString() @IsOptional() foto?: string;
}

export class UpdateMemberAdminDto {
  @IsString() @IsOptional() nama_member?: string;
  @IsString() @IsOptional() instansi?: string;
  @IsString() @IsOptional() alamat?: string;
  @IsString() @IsOptional() telp?: string;
  @IsString() @IsOptional() password?: string;
  @IsString() @IsOptional() foto?: string;
}
