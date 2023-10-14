import { Users } from '../models/Users';
import { CreateUserInput, UpdateUserInput, User } from '../types/users';

export const createUser = async (input: CreateUserInput): Promise<void> => {
  if (!input.email || !input.password) {
    throw new Error('メールアドレスまたはパスワードを入力してください');
  }
  const regex: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!regex.test(input.email)) {
    throw new Error('不正なメールアドレスです');
  }
  if (!input.name) {
    throw new Error('名前を入力してください');
  }
  if (!input.user_id) {
    throw new Error('ユーザーIDをを指定してください');
  }
  if (input.password.length < 8) {
    throw new Error('パスワードは8文字以上入力してください');
  }

  const existingUserByEmail = await Users.findOne({
    where: { email: input.email }
  });
  if (existingUserByEmail) {
    throw new Error('入力したメールアドレスはすでに利用されています');
  }

  const existingUserByName = await Users.findOne({
    where: { name: input.name }
  });
  if (existingUserByName) {
    throw new Error('入力したユーザ名はすでに利用されています');
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
  const validKeys: Array<keyof UpdateUserInput> = [
    'name',
    'email',
    'is_admin',
    'user_status'
  ];
  for (const key in input) {
    if (!validKeys.includes(key as keyof UpdateUserInput)) {
      throw new Error(`不正なキー「${key}」が指定されました`);
    }
  }

  const regex: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (input.email && !regex.test(input.email)) {
    throw new Error('不正なメールアドレスです');
  }
  if (input.name === '') {
    throw new Error('名前を入力してください');
  }

  const user = await Users.findOne({
    where: {
      user_id
    }
  });
  if (!user) throw new Error('ユーザが見つかりません');
  user.set(input);
  await user.save();
};

export const deleteUser = async (user_id: string): Promise<void> => {
  const user = await Users.findOne({
    where: {
      user_id
    }
  });
  if (!user) throw new Error('ユーザが見つかりません');
  await user.destroy();
};
