import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreativeTaskDto {
  @ApiProperty({
    example: 'fdd2465f-c1ba-4219-b077-a74b01793c42',
    description: 'id',
    required: true,
  })
  @IsString({ message: 'The id must be string type' })
  @IsUUID('4', { message: 'The id must be a valid UUID v4' })
  id: string;

  @ApiProperty({
    description: 'creative_task',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'creative_task must be string type' })
  creative_task?: string;

}
