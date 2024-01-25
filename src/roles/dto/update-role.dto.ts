import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'role id',
    required: true,
    example: 'fdd2465f-c1ba-4219-b077-a74b01793c42',
  })
  @IsString({ message: 'The id must be string type' })
  @IsUUID('4', { message: 'The id must be a valid UUID v4' })
  id: string;

  @ApiProperty({ example: 'user', description: 'role name' })
  @IsOptional()
  @IsString({ message: 'must be string type' })
  name: string;
}
