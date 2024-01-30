import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateShiftDto {
  @ApiProperty({ description: 'date' })
  @IsString({ message: 'must be string type' })
  @IsOptional()
  date?: string;

  @ApiProperty({ description: 'title' })
  @IsString({ message: 'must be string type' })
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'descriptions' })
  @IsOptional()
  descriptions?: [string];

  @ApiProperty({ description: 'expire_time' })
  @IsDateString()
  @IsOptional()
  expire_time?: Date;

  @ApiProperty({ description: 'open_reg' })
  @IsOptional()
  open_reg?: boolean;

  @ApiProperty({ description: 'blockId' })
  @IsOptional()
  blockId?: string;
}