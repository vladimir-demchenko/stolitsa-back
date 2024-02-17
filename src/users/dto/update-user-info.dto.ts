import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserInfoDto {
  @ApiProperty({
    example: 'fdd2465f-c1ba-4219-b077-a74b01793c42',
    description: 'id',
    required: true,
  })
  @IsString({ message: 'The id must be string type' })
  @IsUUID('4', { message: 'The id must be a valid UUID v4' })
  id: string;

  @ApiProperty({
    description: 'phone',
    type: 'string',
    required: false,
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'avatar_key',
    type: 'string',
    required: false,
  })
  @IsOptional()
  avatar_key?: string;

  @ApiProperty({
    description: 'citizenship',
    type: 'string',
    required: false,
  })
  @IsOptional()
  citizenship?: string;

  @ApiProperty({
    description: 'passport_number',
    type: 'string',
    required: false,
  })
  @IsOptional()
  passport_number?: string;

  @ApiProperty({
    description: 'passport_series',
    type: 'string',
    required: false,
  })
  @IsOptional()
  passport_series?: string;

  @ApiProperty({
    description: 'sex',
    type: 'string',
    required: false,
  })
  @IsOptional()
  sex?: string;

  @ApiProperty({
    description: 'place_of_birth',
    type: 'string',
    required: false,
  })
  @IsOptional()
  place_of_birth?: string;

  @ApiProperty({
    description: 'place_of_work',
    type: 'string',
    required: false,
  })
  @IsOptional()
  place_of_work?: string;

  @ApiProperty({
    description: 'actual_living',
    type: 'string',
    required: false,
  })
  @IsOptional()
  actual_living?: string;

  @ApiProperty({
    description: 'registration_living',
    type: 'string',
    required: false,
  })
  @IsOptional()
  registration_living?: string;

  @ApiProperty({
    description: 'position',
    type: 'string',
    required: false,
  })
  @IsOptional()
  position?: string;

  @ApiProperty({
    description: 'tg_name',
    type: 'string',
    required: false,
  })
  @IsOptional()
  tg_name?: string;

  @ApiProperty({
    description: 'vk_link',
    type: 'string',
    required: false,
  })
  @IsOptional()
  vk_link?: string;

  @ApiProperty({
    description: 'illness',
    type: 'string',
    required: false,
  })
  @IsOptional()
  illness?: string;

  @ApiProperty({
    description: 'find_out',
    type: 'string',
    required: false,
  })
  @IsOptional()
  find_out?: string;

  @ApiProperty({
    description: 'future_skills',
    type: 'string',
    required: false,
  })
  @IsOptional()
  future_skills?: string;

  @ApiProperty({
    description: 'about_yourself',
    type: 'string',
    required: false,
  })
  @IsOptional()
  about_yourself?: string;

  @ApiProperty({
    description: 'take_part',
    type: 'string',
    required: false,
  })
  @IsOptional()
  take_part?: string;
}