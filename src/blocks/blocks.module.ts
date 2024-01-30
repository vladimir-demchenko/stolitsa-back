import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/entities';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';
import { Shift } from 'src/shifts/entities/shift.entity';
import { Block } from './entities/block.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Shift, Block])],
  controllers: [BlocksController],
  providers: [BlocksService]
})
export class BlocksModule { }