import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Shift } from './entities/shift.entity';
import { Sequelize, Transaction } from 'sequelize';
import { CreateShiftDto } from './dto/create-shift.dto';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectModel(Shift) private shiftRepository: typeof Shift,
    @InjectConnection()
    private readonly sequelize: Sequelize
  ) { }

  create(createShiftDto: CreateShiftDto) {
    return this.shiftRepository.create(createShiftDto);
  }

  findAll() {
    return this.shiftRepository.findAll({
      order: [['createdAt', 'ASC']]
    });
  }

  async findOne(id: string, transaction?: Transaction): Promise<Shift> {
    const shift = await this.shiftRepository.findByPk(id, { transaction });
    if (!shift) {
      throw new BadRequestException(`Shift with id "${id}" not found`);
    }

    return shift;
  }

  async update({ id, createShiftDto }: { id: string, createShiftDto: CreateShiftDto }) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const shift = await this.findOne(id, transaction);
      await shift.update(createShiftDto, { transaction });
      const updatedShift = await shift.reload({ transaction });

      await transaction.commit();

      return updatedShift;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async remove(id: string) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const shift = await this.findOne(id, transaction);
      await shift.destroy({ transaction });

      await transaction.commit();

      return { removed: id };
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }
}