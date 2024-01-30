import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { FAQDto } from '../dto/faq.dto';

@Table({
  tableName: 'faqs',
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  }
})
export class FAQ extends Model<FAQ, FAQDto> {
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
  id: string;

  @ApiProperty({ description: 'question', nullable: false })
  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  question: string;

  @ApiProperty({ description: 'answer', nullable: false })
  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  answer: string;
}