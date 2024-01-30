import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { extension, contentType, lookup } from 'mime-types';
import { v4 as uuid } from 'uuid';
import { Upload } from '@aws-sdk/lib-storage';
import { NoSuchKey, S3 } from '@aws-sdk/client-s3';
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import * as sharp from 'sharp';
import { Readable } from 'stream';
import { InjectModel } from '@nestjs/sequelize';

import { File } from './entities/file.entity';

const { CACHE_FILES_ENABEL } = process.env;

@Injectable()
export class FilesService {
  backetName = process.env.S3_BUCKET_NAME;
  constructor(
    @Inject('S3_BUCKET') private readonly s3: S3,
    @InjectModel(File) private readonly fileRepositiry: typeof File,
  ) { }

  async uploadFile(req: FastifyRequest, currentUserId: string): Promise<any> {
    console.log(req);
    if (req.isMultipart) {
      const parts = req.parts();
      for await (const part of parts) {
        if (part.type === 'file') {
          try {
            const fileExtension = extension(part.mimetype);
            const id = uuid();
            const newFileName = `${id}.${fileExtension}`;
            const steam = new Upload({
              client: this.s3,
              params: {
                Bucket: this.backetName,
                Key: newFileName,
                Body: part.file,
              },
            });
            const result: CompleteMultipartUploadCommandOutput =
              await steam.done();
            await this.fileRepositiry.create({ id, ownerId: currentUserId });
            return { key: result.Key, name: part.filename };
          } catch (error) {
            throw new BadGatewayException();
          }
        } else {
          return new NotImplementedException();
        }
      }
    } else {
      return new BadRequestException();
    }
  }

  async getFileByKey(
    isAdmin: boolean,
    currentUserId: string,
    key: string,
    reply: FastifyReply,
    size: string,
  ): Promise<any> {
    const fileId = this.getIdFromKey(key);
    const file = await this.fileRepositiry.findByPk(fileId);
    // if (file && file.ownerId !== currentUserId && !isAdmin) {
    //   throw new ForbiddenException();
    // }
    try {
      const { Body: stream } = await this.s3.getObject({
        Bucket: this.backetName,
        Key: key,
      });
      const mimetype = lookup(key) as string;
      const isImage = Boolean(mimetype.match(/^image\/(.*)/));
      const headers = {
        'Content-Type': contentType(mimetype),
      };
      if (CACHE_FILES_ENABEL === 'true') {
        headers['Cache-Control'] = 'public, max-age=86400, immutable';
      }
      reply.headers(headers);
      if (size && isImage) {
        const fileExtension = extension(mimetype) as string;
        const convert = Readable.from(
          stream.transformToWebStream() as any,
        ).pipe(sharp().resize(parseInt(size))[fileExtension]());

        return reply.send(convert);
      }
      return reply.send(stream);
    } catch (error) {
      if (error instanceof NoSuchKey) throw new NotFoundException();
      throw new BadGatewayException();
    }
  }

  async deleteFilebyKey(
    key: string,
    isAdmin: boolean,
    currentUserId: string,
  ): Promise<any> {
    const fileId = this.getIdFromKey(key);
    const file = await this.fileRepositiry.findByPk(fileId);
    if (!isAdmin || (file && file.ownerId !== currentUserId)) {
      throw new ForbiddenException();
    }
    try {
      if (file) await file.destroy();
      const deleted = await this.s3.deleteObject({
        Key: key,
        Bucket: this.backetName,
      });

      if (deleted) {
        return { destroyed: key };
      }
    } catch (error) {
      throw new BadGatewayException();
    }
  }

  async getAllFiles(isAdmin: boolean): Promise<Array<string>> {
    if (!isAdmin) throw new ForbiddenException();
    try {
      const { Contents: list } = await this.s3.listObjects({
        Bucket: this.backetName,
      });

      return list.map((i) => i.Key);
    } catch (error) {
      throw new BadGatewayException();
    }
  }

  getIdFromKey(key: string): string {
    return key.substring(0, key.lastIndexOf('.'));
  }
}
