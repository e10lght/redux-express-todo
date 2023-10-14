import { Model, DataTypes, Optional, Association, Sequelize } from 'sequelize';
import { User } from '../types/users';
import { Tasks } from './Tasks';

// idは自動生成されるためオプショナルにする
interface UserAttributes extends Optional<User, 'id'> {}

export class Users extends Model<User, UserAttributes> {
  id!: number;
  user_id!: string;
  name!: string;
  email!: string;
  user_status!: boolean;
  is_admin!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {
    user: Association<Users, Tasks>;
  };
}

export const initUsersModel = (sequelize: Sequelize) => {
  Users.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true
        },
        allowNull: false
      },
      name: {
        type: DataTypes.STRING
      },
      user_status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      tableName: 'users'
    }
  );
};
