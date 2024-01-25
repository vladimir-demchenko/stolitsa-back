import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from 'src/roles/entities/role.entity';
import { UserRoles } from './user-roles.entity';
import { ApiProperty } from '@nestjs/swagger';
import { generatePassword, hashPassword } from 'src/common';


@Table({
  tableName: 'users',
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
    },
  },
  scopes: {
    withPassword: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      },
    },
  },
})
export class User extends Model<User, CreateUserDto> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  login: string;

  @ApiProperty({
    description: 'password',
    nullable: false,
    example: 'password',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    set(value: string) {
      this.setDataValue('password', hashPassword(value));
    },
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastname: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firstname: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  secondname: string;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  birthday: Date;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];
}