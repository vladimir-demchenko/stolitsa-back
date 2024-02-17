import { Role } from 'src/roles/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional } from 'class-validator';
import { Shift } from 'src/shifts/entities/shift.entity';

export class UpdateUserDto {
  @ApiProperty({
    example: 'fdd2465f-c1ba-4219-b077-a74b01793c42',
    description: 'id',
    required: true,
  })
  @IsString({ message: 'The id must be string type' })
  @IsUUID('4', { message: 'The id must be a valid UUID v4' })
  id: string;

  @ApiProperty({
    example: 'password',
    description: 'password',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'password must be string type' })
  password?: string;

  @ApiProperty({
    required: false,
    type: () => [Role],
  })
  @IsOptional()
  roles?: [Role];

  @ApiProperty({
    required: false,
    type: () => Shift,
  })
  @IsOptional()
  shift?: Shift;

  @ApiProperty({
    description: 'firstname',
    type: 'string',
    required: false,
  })
  @IsOptional()
  firstname?: string;

  @ApiProperty({
    description: 'secondname',
    type: 'string',
    required: false,
  })
  @IsOptional()
  secondname?: string;

  @ApiProperty({
    description: 'lastname',
    type: 'string',
    required: false,
  })
  @IsOptional()
  lastname?: string;

  @ApiProperty({
    description: 'phone',
    type: 'string',
    required: false,
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'flag',
    type: 'boolean',
    required: false,
  })
  @IsOptional()
  flag?: boolean;
}
