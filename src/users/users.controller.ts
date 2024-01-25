import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  ForbiddenException,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getEduUsersDto } from './dto/get-users.dto';
import { ApiBearerAuth, ApiQuery, ApiTags, ApiBody } from '@nestjs/swagger';
import { CurrentUserId, Roles, IsAdmin } from 'src/common';
import { RolesGuard, JwtAuthGuard } from 'src/auth/guards';
import { User } from './entities';
import { UserEduRoles } from 'src/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiBearerAuth('JWT-auth')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiQuery({ name: 'ids', required: false, type: String })
  async getUsersByIds(@Query('ids') ids?: string) {
    return await this.usersService.getUsersByIds(ids);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('/current')
  async findCurrent(@CurrentUserId() userId: string) {
    return await this.usersService.findOne(userId);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('/find/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Get('/check/:id')
  checkOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.checkOne(id);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('/findEduUser/:id')
  async findEduUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.findEduUserData(id);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('/findEduUsers')
  async findEduUsers(
    @UserEduRoles() userRoles: Array<string>,
    @Query('ids') ids: string,
  ) {
    if (!userRoles.includes('admin')) {
      throw new UnauthorizedException();
    }
    return await this.usersService.findEduUsersData(ids);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('/findEduUser')
  async getUsers(
    @UserEduRoles() userRoles: Array<string>,
    @Query() getUsersDto: getEduUsersDto,
  ): Promise<{
    rows: User[];
    count: number;
  }> {
    if (!userRoles.includes('admin')) {
      throw new UnauthorizedException();
    }
    return await this.usersService.getUsers(getUsersDto);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @Body() body: UpdateUserDto,
    @CurrentUserId() userId: string,
    @IsAdmin() isAdmin: boolean,
  ) {
    // if (userId !== body.id && !isAdmin) throw new ForbiddenException();

    return await this.usersService.update(body, true);
  }
}
