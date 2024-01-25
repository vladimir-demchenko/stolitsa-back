import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities';
@Table({
  tableName: 'reset_tokens',
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  },
})
export class ResetToken extends Model<ResetToken> {
  @ApiProperty({
    description: 'id',
    nullable: false,
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;
  @ApiProperty({
    description: 'userId',
    nullable: false,
    example: 'fdd2465f-c1ba-4219-b077-a74b01793c42',
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;
  @BelongsTo(() => User)
  user: User;
  @ApiProperty({
    description: 'to',
    nullable: false,
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  to: string;
  @ApiProperty({
    description: 'token',
    nullable: false,
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  token: string;
}
