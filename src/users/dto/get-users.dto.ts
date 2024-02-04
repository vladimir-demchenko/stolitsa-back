import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class getUsersDto {
  @ApiPropertyOptional({ description: 'email', nullable: true })
  @IsOptional()
  email: string;
  @ApiPropertyOptional({ description: 'name', nullable: true })
  @IsOptional()
  name: string;
  @ApiPropertyOptional({ description: 'approve_shift', nullable: true })
  @IsOptional()
  approve_shift: string;
  @ApiPropertyOptional({ description: 'shiftId', nullable: true })
  @IsOptional()
  shiftId: string;
}
