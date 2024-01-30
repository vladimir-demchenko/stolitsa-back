import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBlockDto {
  @ApiProperty({ description: 'month' })
  @IsString({ message: 'must be a string type' })
  month: string;

  @ApiProperty({ description: 'color' })
  @IsString({ message: 'must be a string type' })
  color: string;
}