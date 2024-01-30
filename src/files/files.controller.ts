import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiConsumes,
  ApiOperation,
  ApiOkResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FilesService } from './files.service';

import { FastifyRequest, FastifyReply } from 'fastify';
import { CurrentUserId, IsAdmin } from 'src/common';
import { JwtAuthGuard } from 'src/auth/guards';

@ApiTags('Files')
@Controller('api/files')
export class FilesController {
  constructor(private readonly fileService: FilesService) { }

  @ApiOperation({ summary: 'Upload files' })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
        },
      },
      example: {
        key: '67004e60-85f6-4324-9eb5-2b8f56197cc5.png',
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async uploadFile(
    @Req() req: FastifyRequest,
    @CurrentUserId() currentUserId: string,
  ): Promise<any> {
    return await this.fileService.uploadFile(req, currentUserId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all keys from bucket' })
  @ApiOkResponse({ type: Array<string> })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@IsAdmin() isAdmin: boolean) {
    return await this.fileService.getAllFiles(isAdmin);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get file by key' })
  @ApiOkResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiQuery({
    name: 'size',
    description: 'Query params for resizing images',
    example: '200',
    required: false,
  })
  @ApiParam({
    name: 'key',
    example: '67004e60-85f6-4324-9eb5-2b8f56197cc5.png',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':key')
  async getFileByKey(
    @Param('key') key: string,
    @Query('size') size: string,
    @Res() reply: FastifyReply,
    @IsAdmin() isAdmin: boolean,
    @CurrentUserId() currentUserId: string,
  ) {
    return await this.fileService.getFileByKey(
      isAdmin,
      currentUserId,
      key,
      reply,
      size,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete file by key' })
  @ApiParam({
    name: 'key',
    example: '67004e60-85f6-4324-9eb5-2b8f56197cc5.png',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':key')
  async deleteFilebyKey(
    @Param('key') key: string,
    @IsAdmin() isAdmin: boolean,
    @CurrentUserId() currentUserId: string,
  ) {
    return await this.fileService.deleteFilebyKey(key, isAdmin, currentUserId);
  }
}
