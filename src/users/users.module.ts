import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRoles, User } from './entities';
import { Role } from 'src/roles/entities/role.entity';
import { EmailModule } from 'src/email/email.module';
import { Shift } from 'src/shifts/entities/shift.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    EmailModule,
    SequelizeModule.forFeature([
      User,
      UserRoles,
      Role,
      Shift
    ]),
  ],
  exports: [UsersService],
})
export class UsersModule { }
