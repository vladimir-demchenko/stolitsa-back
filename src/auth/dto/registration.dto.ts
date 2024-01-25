import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class RegistrationDto {
  @ApiProperty({ example: 'user', description: 'login' })
  @IsString({ message: 'The login must be string type' })
  @MaxLength(255, { message: 'login more than 255 characters' })
  login: string;

  // @ApiProperty({ example: 'password', description: 'password' })
  // @IsString({ message: 'The password must be string type' })

  // FOR THE FUTURE
  // @MinLength(4, { message: 'The password less than 4 characters' })
  // @MaxLength(20, { message: 'The password more than 20 characters' })
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message:
  //     'The password must contain at least 1 upper case letter, 1 lower case letter, 1 number or special character',
  // })
  // password: string;

  @ApiProperty({
    example: 'fdd2465f-c1ba-4219-b077-a74b01793c42',
    description: 'id',
    required: true,
  })
  @ApiProperty({
    description: 'lastname',
    type: 'string',
    nullable: true,
  })
  lastname: string;

  @ApiProperty({
    description: 'firstname',
    type: 'string',
    nullable: true,
  })
  firstname: string;

  @ApiProperty({
    description: 'secondname',
    type: 'string',
    nullable: true,
  })
  secondname: string;

  @ApiProperty({
    description: 'birthday',
    type: 'date',
    nullable: true,
  })
  birthday: Date;
}