import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FAQ } from './entities/faq.entity';
import { FAQsController } from './faqs.controller';
import { FAQsService } from './faqs.service';

@Module({
  imports: [SequelizeModule.forFeature([FAQ])],
  controllers: [FAQsController],
  providers: [FAQsService]
})
export class FAQsModule { }