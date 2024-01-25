import { Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { Dialect } from 'sequelize';
import * as dotenv from 'dotenv';
import { EmailModule } from 'src/email/email.module';
import { ResetTokenModule } from 'src/reset_token/reset_token.module';

dotenv.config();

const { DB_DIALECT, DB_PORT, DB_PASS, DB_USER, DB_NAME } = process.env;
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: DB_DIALECT as Dialect,
      host: process.env.DB_HOST,
      port: +DB_PORT,
      username: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 200,
      repositoryMode: true,
      sync: {
        alter: { drop: false },
      },
      logQueryParameters: true,
      logging:
        process.env.SQL_LOG_ENABEL === 'true'
          ? (sql) => {
            Logger.log(sql, 'SQLLogger');
          }
          : false,
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    ResetTokenModule,
    EmailModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule { }
