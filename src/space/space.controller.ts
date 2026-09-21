import { Controller, Get, Param, Query } from '@nestjs/common';
import { SpaceService } from './space.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Space Coworking (Publik & User)')
@Controller('spaces')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Get('types')
  @ApiOperation({ summary: 'Publik/User: Daftar Tipe Space (Personal Desk, Meeting Room, Private Office)' })
  getTypes() {
    return this.spaceService.getTypes();
  }

  @Get('availability')
  @ApiOperation({ summary: 'Publik/User: Cek Ketersediaan Space Berdasarkan Tanggal & Jam' })
  @ApiQuery({ name: 'id_space', required: true, example: 1 })
  @ApiQuery({ name: 'tanggal', required: true, example: '2026-08-30' })
  @ApiQuery({ name: 'jam_mulai', required: true, example: '09:00' })
  @ApiQuery({ name: 'durasi_jam', required: true, example: 3 })
  checkAvailability(
    @Query('id_space') id_space?: string,
    @Query('tanggal') tanggal?: string,
    @Query('jam_mulai') jam_mulai?: string,
    @Query('durasi_jam') durasi_jam?: string,
  ) {
    return this.spaceService.checkAvailability({ id_space, tanggal, jam_mulai, durasi_jam });
  }

  @Get()
  @ApiOperation({ summary: 'Publik/User: Lihat Semua Space Coworking (Filter ?tipe & ?search)' })
  @ApiQuery({ name: 'tipe', required: false, description: 'desk, meeting_room, private_office' })
  @ApiQuery({ name: 'search', required: false, description: 'Pencarian nama/fasilitas/deskripsi' })
  findAll(@Query('tipe') tipe?: string, @Query('search') search?: string) {
    return this.spaceService.findAll(tipe, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Publik/User: Lihat Detail Space Coworking Berdasarkan ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id') id: string) {
    return this.spaceService.findOne(+id);
  }
}