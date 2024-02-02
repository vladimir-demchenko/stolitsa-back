import {
  HttpException,
  HttpStatus,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getEduUsersDto } from './dto/get-users.dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { UserRoles } from './entities';
import { Op, Sequelize, Transaction } from 'sequelize';
import sequelize from 'sequelize';
import {
  LOGIN_EXISTS,
  WRONG_TGCODE,
  USER_NOT_FOUND,
  TGCODE_NOT_FOUND,
  REGISTRATION_CONFIRMATION_SUBJECT,
} from 'src/common/answers';
import { generatePassword } from 'src/common';
import { EmailService } from 'src/email/email.service';
import { Shift } from 'src/shifts/entities/shift.entity';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { CreativeTaskDto } from './dto/creative-task.dto';
import { UserShiftDto } from './dto/user-shfit.dto';
import { UserApproveShift } from './dto/user-approve-shift.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly emailService: EmailService,
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Role) private roleRepository: typeof Role,
    @InjectModel(Shift) private shiftRepository: typeof Shift,
    @InjectModel(UserRoles) private userRolesRepository: typeof UserRoles,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const loginExist = await this.isLoginExist(
        createUserDto.login,
        transaction,
      );
      if (loginExist) {
        throw new BadRequestException(LOGIN_EXISTS);
      } else {

        const newUser = await this.userRepository.create(createUserDto, {
          transaction,
        });
        const roles = await this.roleRepository.findAll({
          where: {
            name: {
              [Op.or]: ['user', 'student'],
            },
          },
          transaction,
        });

        let res = null;

        res = await this.emailService.sendEmail(createUserDto.login, createUserDto.password, REGISTRATION_CONFIRMATION_SUBJECT, `<p>
        Привет!<br/>
        Поздравляем! Ты зарегистрировался на сайте <a href="http://столица-лето.рф">http://столица-лето.рф</a><br/>  
        Твой пароль для входа в личный кабинет: ${createUserDto.password}<br/>  
        <br/>  
        Доступ в личный кабинет откроется через 3 дня<br/>   
        <br/>
        Если у тебя возникнут вопросы, ты можешь их адресовать сюда <a href="https://t.me/STOlitsa_Leto" target="_blank">https://t.me/STOlitsa_Leto</a>
        </p>`);

        if (res !== true) {
          throw new BadRequestException();
        }

        await newUser.$add('roles', roles, { transaction });
        const user = await this.findOne(newUser.id, transaction);

        await transaction.commit();

        return user;
      }
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async getUsersByIds(ids: string): Promise<User[]> {
    let optionsObject = {};
    if (ids != null) {
      const ids_array = ids.split(',');
      optionsObject = {
        where: {
          id: {
            [Op.in]: ids_array,
          },
        },
      };
    }
    const users = await this.userRepository.findAll({
      include: [
        {
          model: this.roleRepository,
          attributes: ['name'],
          through: { attributes: [] },
        },
        {
          model: this.shiftRepository,
          attributes: ['id', 'date', 'title', 'descriptions', 'expire_time', 'open_reg']
        }
      ],
    });
    return users;
  }

  async findOne(id: string, transaction?: Transaction): Promise<User> {
    const user = await this.userRepository.findByPk(id, {
      include: [
        {
          model: this.roleRepository,
          attributes: ['name'],
          through: { attributes: [] },
        },
        {
          model: this.shiftRepository,
          attributes: ['id', 'date', 'title', 'descriptions', 'expire_time', 'open_reg']
        }
      ],
      transaction,
    });

    if (!user) {
      throw new BadRequestException(`User with id "${id}" not found`);
    }

    return user;
  }

  async checkOne(id: string): Promise<User> {
    const user = await this.userRepository.findByPk(id, {
      attributes: ['id'],
    });
    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findEduUserData(id: string): Promise<User> {
    const user = await this.userRepository.findByPk(id, {
      attributes: {
        exclude: ['confirmId', 'confirmed', 'resetTokenId', 'company'],
      },
    });

    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findEduUsersData(ids: string) {
    const ids_array = ids.split(',');
    const users = await this.userRepository.findAll({
      where: {
        id: {
          [Op.in]: ids_array,
        },
      },
      attributes: {
        exclude: ['confirmId', 'confirmed', 'resetTokenId', 'company'],
      },
    });

    return users;
  }

  async update(
    {
      id,
      roles: setRoles,
      shift: setShift,
      ...fieldsForUpdate
    }: UpdateUserDto,
    isAdmin: boolean,
  ) {
    const transaction: Transaction = await this.sequelize.transaction();

    try {
      const user = await this.findOne(id, transaction);

      await user.update(fieldsForUpdate, { transaction });

      if (isAdmin) {
        if (setRoles) {
          const roles = await this.roleRepository.findAll({
            where: { id: setRoles.map(({ id }) => id) },
          });
          await user.$set('roles', roles, { transaction });
        }
      }
      if (setShift) {
        const shift = await this.shiftRepository.findByPk(setShift.id, { transaction });
        await user.$set('shift', shift, { transaction });
      }
      const updatedUser = await user.reload({ transaction });
      await transaction.commit();

      return updatedUser;
    } catch (error) {
      await transaction.rollback();

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  async updateInfo({ id, ...fieldsForUpdate }: UpdateUserInfoDto) {
    const transaction: Transaction = await this.sequelize.transaction();

    try {
      const user = await this.findOne(id, transaction);

      await user.update(fieldsForUpdate, { transaction });
      const updatedUser = await user.reload({ transaction });
      await transaction.commit();

      return updatedUser;
    } catch (error) {
      await transaction.rollback();

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  async creativeTask({ id, ...link }: CreativeTaskDto) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const user = await this.findOne(id, transaction);
      user.creative_task = link.creative_task;
      await user.save();
      await transaction.commit();

      return JSON.stringify({
        message: 'Ссылка добавлена!',
      });
    } catch (error) {
      await transaction.rollback();

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  async userShift({ id, ...shift }: UserShiftDto) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const user = await this.findOne(id, transaction);

      if (user.approve_shift) {
        await transaction.rollback();
        return new BadRequestException('Нельзя изменить смену после подтверждения!')
      }

      user.shiftId = shift.shiftID;

      await user.save();
      await transaction.commit();

      return JSON.stringify({
        message: 'Смена добавлена!',
      });
    } catch (error) {
      await transaction.rollback();

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  async approveShift({ id, ...approve }: UserApproveShift) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const user = await this.findOne(id, transaction);
      user.approve_shift = approve.approve_shift;
      await user.save();

      let res = null;

      res = await this.emailService.sendEmail(user.login, user.login, 'Подтверждение заявки', `<p>
        Поздравляем! Ты заполнил свою анкету и стал потенциальным участником молодёжного палаточного патриотического слёта «STOлица.Лето»!<br/>
        <br/>
        Нам необходимо проверить твою заявку. Результаты отбора будут объявлены после окончания сбора заявок участников. Следи за обновлениями на почте. 
        Мы обязательно свяжемся с тобой! <br/>
        <br/>
        Если у тебя возникнут вопросы, ты можешь адресовать их сюда https://t.me/STOlitsa_Leto`);

      if (res !== true) {
        await transaction.rollback();
        throw new BadRequestException();
      }

      await transaction.commit();

      return JSON.stringify({
        message: 'Смена подтверждена!',
      });
    } catch (error) {
      await transaction.rollback();

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const user = await this.userRepository.findByPk(id, { transaction });
      await user.destroy({ transaction });

      await transaction.commit();

      return { removed: id };
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async getUsers(getUsersDto: getEduUsersDto) {
    const whereObject = [];

    if (getUsersDto.name) {
      whereObject.push(
        sequelize.where(
          Sequelize.fn(
            'concat',
            Sequelize.col('firstname'),
            Sequelize.col('surname'),
            Sequelize.col('lastname'),
          ),
          {
            [Op.iLike]: `%${getUsersDto.name}%`,
          },
        ),
      );
    }

    if (getUsersDto.phone) {
      whereObject.push(
        sequelize.where(Sequelize.col('phone'), {
          [Op.like]: `%${getUsersDto.phone}%`,
        }),
      );
    }

    if (getUsersDto.telegram) {
      whereObject.push(
        sequelize.where(Sequelize.col('tg_name'), {
          [Op.like]: `%${getUsersDto.telegram}%`,
        }),
      );
    }

    if (getUsersDto.email) {
      whereObject.push(
        sequelize.where(Sequelize.col('login'), {
          [Op.like]: `%${getUsersDto.email}%`,
        }),
      );
    }

    if (getUsersDto.ids) {
      const ids_array = getUsersDto.ids.split(',');
      whereObject.push(
        sequelize.where(Sequelize.col('id'), {
          [Op.in]: ids_array,
        }),
      );
    }

    const optionsObject: Omit<sequelize.FindAndCountOptions<User>, 'group'> = {
      order: [['updatedAt', 'DESC']],
      where: whereObject,
      attributes: {
        exclude: ['confirmId', 'confirmed', 'resetTokenId', 'company'],
      },
    };

    if (getUsersDto.page) {
      optionsObject['limit'] = 8;
      optionsObject['offset'] = (getUsersDto.page - 1) * 8;
    }

    const users = await this.userRepository.findAndCountAll(optionsObject);

    return users;
  }

  async getUserBylogin(login: string): Promise<User> {
    return await this.userRepository.scope('withPassword').findOne({
      where: { login },
      include: [
        {
          model: this.roleRepository,
          attributes: ['name'],
          through: { attributes: [] },
        },
      ],
    });
  }

  async isLoginExist(
    login: string,
    transaction?: Transaction,
  ): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { login: login },
      transaction,
    });

    return Boolean(count);
  }

  async getUserByloginWithoutPassword(login: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { login },
    });
  }
}
