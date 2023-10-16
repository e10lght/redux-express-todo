import { Tasks } from '../../src/models/Tasks';
import { Users } from '../../src/models/Users';
import {
  createTask,
  deleteTask,
  getTaskByUser,
  updateTask
} from '../../src/services/tasks.service';
import { CreateTaskInput, Task, UpdateTaskInput } from '../../src/types/tasks';

jest.mock('../../src/models/Users', () => ({
  Users: {
    findOne: jest.fn().mockImplementation(() => ({
      set: jest.fn(),
      save: jest.fn(),
      destroy: jest.fn()
    })),
    create: jest.fn()
  }
}));

jest.mock('../../src/models/Tasks', () => ({
  Tasks: {
    findOne: jest.fn().mockImplementation(() => ({
      set: jest.fn(),
      save: jest.fn(),
      destroy: jest.fn()
    })),
    findAll: jest.fn(),
    create: jest.fn()
  }
}));

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

const createMockTasks = (overridesArray = [{}, {}]): Task[] => {
  const defaultTask = (
    id: number,
    task_id: string,
    title: string,
    description: string,
    is_completed: boolean,
    due_date: string,
    user_id: string,
    overrides = {}
  ) => ({
    id,
    task_id,
    title,
    description,
    is_completed,
    due_date,
    user_id,
    get: jest.fn().mockReturnValue({
      id,
      task_id,
      title,
      description,
      is_completed,
      due_date,
      user_id,
      ...overrides
    }),
    set: jest.fn(),
    save: jest.fn(),
    destroy: jest.fn()
  });

  const mockData = [
    defaultTask(
      1,
      'xxxxx',
      'テストテスト',
      'テストテストテスト',
      false,
      '2023-11-11',
      'test123',
      overridesArray[0]
    ),
    defaultTask(
      2,
      'xxxxx2',
      'テストテスト2',
      'テストテストテスト2',
      true,
      '2020-04-11',
      'test456',
      overridesArray[1]
    )
  ];

  return mockData;
};

const createTaskInput = (overrides = {}) => {
  const input: CreateTaskInput = {
    task_id: 'xxxxx',
    title: 'testtest',
    description: 'testtest',
    is_completed: false,
    due_date: '2023-11-11',
    user_id: 'test123'
  };

  return {
    ...input,
    ...overrides
  };
};

const updateTaskInput = (overrides = {}) => {
  const input: UpdateTaskInput = {
    title: 'testtest',
    description: 'testtest',
    is_completed: false,
    due_date: '2023-11-11'
  };

  return {
    ...input,
    ...overrides
  };
};

describe('getTaskByUser', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('正常系：管理者の場合、すべてのタスクを返す', async () => {
    const userId = 'test123';
    const mockUser = createMockUser({ is_admin: true, user_id: userId });
    (Users.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    const mockTasks = createMockTasks();
    (Tasks.findAll as jest.Mock).mockResolvedValueOnce(mockTasks);

    const result = await getTaskByUser(userId);

    expect(result).toEqual(mockTasks);
    expect(Users.findOne).toHaveBeenCalledWith({ where: { user_id: userId } });
    expect(Tasks.findAll).toHaveBeenCalled();
  });

  it('正常系：一般ユーザの場合、ユーザのタスクを返す', async () => {
    const userId = 'test123';
    const mockUser = createMockUser({ is_admin: false, user_id: userId });
    (Users.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    const mockTasks = createMockTasks();
    (Tasks.findAll as jest.Mock).mockResolvedValueOnce(mockTasks);

    const result = await getTaskByUser(userId);

    expect(result).toEqual(mockTasks);
    expect(Users.findOne).toHaveBeenCalledWith({ where: { user_id: userId } });
    expect(Tasks.findAll).toHaveBeenCalledWith({ where: { user_id: userId } });
  });

  it('異常系：ユーザーを指定してください', async () => {
    const userId = 'test123';
    (Users.findOne as jest.Mock).mockResolvedValueOnce(null);

    const mockTasks = createMockTasks();
    (Tasks.findAll as jest.Mock).mockResolvedValueOnce(mockTasks);

    await expect(getTaskByUser(userId)).rejects.toThrow(
      'ユーザーを指定してください'
    );
  });
});

describe('createTask', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('正常系：タスクを作成する', async () => {
    const userId = 'test123';
    const mockUser = createMockUser({ user_id: userId });
    (Users.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    (Tasks.create as jest.Mock).mockResolvedValueOnce(null);
    const input = createTaskInput();

    expect(async () => {
      await createTask(input);

      expect(Users.findOne).toHaveBeenCalledTimes(1);
      expect(Tasks.create).toHaveBeenCalledTimes(1);
    }).not.toThrow();
  });

  it(`異常系：ユーザーが存在しません`, async () => {
    (Users.findOne as jest.Mock).mockResolvedValueOnce(null);

    const input = createTaskInput();

    await expect(createTask(input)).rejects.toThrow(
      new Error('ユーザーが存在しません')
    );
  });

  const testCases = [
    {
      description: 'タイトルを入力してください',
      inputOverrides: { title: '' },
      expectedError: new Error('タイトルを入力してください')
    },
    {
      description: '詳細を入力してください',
      inputOverrides: { description: '' },
      expectedError: new Error('詳細を入力してください')
    },
    {
      description: '期限を入力してください',
      inputOverrides: { due_date: '' },
      expectedError: new Error('期限を入力してください')
    },
    {
      description: '過去の日付を設定することはできません',
      inputOverrides: { due_date: '2020-11-11' },
      expectedError: new Error('過去の日付を設定することはできません')
    }
  ];

  testCases.forEach(test => {
    it(`異常系：${test.description}`, async () => {
      const mockUser = createMockUser();
      (Users.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

      (Tasks.create as jest.Mock).mockResolvedValueOnce(null);
      const input = createTaskInput(test.inputOverrides);

      await expect(createTask(input)).rejects.toThrow(test.expectedError);
    });
  });
});

describe('updateTask', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('正常系：タスクを更新する', async () => {
    const userId = 'test123';
    const mockUser = createMockUser({ is_admin: true, user_id: userId });
    (Users.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    const mockTask = createMockTasks([{ user_id: mockUser.user_id }])[0];
    (Tasks.findOne as jest.Mock).mockResolvedValueOnce(mockTask);
    const input = updateTaskInput();

    expect(async () => {
      await updateTask('taskid', input, mockUser.user_id);
    }).not.toThrow();
  });

  it('異常系：タスクが見つかりません', async () => {
    const userId = 'test123';
    const mockUser = createMockUser({ is_admin: true, user_id: userId });
    (Users.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    (Tasks.findOne as jest.Mock).mockResolvedValueOnce(null);
    const input = updateTaskInput();

    await expect(updateTask('taskid', input, mockUser.user_id)).rejects.toThrow(
      new Error('タスクが見つかりません')
    );
  });

  it('異常系：権限がありません', async () => {
    const userId = 'test123';
    const mockUser = createMockUser({ is_admin: true, user_id: userId });
    (Users.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    const mockTask = createMockTasks([{ user_id: mockUser.user_id }])[0];
    (Tasks.findOne as jest.Mock).mockResolvedValueOnce(mockTask);
    const input = updateTaskInput();

    await expect(updateTask('taskid', input, 'xxxxxxx')).rejects.toThrow(
      new Error('権限がありません')
    );
  });

  it('異常系：不正なキー「${key}」が指定されました', async () => {
    const userId = 'test123';
    const mockUser = createMockUser({ is_admin: true, user_id: userId });
    (Users.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    const mockTask = createMockTasks([{ user_id: mockUser.user_id }])[0];
    (Tasks.findOne as jest.Mock).mockResolvedValueOnce(mockTask);
    const input = updateTaskInput({ xxxxxx: '不正なkeyを追加する' });

    await expect(updateTask('taskid', input, mockUser.user_id)).rejects.toThrow(
      new Error('不正なキー「xxxxxx」が指定されました')
    );
  });

  it('異常系：タイトルを入力してください', async () => {
    const userId = 'test123';
    const mockUser = createMockUser({ is_admin: true, user_id: userId });
    (Users.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    const mockTask = createMockTasks([{ user_id: mockUser.user_id }])[0];
    (Tasks.findOne as jest.Mock).mockResolvedValueOnce(mockTask);
    const input = updateTaskInput({ title: '' });

    await expect(updateTask('taskid', input, mockUser.user_id)).rejects.toThrow(
      new Error('タイトルを入力してください')
    );
  });

  it('異常系：説明を入力してください', async () => {
    const userId = 'test123';
    const mockUser = createMockUser({ is_admin: true, user_id: userId });
    (Users.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

    const mockTask = createMockTasks([{ user_id: mockUser.user_id }])[0];
    (Tasks.findOne as jest.Mock).mockResolvedValueOnce(mockTask);
    const input = updateTaskInput({ description: '' });

    await expect(updateTask('taskid', input, mockUser.user_id)).rejects.toThrow(
      new Error('説明を入力してください')
    );
  });
});

describe('deleteTask', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('正常系：タスクを削除する', async () => {
    const userId = 'test123';
    const mockUser = createMockUser({ is_admin: true, user_id: userId });

    const mockTask = createMockTasks([{ user_id: mockUser.user_id }])[0];
    (Tasks.findOne as jest.Mock).mockResolvedValueOnce(mockTask);

    expect(async () => {
      await deleteTask('taskid', userId);
    }).not.toThrow();
  });

  it('異常系：タスクが見つかりません', async () => {
    const userId = 'test123';

    (Tasks.findOne as jest.Mock).mockResolvedValueOnce(null);

    expect(async () => {
      await deleteTask('taskid', userId);
    }).rejects.toThrow(new Error('タスクが見つかりません'));
  });

  it('異常系：権限がありません', async () => {
    const userId = 'test123';
    const mockUser = createMockUser({ is_admin: true, user_id: userId });

    const mockTask = createMockTasks([{ user_id: mockUser.user_id }])[0];
    (Tasks.findOne as jest.Mock).mockResolvedValueOnce(mockTask);

    expect(async () => {
      await deleteTask('taskid', 'xxxxxx');
    }).rejects.toThrow(new Error('権限がありません'));
  });
});
