import { Model, DataTypes, Optional, Association, Sequelize } from 'sequelize';
import { Users } from './Users'; // Userモデルへのパスを確認してください

type TaskModel = {
  id: number;
  task_id: string;
  title: string;
  description: string;
  is_completed: boolean;
  due_date: string;
  user_id: number;
};

// idは自動生成されるためオプショナルにする
interface TaskAttributes extends Optional<TaskModel, 'id'> {}

export class Tasks extends Model<TaskModel, TaskAttributes> {
  public id!: number;
  public task_id!: string;
  public title!: string;
  public description!: string;
  public is_completed!: boolean;
  public due_date!: string;
  public user_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // オプション: アソシエーション関係を記述
  public static associations: {
    user: Association<Tasks, Users>;
  };
}

export const initTasksModel = (sequelize: Sequelize) => {
  Tasks.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      task_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      tableName: 'tasks'
    }
  );
};
