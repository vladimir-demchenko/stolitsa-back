import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class getEduUsersDto {
  @ApiPropertyOptional({ description: 'page', nullable: true })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number;
  @ApiPropertyOptional({ description: 'phone', nullable: true })
  @IsOptional()
  phone: string;
  @ApiPropertyOptional({ description: 'email', nullable: true })
  @IsOptional()
  email: string;
  @ApiPropertyOptional({ description: 'name', nullable: true })
  @IsOptional()
  name: string;
  @ApiPropertyOptional({ description: 'telegram', nullable: true })
  @IsOptional()
  telegram: string;
  @ApiPropertyOptional({ description: 'ids', nullable: true })
  @IsOptional()
  ids: string;
}
