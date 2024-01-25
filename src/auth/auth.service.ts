import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
import { User } from 'src/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import {
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  RegistrationDto,
} from './dto';
import * as dotenv from 'dotenv';
import { ForgotPasswordDto } from 'src/auth/dto/forgot-password.dto';
import { EmailService } from 'src/email/email.service';
import { RestorePasswordDto } from 'src/auth/dto/restore-password.dto';
import {
  CODE_OUTDATED,
  CODE_SENT,
  LOGIN_DATA_INCORRECT,
  LOGIN_EXISTS,
  PASSWORD_RESTORATION_SUBJECT,
  REFRESH_TOKEN_EXPIRED,
  REFRESH_TOKEN_WRONG,
  TOKEN_WRONG,
} from 'src/common/answers';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { ResetToken } from 'src/reset_token/entities/reset_token.entity';
import { Role } from 'src/roles/entities/role.entity';
dotenv.config();
const { REFRESH_TOKEN_LIFETIME, AUTH_SERVICE_URL } = process.env;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Role) private roleRepository: typeof Role,
    @InjectModel(ResetToken) private resetTokenRepository: typeof ResetToken,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) { }

  async validateUser(userDto: LoginDto): Promise<any> {
    const user = await this.usersService.getUserBylogin(userDto.login);
    if (!user) {
      throw new UnauthorizedException({
        message: LOGIN_DATA_INCORRECT,
      });
    } else {
      const passwordEquals = await bcrypt.compare(
        userDto.password,
        user.password,
      );
      if (passwordEquals) {
        return user;
      }
      throw new UnauthorizedException({
        message: LOGIN_DATA_INCORRECT,
      });
    }
  }

  async generateTokens(user: User): Promise<RefreshTokenResponseDto> {
    const accessPayload = {
      login: user.login,
      uid: user.id,
      roles: user.roles,
    };
    const refreshTokenPayload = {
      refuid: user.id,
    };
    console.log(REFRESH_TOKEN_LIFETIME);
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload),
      this.jwtService.signAsync(refreshTokenPayload, {
        expiresIn: REFRESH_TOKEN_LIFETIME,
      }),
    ]);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const tokens = await this.generateTokens(user);
    return {
      confirmed: user.confirmed,
      uid: user.id,
      roles: user.roles,
      services: user.services,
      tokens: tokens,
    };
  }

  async registration(registrationDto: RegistrationDto) {
    const loginExist = await this.usersService.isLoginExist(
      registrationDto.login,
    );
    if (loginExist) {
      throw new BadRequestException(LOGIN_EXISTS);
    }
    const newUser = await this.usersService.create(registrationDto);
    return {
      uid: newUser.id,
      roles: newUser.roles,
      tokens: await this.generateTokens(newUser),
    };
  }

  async getPublicKey() {
    return fsPromises.readFile(
      join(process.cwd(), 'keys', 'public.key'),
      'utf-8',
    );
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.getUserByloginWithoutPassword(
      forgotPasswordDto.email,
    );
    if (user) {
      const password_token = await this.resetTokenRepository.findOne({
        where: { userId: user.id },
      });
      const now = new Date();
      if (password_token != null) {
        const lastTryDate = new Date(password_token.updatedAt);
        const diffInMilliseconds = now.getTime() - lastTryDate.getTime();
        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
        if (diffInMinutes < 10) {
          return JSON.stringify({
            message: CODE_SENT,
          });
        }
      }
      const token = uuid();
      await this.resetTokenRepository.create({
        userId: user.id,
        to: user.login,
        token: token,
      });

      await this.emailService.sendEmail(
        user.login,
        `https://aib-broker.ru/reset_password/?token=${token}`,
        PASSWORD_RESTORATION_SUBJECT,
      );

      return JSON.stringify({
        message: CODE_SENT,
      });
    } else {
      throw new BadRequestException(
        `User with email "${forgotPasswordDto.email}" not found`,
      );
    }
  }

  async restorePassword(token: string, restorePasswordDto: RestorePasswordDto) {
    const password_token = await this.resetTokenRepository.findOne({
      where: { token: token },
    });
    console.log(token, password_token.token);
    if (password_token) {
      const user = await this.userRepository.findOne({
        where: { id: password_token.userId },
        include: [
          {
            model: this.roleRepository,
            attributes: ['name'],
            through: { attributes: [] },
          },
        ],
      });
      if (user) {
        const now = new Date();
        const lastTryDate = new Date(password_token.updatedAt);
        const diffInMilliseconds = now.getTime() - lastTryDate.getTime();
        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
        if (diffInMinutes > 20) {
          return JSON.stringify({
            message: CODE_OUTDATED,
          });
        }
        user.password = restorePasswordDto.password;
        await password_token.destroy();
        await user.save();
        const tokens = await this.generateTokens(user);
        return {
          uid: user.id,
          roles: user.roles,
          tokens: tokens,
        };
      } else {
        throw new BadRequestException('no user');
      }
    } else {
      throw new BadRequestException(TOKEN_WRONG);
    }
  }

  async refreshToken(
    refreshTokenRequestDto: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    try {
      const payload = await this.jwtService.verifyAsync(
        refreshTokenRequestDto.refreshToken,
      );
      if (!payload.refuid) throw new BadRequestException();
      const user = await this.usersService.findOne(payload.refuid);
      return this.generateTokens(user);
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException(REFRESH_TOKEN_EXPIRED);
      }
      throw new BadRequestException(REFRESH_TOKEN_WRONG);
    }
  }
}
