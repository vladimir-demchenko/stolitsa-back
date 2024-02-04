import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { CreateShiftDto } from '../dto/create-shift.dto';
import { User } from 'src/users/entities';
import { Block } from 'src/blocks/entities/block.entity';


@Table({
  tableName: 'shifts',
})
export class Shift extends Model<Shift, CreateShiftDto> {
  @ApiProperty({
    description: 'id',
    nullable: false,
    example: 'fdd2465f-c1ba-4219-b077-a74b01793c42'
  })
  @IsString({ message: 'The id must be string type' })
  @IsUUID('4', { message: 'The id must be a valid UUID v4' })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false
  })
  @ForeignKey(() => User)
  id: string;

  @ApiProperty({ description: 'date', nullable: true })
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  date: string;

  @ApiProperty({ description: 'title', nullable: true })
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  title: string;

  @ApiProperty({ description: 'descriptions', nullable: true })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true
  })
  descriptions: [string];

  @ApiProperty({ description: 'expire_time', nullable: true })
  @Column({
    type: DataType.DATEONLY,
    allowNull: true
  })
  expire_time: Date;

  @ApiProperty({ description: 'open_reg', nullable: true })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: true
  })
  open_reg: boolean;

  @ForeignKey(() => Block)
  @ApiProperty({ description: 'blockId', nullable: true })
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  blockId: string;

  @BelongsTo(() => Block)
  block: Block;

  @HasMany(() => User)
  user: [User]
}