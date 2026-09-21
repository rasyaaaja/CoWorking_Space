import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import type { Request } from 'express';
import * as fs from 'fs';

const ensureFolderExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const createMulterOptions = (subfolder: string) => ({
  storage: diskStorage({
    destination: (req: any, file: any, cb: (error: Error | null, destination: string) => void) => {
      const uploadPath = `./public/uploads/${subfolder}`;
      ensureFolderExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: (error: Error | null, filename: string) => void) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname).toLowerCase();
      cb(null, `${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req: any, file: any, cb: (error: Error | null, acceptFile: boolean) => void) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(
        new BadRequestException(
          `Format file tidak valid! Hanya diperbolehkan format: ${allowedExtensions.join(', ')}`,
        ),
        false,
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
});

@ApiTags('Upload Berkas & Gambar')
@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(FileInterceptor('file', createMulterOptions('general')))
  @ApiOperation({ summary: 'Upload Berkas Gambar Umum' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('File gambar wajib diunggah!');
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/general/${file.filename}`;

    return {
      status: true,
      statusCode: 201,
      message: 'File berhasil diupload',
      data: {
        filename: file.filename,
        original_name: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: fileUrl,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Post('spaces')
  @UseInterceptors(FileInterceptor('file', createMulterOptions('spaces')))
  @ApiOperation({ summary: 'Upload Foto Ruangan / Space Coworking' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  uploadSpacePhoto(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('File foto space wajib diunggah!');
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/spaces/${file.filename}`;

    return {
      status: true,
      statusCode: 201,
      message: 'Foto space berhasil diupload',
      data: {
        filename: file.filename,
        url: fileUrl,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Post('members')
  @UseInterceptors(FileInterceptor('file', createMulterOptions('members')))
  @ApiOperation({ summary: 'Upload Foto Profil Member / Pelanggan' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  uploadMemberPhoto(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('File foto member wajib diunggah!');
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/members/${file.filename}`;

    return {
      status: true,
      statusCode: 201,
      message: 'Foto member berhasil diupload',
      data: {
        filename: file.filename,
        url: fileUrl,
      },
      timestamp: new Date().toISOString(),
    };
  }
}