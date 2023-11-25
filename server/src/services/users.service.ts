import { UnauthorizedError } from '../errors/UnauthorizedError';
import { Users } from '../models/Users';
import { CreateUserInput, UpdateUserInput, User } from '../types/users';

export const createUser = async (
  input: CreateUserInput,
  userId: string
): Promise<void> => {
  console.log(userId);
  const user = await Users.findOne({
    where: { user_id: userId }
  });
  console.log(user);
  if (!user?.is_admin && input.is_admin) {
    throw new UnauthorizedError('権限がありません');
  }
  if (!input.email || !input.password) {
    throw new Error('メールアドレスまたはパスワードを入力してください');
  }
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
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

export const getUserByUserId = async (
  userId: string
): Promise<User | User[] | null> => {
  const user = await Users.findOne({
    where: {
      user_id: userId
    }
  });
  if (!user) return null;
  if (user.is_admin) {
    return await Users.findAll();
  }
  return user.get({ plain: true });
};

export const updateUser = async (
  targetUserId: string,
  input: UpdateUserInput,
  userId: string
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

  const targetUser = await Users.findOne({
    where: {
      user_id: targetUserId
    }
  });
  const authUser = await Users.findOne({
    where: {
      user_id: userId
    }
  });
  if (!targetUser) throw new Error('更新するユーザが見つかりません');
  if (!authUser) throw new Error('ユーザが見つかりません');
  if (
    !authUser.is_admin &&
    (typeof input.is_admin !== 'undefined' || targetUserId !== userId)
  )
    throw new UnauthorizedError('権限がありません');

  targetUser.set(input);
  await targetUser.save();
};

export const deleteUser = async (
  targetUserId: string,
  authUserId: string
): Promise<void> => {
  const targetUser = await Users.findOne({
    where: {
      user_id: targetUserId
    }
  });
  const authUser = await Users.findOne({
    where: {
      user_id: authUserId
    }
  });
  if (!targetUser) throw new Error('削除するユーザが見つかりません');
  if (!authUser) throw new Error('ユーザが見つかりません');
  if (targetUserId !== authUserId && !authUser.is_admin)
    throw new UnauthorizedError('権限がありません');
  await targetUser.destroy();
};
