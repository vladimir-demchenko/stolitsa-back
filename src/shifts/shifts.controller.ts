import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ShiftsService } from './shifts.service';
import { Roles } from 'src/common';
import { RolesGuard } from 'src/auth/guards';
import { CreateShiftDto } from './dto/create-shift.dto';

@ApiTags('shifts')
@Controller('api/shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) { }

  @ApiBearerAuth('JWT-auth')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createShiftDto: CreateShiftDto) {
    return this.shiftsService.create(createShiftDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.shiftsService.findAll();
  }

  @ApiBearerAuth('JWT-auth')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shiftsService.findOne(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShift: CreateShiftDto) {
    return this.shiftsService.update({ id, createShiftDto: updateShift });
  }

  @ApiBearerAuth('JWT-auth')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shiftsService.remove(id);
  }
}