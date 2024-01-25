import { IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'The login must be string type' })
  @MaxLength(255, { message: 'The login more than 255 characters' })
  login: string;

  @IsString({ message: 'The password must be string type' })
  password: string;

  lastname: string;

  firstname: string;

  secondname: string;

  birthday: Date;
}