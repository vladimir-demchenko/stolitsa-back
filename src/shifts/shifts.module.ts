import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/entities';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';
import { Shift } from './entities/shift.entity';
import { Block } from 'src/blocks/entities/block.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Shift, Block])],
  controllers: [ShiftsController],
  providers: [ShiftsService]
})
export class ShiftsModule { }