import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Role } from 'src/roles/entities/role.entity';
import { User } from './user.entity';

@Table({ tableName: 'user_roles', timestamps: false })
export class UserRoles extends Model<UserRoles> {
  @ForeignKey(() => User)
  @Column
  userId: string;

  @ForeignKey(() => Role)
  @Column
  roleId: string;
}
