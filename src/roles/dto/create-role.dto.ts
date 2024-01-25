import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'user', description: 'role name' })
  @IsString({ message: 'must be string type' })
  name: string;
}
