import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FAQDto {
  @ApiProperty({ description: 'question' })
  @IsString({ message: 'must be a string type' })
  question: string;

  @ApiProperty({ description: 'answer' })
  @IsString({ message: 'must be a string type' })
  answer: string;
}