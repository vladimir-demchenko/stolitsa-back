import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRoles, User } from './entities';
import { Role } from 'src/roles/entities/role.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([
      User,
      UserRoles,
      Role,
    ]),
  ],
  exports: [UsersService],
})
export class UsersModule { }
