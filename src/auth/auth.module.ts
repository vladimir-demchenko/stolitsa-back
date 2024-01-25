import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
import { EmailModule } from 'src/email/email.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResetToken } from 'src/reset_token/entities/reset_token.entity';
import { User } from 'src/users/entities';
import { Role } from 'src/roles/entities/role.entity';

const { ACCESS_TOKEN_LIFETIME } = process.env;

@Module({
  imports: [
    UsersModule,
    EmailModule,
    SequelizeModule.forFeature([ResetToken, User, Role]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      async useFactory(): Promise<JwtModuleOptions> {
        const passphrase = await fsPromises.readFile(
          join(process.cwd(), 'keys', 'passphrase.txt'),
          'utf8',
        );
        const privateKey = await fsPromises.readFile(
          join(process.cwd(), 'keys', 'private.key'),
        );
        const publicKey = await fsPromises.readFile(
          join(process.cwd(), 'keys', 'public.key'),
        );
        return {
          privateKey: {
            key: privateKey,
            passphrase,
          },
          publicKey,
          signOptions: {
            expiresIn: ACCESS_TOKEN_LIFETIME,
            algorithm: 'RS256',
          },
          verifyOptions: {
            algorithms: ['RS256'],
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
