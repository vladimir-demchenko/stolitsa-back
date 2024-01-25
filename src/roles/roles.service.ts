import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Role } from './entities/role.entity';
import { Sequelize, Transaction } from 'sequelize';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private roleRepository: typeof Role,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) { }

  create(createRoleDto: CreateRoleDto) {
    return this.roleRepository.create(createRoleDto);
  }

  findAll(serviceId?: string) {
    const where = serviceId ? { serviceId } : {};
    return this.roleRepository.findAll({ where });
  }

  async findOne(id: string, transaction?: Transaction): Promise<Role> {
    const role = await this.roleRepository.findByPk(id, { transaction });
    if (!role) {
      throw new BadRequestException(`Role with id "${id}" not found`);
    }

    return role;
  }

  async update({ id, ...updateRoleDto }: UpdateRoleDto) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const role = await this.findOne(id, transaction);
      await role.update(updateRoleDto, { transaction });
      const updatedRole = role.reload({ transaction });

      await transaction.commit();

      return updatedRole;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async remove(id: string) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const role = await this.findOne(id, transaction);
      await role.destroy({ transaction });

      await transaction.commit();

      return { removed: id };
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }
}
