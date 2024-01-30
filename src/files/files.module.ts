import { Module } from '@nestjs/common';

import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FilesProviders } from './files.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from './entities/file.entity';

@Module({
  imports: [SequelizeModule.forFeature([File])],
  controllers: [FilesController],
  providers: [FilesService, ...FilesProviders],
  exports: [FilesService],
})
export class FilesModule { }
