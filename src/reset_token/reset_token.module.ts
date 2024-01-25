import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResetToken } from 'src/reset_token/entities/reset_token.entity';

@Module({
  imports: [SequelizeModule.forFeature([ResetToken])],
})
export class ResetTokenModule { }
