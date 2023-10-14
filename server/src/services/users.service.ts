import { sequelize } from '../config/db/sequelize.config';
import { Users } from '../models/Users';
import { User } from '../types/users';

type CreateUserInput = Omit<User, 'id'>;
type UpdateUserInput = Partial<Omit<User, 'id' | 'user_id'>>;

export const createUser = async (input: CreateUserInput): Promise<void> => {
  const regex: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!regex.test(input.email)) {
    throw new Error('不正なメールアドレスです');
  }
  if (input.name === '') {
    throw new Error('名前を入力してください');
  }
  if (input.user_id === '') {
    throw new Error('ユーザーIDをを指定してください');
  }
  await Users.create(input);
};

export const getUserByUserId = async (userId: string): Promise<User | null> => {
  const user = await Users.findOne({
    where: {
      user_id: userId
    }
  });
  if (!user) return null;
  return user.get({ plain: true });
};

export const updateUser = async (
  user_id: string,
  input: UpdateUserInput
): Promise<void> => {
  const user = await Users.findOne({
    where: {
      user_id
    }
  });
  if (!user) throw new Error('ユーザが見つかりません');
  user.set(input);
  await user.save();
};

export const deleteUser = async (id: number): Promise<void> => {
  const user = await sequelize.models.Users.findByPk(id);
  if (!user) throw new Error('ユーザが見つかりません');
  await user.destroy();
};
