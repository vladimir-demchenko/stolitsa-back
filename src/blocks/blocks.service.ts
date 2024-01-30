import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Block } from './entities/block.entity';
import { Sequelize, Transaction } from 'sequelize';
import { CreateBlockDto } from './dto/create-block.dto';
import { Shift } from 'src/shifts/entities/shift.entity';

@Injectable()
export class BlocksService {
  constructor(
    @InjectModel(Block) private blockRepository: typeof Block,
    @InjectModel(Shift) private shiftRepository: typeof Shift,
    @InjectConnection()
    private readonly sequelize: Sequelize
  ) { }

  create(CreateBlockDto: CreateBlockDto) {
    return this.blockRepository.create(CreateBlockDto);
  }

  findAll() {
    return this.blockRepository.findAll({
      include: [
        {
          model: this.shiftRepository,
          attributes: ['id', 'date', 'title', 'descriptions', 'expire_time', 'open_reg']
        }
      ]
    });
  }

  async findOne(id: string, transaction?: Transaction): Promise<Block> {
    const block = await this.blockRepository.findByPk(id, {
      include: [
        {
          model: this.shiftRepository,
          attributes: ['id', 'date', 'title', 'descriptions', 'expire_time', 'open_reg']
        }
      ], transaction
    });
    if (!block) {
      throw new BadRequestException(`Block with id "${id}" not found`);
    }

    return block;
  }

  async update({ id, createBlockDto }: { id: string, createBlockDto: CreateBlockDto }) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const block = await this.findOne(id, transaction);
      await block.update(createBlockDto, { transaction });
      const updatedBlock = await block.reload({ transaction });

      await transaction.commit();

      return updatedBlock;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async remove(id: string) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const block = await this.findOne(id, transaction);
      await block.destroy({ transaction });

      await transaction.commit();

      return { removed: id };
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }
}