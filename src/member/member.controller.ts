import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Member')
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @ApiOperation({ summary: 'Menambahkan data member baru (Manual via Admin)' })
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Menampilkan daftar seluruh member terdaftar' })
  findAll() {
    return this.memberService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Melihat profil detail satu member spesifik' })
  findOne(@Param('id') id: string) {
    return this.memberService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mengubah atau mengedit data profil member' })
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.memberService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus akun member dari sistem (Banned)' })
  remove(@Param('id') id: string) {
    return this.memberService.remove(+id);
  }
}
