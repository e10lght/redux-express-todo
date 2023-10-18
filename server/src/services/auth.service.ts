import { Users } from '../models/Users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/config';
import { LoginInput } from '../types/auth';
import { User } from '../types/users';
import { AuthenticationError } from '../errors/AuthenticationError';

export const login = async (
  loginInput: LoginInput
): Promise<{ user: User; token: string }> => {
  const { password, email } = loginInput;

  if (!email) {
    throw new AuthenticationError('メールアドレスを入力してください');
  }
  if (!password) {
    throw new AuthenticationError('パスワードを入力してください');
  }
  const user = await Users.findOne({
    where: {
      email
    }
  });
  if (!user) throw new AuthenticationError('ユーザーが見つかりません');

  const isChecked = bcrypt.compareSync(password, user.password);

  if (!isChecked)
    throw new AuthenticationError(
      '入力したメールアドレスまたはパスワードが間違っています'
    );

  const token = jwt.sign({ id: user.user_id }, SECRET_KEY, {
    expiresIn: '1h'
  });
  return { user, token };
};
