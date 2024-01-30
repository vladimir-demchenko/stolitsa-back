import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { CreateBlockDto } from '../dto/create-block.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { Shift } from 'src/shifts/entities/shift.entity';

@Table({
  tableName: 'blocks',
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  }
})
export class Block extends Model<Block, CreateBlockDto> {
  @ApiProperty({
    description: 'id',
    nullable: false,
  })
  @IsString({ message: 'The id must be string type' })
  @IsUUID('4', { message: 'The id must be a valid UUID v4' })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false
  })
  id: string;

  @ApiProperty({ description: 'month', nullable: true })
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  month: string;

  @ApiProperty({ description: 'color', nullable: true })
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  color: string;

  @HasMany(() => Shift)
  shifts: [Shift]
}