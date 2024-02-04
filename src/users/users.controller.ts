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
import { getUsersDto } from './dto/get-users.dto';
import { ApiBearerAuth, ApiQuery, ApiTags, ApiBody } from '@nestjs/swagger';
import { CurrentUserId, Roles, IsAdmin } from 'src/common';
import { RolesGuard, JwtAuthGuard } from 'src/auth/guards';
import { User } from './entities';
import { UserEduRoles } from 'src/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ParseUUIDPipe } from '@nestjs/common';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { CreativeTaskDto } from './dto/creative-task.dto';
import { UserShiftDto } from './dto/user-shfit.dto';
import { UserApproveShift } from './dto/user-approve-shift.dto';

@ApiTags('users')
@Controller('api/users')
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
  async getUsersByIds(@Query() getUsersDto: getUsersDto) {
    return await this.usersService.getUsersByIds(getUsersDto);
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

  // @Roles('admin')
  // @UseGuards(RolesGuard)
  // @ApiBearerAuth('JWT-auth')
  // @Get('/findEduUser')
  // async getUsers(
  //   @UserEduRoles() userRoles: Array<string>,
  //   @Query() getUsersDto: getEduUsersDto,
  // ): Promise<{
  //   rows: User[];
  //   count: number;
  // }> {
  //   if (!userRoles.includes('admin')) {
  //     throw new UnauthorizedException();
  //   }
  //   return await this.usersService.getUsers(getUsersDto);
  // }

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

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch('/info')
  async updateInfo(@Body() body: UpdateUserInfoDto) {
    return await this.usersService.updateInfo(body);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch('/creative_task')
  async creativeTask(@CurrentUserId() id: string, @Body() body: CreativeTaskDto) {
    return await this.usersService.creativeTask(body);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch('/shift')
  async userShift(@Body() body: UserShiftDto) {
    return await this.usersService.userShift(body);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch('/approve_shift')
  async approveShift(@Body() body: UserApproveShift) {
    return await this.usersService.approveShift(body);
  }
}
