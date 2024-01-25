import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'email',
    required: true,
  })
  @IsString({ message: 'The email must be string type' })
  email: string;
}