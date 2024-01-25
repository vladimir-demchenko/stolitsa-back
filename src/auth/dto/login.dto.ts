import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user', description: 'login' })
  @IsString({ message: 'The login must be string type' })
  @MaxLength(255, { message: 'login more than 20 characters' })
  login: string;

  @ApiProperty({ example: 'password', description: 'password' })
  @IsString({ message: 'The password must be string type' })
  password: string;
}