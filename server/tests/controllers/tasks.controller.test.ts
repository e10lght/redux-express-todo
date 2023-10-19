import { Request } from 'express';
import {
  createTaskHandler,
  deleteTaskHandler,
  getTaskHandler,
  updateTaskHandler
} from '../../src/controllers/tasks.controller';
import { UnauthorizedError } from '../../src/errors/UnauthorizedError';
import {
  createTask,
  deleteTask,
  getTaskByUser,
  updateTask
} from '../../src/services/tasks.service';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../src/services/tasks.service');
jest.mock('bcrypt');
jest.mock('uuid');

describe('getTaskHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('正常系: 200', async () => {
    const mockUser = { id: '123', name: 'Test User' };
    (getTaskByUser as jest.Mock).mockResolvedValueOnce(mockUser);

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

    await getTaskHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it('異常系: 400', async () => {
    const errorMessage = 'ユーザーを指定してください';
    (getTaskByUser as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = { params: { user_id: '123' } } as unknown as Request;

    await getTaskHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('異常系: 403', async () => {
    const errorMessage = '権限がありません';
    (getTaskByUser as jest.Mock).mockRejectedValueOnce(
      new UnauthorizedError(errorMessage)
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = { params: { user_id: '123' } } as unknown as Request;

    await getTaskHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

describe('createTaskHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('正常系: 201', async () => {
    const mockUser = { id: '123', name: 'Test User' };
    (createTask as jest.Mock).mockResolvedValueOnce(mockUser);
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

    await createTaskHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'タスクの追加に成功しました'
    });
  });

  it('異常系: 400', async () => {
    const errorMessage = 'ユーザーが存在しません';
    (createTask as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
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

    await createTaskHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('異常系: 403', async () => {
    const errorMessage = '権限がありません';
    (createTask as jest.Mock).mockRejectedValueOnce(
      new UnauthorizedError(errorMessage)
    );
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

    await createTaskHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

describe('updateTaskHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('正常系: 200', async () => {
    const mockUser = { id: '123', name: 'Test User' };
    (updateTask as jest.Mock).mockResolvedValueOnce(mockUser);
    (uuidv4 as jest.Mock).mockReturnValue('testUuid');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = {
      body: {
        name: 'testName',
        email: 'test@email.com',
        password: 'testPassword'
      },
      params: {
        task_id: 'xxxxxx'
      },
      auth: { id: 'testUserId' }
    } as unknown as Request;

    await updateTaskHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'タスクの更新が完了しました'
    });
  });

  it('異常系: 400', async () => {
    const errorMessage = 'タスクが見つかりません';
    (updateTask as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    (uuidv4 as jest.Mock).mockReturnValue('testUuid');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = {
      body: {
        name: 'testName',
        email: 'test@email.com',
        password: 'testPassword'
      },
      params: {
        task_id: 'xxxxxx'
      },
      auth: { id: 'testUserId' }
    } as unknown as Request;

    await updateTaskHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('異常系: 403', async () => {
    const errorMessage = '権限がありません';
    (updateTask as jest.Mock).mockRejectedValueOnce(
      new UnauthorizedError(errorMessage)
    );
    (uuidv4 as jest.Mock).mockReturnValue('testUuid');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = {
      body: {
        name: 'testName',
        email: 'test@email.com',
        password: 'testPassword'
      },
      params: {
        task_id: 'xxxxxx'
      },
      auth: { id: 'testUserId' }
    } as unknown as Request;

    await updateTaskHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

describe('deleteTaskHandler', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('正常系: 200', async () => {
    const mockUser = { id: '123', name: 'Test User' };
    (deleteTask as jest.Mock).mockResolvedValueOnce(mockUser);
    (uuidv4 as jest.Mock).mockReturnValue('testUuid');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = {
      body: {
        name: 'testName',
        email: 'test@email.com',
        password: 'testPassword'
      },
      params: {
        task_id: 'xxxxxx'
      },
      auth: { id: 'testUserId' }
    } as unknown as Request;

    await deleteTaskHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'タスクの削除が完了しました'
    });
  });

  it('異常系: 400', async () => {
    const errorMessage = 'タスクが見つかりません';
    (deleteTask as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    (uuidv4 as jest.Mock).mockReturnValue('testUuid');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = {
      body: {
        name: 'testName',
        email: 'test@email.com',
        password: 'testPassword'
      },
      params: {
        task_id: 'xxxxxx'
      },
      auth: { id: 'testUserId' }
    } as unknown as Request;

    await deleteTaskHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('異常系: 403', async () => {
    const errorMessage = '権限がありません';
    (deleteTask as jest.Mock).mockRejectedValueOnce(
      new UnauthorizedError(errorMessage)
    );
    (uuidv4 as jest.Mock).mockReturnValue('testUuid');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    const req = {
      body: {
        name: 'testName',
        email: 'test@email.com',
        password: 'testPassword'
      },
      params: {
        task_id: 'xxxxxx'
      },
      auth: { id: 'testUserId' }
    } as unknown as Request;

    await deleteTaskHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});
