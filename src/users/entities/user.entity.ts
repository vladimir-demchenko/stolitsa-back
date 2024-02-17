import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasOne, Model, Table } from 'sequelize-typescript';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from 'src/roles/entities/role.entity';
import { UserRoles } from './user-roles.entity';
import { ApiProperty } from '@nestjs/swagger';
import { generatePassword, hashPassword } from 'src/common';
import { Shift } from 'src/shifts/entities/shift.entity';


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

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  place_of_birth: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  sex: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  citizenship: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  avatar_key: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  passport_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  passport_series: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  actual_living: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  registration_living: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  place_of_work: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  position: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  tg_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  vk_link: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  phone: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  illness: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  find_out: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  future_skills: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  about_yourself: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  take_part: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  creative_task: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false
  })
  approve_shift: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false
  })
  flag: boolean;

  @ForeignKey(() => Shift)
  @ApiProperty({ description: 'shfitId', nullable: true })
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  shiftId: string;

  @BelongsTo(() => Shift)
  shift: Shift;


  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];
}