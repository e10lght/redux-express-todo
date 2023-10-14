import { Users } from '../models/Users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/config';
import { LoginInput } from '../types/auth';
import { User } from '../types/users';

export const login = async (
  loginInput: LoginInput
): Promise<{ user: User; token: string }> => {
  const { password, email } = loginInput;

  if (!email) {
    throw new Error('メールアドレスを入力してください');
  }
  if (!password) {
    throw new Error('パスワードを入力してください');
  }
  const user = await Users.findOne({
    where: {
      email
    }
  });
  if (!user) throw new Error('ユーザーが見つかりません');

  const isChecked = bcrypt.compareSync(password, user.password);

  if (!isChecked)
    throw new Error('入力したメールアドレスまたはパスワードが間違っています');

  const token = jwt.sign({ id: user.user_id }, SECRET_KEY, {
    expiresIn: '1h'
  });
  return { user, token };
};
