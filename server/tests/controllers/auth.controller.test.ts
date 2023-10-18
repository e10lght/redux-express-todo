import { Request } from 'express';
import {
  loginHandler,
  logoutHandler
} from '../../src/controllers/auth.controller';
import { AuthenticationError } from '../../src/errors/AuthenticationError';
import { login } from '../../src/services/auth.service';

jest.mock('../../src/services/auth.service');

describe('loginHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('正常系: 200', async () => {
    (login as jest.Mock).mockResolvedValueOnce({
      user: {
        id: 1,
        user_id: 'test123',
        name: 'test',
        email: 'test@example.com',
        password: 'xxxxx',
        user_status: false,
        is_admin: false
      },
      token: 'testtoken'
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res);

    const req = {
      body: {
        email: 'test@email.com',
        password: 'testPassword'
      }
    } as unknown as Request;

    await loginHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'ログインに成功しました',
      user: {
        email: 'test@example.com',
        id: 'test123',
        name: 'test',
        token: 'testtoken'
      }
    });
  });

  it('異常系: 401', async () => {
    (login as jest.Mock).mockRejectedValueOnce(
      new AuthenticationError('ユーザーが見つかりません')
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res);

    const req = {
      body: {
        email: 'test@email.com',
        password: 'testPassword'
      }
    } as unknown as Request;

    await loginHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'ユーザーが見つかりません'
    });
  });

  it('異常系: 500', async () => {
    (login as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res);

    const req = {
      body: {
        email: 'test@email.com',
        password: 'testPassword'
      }
    } as unknown as Request;

    await loginHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('logoutHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('正常系: 200', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn();

    const req = {
      body: {
        email: 'test@email.com',
        password: 'testPassword'
      }
    } as unknown as Request;

    logoutHandler(req, res);

    expect(res.clearCookie).toHaveBeenCalledWith('token');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'ログアウトに成功しました'
    });
  });
});
