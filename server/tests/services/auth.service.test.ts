import { Users } from '../../src/models/Users';
import jwt from 'jsonwebtoken';
import { LoginInput } from '../../src/types/auth';
import { login } from '../../src/services/auth.service';
import bcrypt from 'bcrypt';

jest.mock('../../src/models/Users', () => ({
  Users: {
    findOne: jest.fn()
  }
}));

jest.mock('jsonwebtoken');
jest.mock('bcrypt');

const createMockUser = (overrides = {}) => {
  const mockData = {
    user_id: 'test123',
    name: 'John Doe',
    id: 1,
    email: 'test@example.com',
    password: 'testtest',
    user_status: false,
    is_admin: false,
    get: jest.fn().mockReturnValue({
      user_id: 'test123',
      name: 'John Doe',
      id: 1,
      email: 'test@example.com',
      password: 'testtest',
      user_status: false,
      is_admin: false,
      ...overrides
    }),
    set: jest.fn(),
    save: jest.fn(),
    destroy: jest.fn()
  };

  return {
    ...mockData,
    ...overrides
  };
};

describe('login', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('正常系', async () => {
    const sampletoken = 'sampletoken';
    (jwt.sign as jest.Mock).mockReturnValue(sampletoken);

    (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

    const mockUser = createMockUser();
    (Users.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    const input: LoginInput = {
      email: 'xxx@example.com',
      password: '12345678'
    };

    const result = await login(input);

    expect(result).toEqual({ user: mockUser, token: sampletoken });
  });

  it('異常系：メールアドレスを入力してください', async () => {
    const sampletoken = 'sampletoken';
    (jwt.sign as jest.Mock).mockReturnValue(sampletoken);

    (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

    const mockUser = createMockUser();
    (Users.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    const input: LoginInput = {
      email: '',
      password: '12345678'
    };

    await expect(login(input)).rejects.toThrow(
      'メールアドレスを入力してください'
    );
  });

  it('異常系：パスワードを入力してください', async () => {
    const sampletoken = 'sampletoken';
    (jwt.sign as jest.Mock).mockReturnValue(sampletoken);

    (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

    const mockUser = createMockUser();
    (Users.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    const input: LoginInput = {
      email: 'xxx@example.com',
      password: ''
    };

    await expect(login(input)).rejects.toThrow('パスワードを入力してください');
  });

  it('異常系：ユーザーが見つかりません', async () => {
    const sampletoken = 'sampletoken';
    (jwt.sign as jest.Mock).mockReturnValue(sampletoken);

    (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

    (Users.findOne as jest.Mock).mockResolvedValueOnce(null);

    const input: LoginInput = {
      email: 'xxx@example.com',
      password: '12345678'
    };

    await expect(login(input)).rejects.toThrow('ユーザーが見つかりません');
  });

  it('異常系：入力したメールアドレスまたはパスワードが間違っています', async () => {
    const sampletoken = 'sampletoken';
    (jwt.sign as jest.Mock).mockReturnValue(sampletoken);

    (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

    const mockUser = createMockUser();
    (Users.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    const input: LoginInput = {
      email: 'xxx@example.com',
      password: '12345678'
    };

    await expect(login(input)).rejects.toThrow(
      '入力したメールアドレスまたはパスワードが間違っています'
    );
  });
});
