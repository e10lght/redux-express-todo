import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  updateUserHandler
} from '../../src/controllers/users.controller';
import { UnauthorizedError } from '../../src/errors/UnauthorizedError';
import {
  createUser,
  deleteUser,
  getUserByUserId,
  updateUser
} from '../../src/services/users.service';

jest.mock('../../src/services/users.service');
jest.mock('bcrypt');
jest.mock('uuid');

describe('getUserHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('正常系: 200', async () => {
    const mockUser = { id: '123', name: 'Test User' };
    (getUserByUserId as jest.Mock).mockResolvedValueOnce(mockUser);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = { params: { user_id: '123' } } as unknown as Request;

    await getUserHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it('異常系: 400', async () => {
    const errorMessage = '不正なメールアドレスです';
    (getUserByUserId as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = { params: { user_id: '123' } } as unknown as Request;

    await getUserHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('異常系: 403', async () => {
    const errorMessage = '権限がありません';
    (getUserByUserId as jest.Mock).mockRejectedValueOnce(
      new UnauthorizedError(errorMessage)
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = { params: { user_id: '123' } } as unknown as Request;

    await getUserHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

describe('createUserHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('正常系: 201', async () => {
    (createUser as jest.Mock).mockResolvedValueOnce(null);
    (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedPassword');
    (uuidv4 as jest.Mock).mockReturnValue('testUuid');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = {
      body: {
        name: 'testName',
        email: 'test@email.com',
        password: 'testPassword',
        user_status: true,
        is_admin: false
      },
      auth: { id: 'testUserId' }
    } as unknown as Request;

    await createUserHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'ユーザ追加に成功しました'
    });
  });

  it('異常系: 400', async () => {
    const errorMessage = '不正なメールアドレスです';
    (createUser as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedPassword');
    (uuidv4 as jest.Mock).mockReturnValue('testUuid');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = {
      body: {
        name: 'testName',
        email: 'test@email.com',
        password: 'testPassword',
        user_status: true,
        is_admin: false
      },
      auth: { id: 'testUserId' }
    } as unknown as Request;

    await createUserHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: errorMessage
    });
  });

  it('異常系: 403', async () => {
    const errorMessage = '権限がありません';
    (createUser as jest.Mock).mockRejectedValueOnce(
      new UnauthorizedError(errorMessage)
    );
    (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedPassword');
    (uuidv4 as jest.Mock).mockReturnValue('testUuid');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = {
      body: {
        name: 'testName',
        email: 'test@email.com',
        password: 'testPassword',
        user_status: true,
        is_admin: false
      },
      auth: { id: 'testUserId' }
    } as unknown as Request;

    await createUserHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: errorMessage
    });
  });
});

describe('deleteUserHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('正常系: 200', async () => {
    (deleteUser as jest.Mock).mockResolvedValueOnce(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = {
      params: {
        user_id: 'xxxxx'
      },
      auth: { id: 'testUserId' }
    } as unknown as Request;

    await deleteUserHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'ユーザの削除が完了しました'
    });
  });

  it('異常系: 400', async () => {
    const errorMessage = '不正なメールアドレスです';
    (deleteUser as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedPassword');
    (uuidv4 as jest.Mock).mockReturnValue('testUuid');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = {
      params: {
        user_id: 'xxxxx'
      },
      auth: { id: 'testUserId' }
    } as unknown as Request;

    await deleteUserHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: errorMessage
    });
  });

  it('異常系: 403', async () => {
    const errorMessage = '権限がありません';
    (deleteUser as jest.Mock).mockRejectedValueOnce(
      new UnauthorizedError(errorMessage)
    );
    (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedPassword');
    (uuidv4 as jest.Mock).mockReturnValue('testUuid');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = {
      body: {
        name: 'testName',
        email: 'test@email.com',
        password: 'testPassword',
        user_status: true,
        is_admin: false
      },
      params: {
        user_id: 'xxxxx'
      },
      auth: { id: undefined }
    } as unknown as Request;

    await deleteUserHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: errorMessage
    });
  });
});

describe('updateUserHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('正常系: 200', async () => {
    (updateUser as jest.Mock).mockResolvedValueOnce(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = {
      body: {
        name: 'testName',
        email: 'test@email.com',
        password: 'testPassword',
        user_status: true,
        is_admin: false
      },
      params: {
        user_id: 'xxxxx'
      },
      auth: { id: 'testUserId' }
    } as unknown as Request;

    await updateUserHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'ユーザの更新が完了しました'
    });
  });

  it('異常系: 400', async () => {
    const errorMessage = '不正なメールアドレスです';
    (updateUser as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedPassword');
    (uuidv4 as jest.Mock).mockReturnValue('testUuid');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = {
      body: {
        name: 'testName',
        email: 'test@email.com',
        password: 'testPassword',
        user_status: true,
        is_admin: false
      },
      params: {
        user_id: 'xxxxx'
      },
      auth: { id: 'testUserId' }
    } as unknown as Request;

    await updateUserHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: errorMessage
    });
  });

  it('異常系: 403', async () => {
    const errorMessage = '権限がありません';
    (updateUser as jest.Mock).mockRejectedValueOnce(
      new UnauthorizedError(errorMessage)
    );
    (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedPassword');
    (uuidv4 as jest.Mock).mockReturnValue('testUuid');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = {
      body: {
        name: 'testName',
        email: 'test@email.com',
        password: 'testPassword',
        user_status: true,
        is_admin: false
      },
      params: {
        user_id: 'xxxxx'
      },
      auth: { id: 'testUserId' }
    } as unknown as Request;

    await updateUserHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: errorMessage
    });
  });
});
