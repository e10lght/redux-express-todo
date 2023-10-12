import { Model, DataTypes, Optional, Association, Sequelize } from 'sequelize';
import { Tasks } from './Tasks';

type UserModel = {
  id: number;
  user_id: number;
  name: string;
  email: string;
  user_status: boolean;
  is_admin: boolean;
};

// idは自動生成されるためオプショナルにする
interface UserAttributes extends Optional<UserModel, 'id'> {}

export class Users extends Model<UserModel, UserAttributes> {
  id!: number;
  user_id!: number;
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
