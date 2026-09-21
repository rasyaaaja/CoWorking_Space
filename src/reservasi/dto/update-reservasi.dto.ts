import { PartialType } from '@nestjs/swagger';
import { CreateReservasiDto } from './create-reservasi.dto';

export class UpdateReservasiDto extends PartialType(CreateReservasiDto) {}
