import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './entities/role.entity';
import { User, UserRoles } from 'src/users/entities';

@Module({
  imports: [SequelizeModule.forFeature([User, UserRoles, Role])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule { }
