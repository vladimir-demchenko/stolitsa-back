import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RestorePasswordDto {
  @ApiProperty({
    description: 'password',
    required: true,
  })
  @IsString({ message: 'The password must be string type' })
  password: string;
}
