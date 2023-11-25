import { Model, DataTypes, Optional, Association, Sequelize } from 'sequelize';
import { Task } from '../types/tasks';
import { Users } from './Users'; // Userモデルへのパスを確認してください

// idは自動生成されるためオプショナルにする
interface TaskAttributes
  extends Optional<Task, 'id' | 'createdAt' | 'updatedAt'> {}

export class Tasks extends Model<Task, TaskAttributes> {
  public id!: number;
  public task_id!: string;
  public title!: string;
  public description!: string;
  public is_completed!: boolean;
  public due_date!: string;
  public user_id!: string;

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
        allowNull: false,
        unique: true
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
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        }
      }
    },
    {
      sequelize,
      tableName: 'tasks',
      timestamps: true
    }
  );
};
