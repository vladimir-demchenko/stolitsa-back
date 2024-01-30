import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FAQsService } from './faqs.service';
import { Roles } from 'src/common';
import { RolesGuard } from 'src/auth/guards';
import { FAQDto } from './dto/faq.dto';

@ApiTags('faqs')
@Controller('api/faqs')
export class FAQsController {
  constructor(private readonly faqsService: FAQsService) { }

  @ApiBearerAuth('JWT-auth')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createFAQDto: FAQDto) {
    return this.faqsService.create(createFAQDto);
  }

  @Get()
  findAll() {
    return this.faqsService.findAll();
  }

  @ApiBearerAuth('JWT-auth')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faqsService.findOne(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaqDto: FAQDto) {
    return this.faqsService.update({ id, updateFaqDto });
  }

  @ApiBearerAuth('JWT-auth')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqsService.remove(id);
  }
}