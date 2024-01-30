import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { FAQ } from './entities/faq.entity';
import { Sequelize, Transaction } from 'sequelize';
import { FAQDto } from './dto/faq.dto';

@Injectable()
export class FAQsService {
  constructor(
    @InjectModel(FAQ) private faqRepository: typeof FAQ,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) { }

  create(createFAQDto: FAQDto) {
    return this.faqRepository.create(createFAQDto);
  }

  findAll() {
    return this.faqRepository.findAll();
  }

  async findOne(id: string, transaction?: Transaction): Promise<FAQ> {
    const faq = await this.faqRepository.findByPk(id, { transaction });
    if (!faq) {
      throw new BadRequestException(`FAQ with id "${id}" not found`);
    }
    return faq;
  }

  async update({ id, updateFaqDto }: { id: string, updateFaqDto: FAQDto }) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const faq = await this.findOne(id, transaction);
      await faq.update(updateFaqDto, { transaction });
      const updatedFAQ = await faq.reload({ transaction });

      await transaction.commit();

      return updatedFAQ;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async remove(id: string) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const faq = await this.findOne(id, transaction);
      await faq.destroy(({ transaction }));

      await transaction.commit();

      return { removed: id };
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }
}