import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CreateRoleDto } from '../dto/create-role.dto';
import { User, UserRoles } from 'src/users/entities';
import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'roles',
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  },
})
export class Role extends Model<Role, CreateRoleDto> {
  @ApiProperty({
    description: 'id',
    nullable: false,
    example: 'fdd2465f-c1ba-4219-b077-a74b01793c42',
  })
  @IsString({ message: 'The id must be string type' })
  @IsUUID('4', { message: 'The id must be a valid UUID v4' })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @ApiProperty({
    description: 'name',
    nullable: false,
    uniqueItems: true,
    example: 'user',
  })
  @IsString({ message: 'The name must be string type' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @BelongsToMany(() => User, () => UserRoles)
  users: User[];
}
