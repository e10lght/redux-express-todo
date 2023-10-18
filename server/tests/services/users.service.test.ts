import { UnauthorizedError } from '../../src/errors/UnauthorizedError';
import { Users } from '../../src/models/Users';
import {
  createUser,
  deleteUser,
  getUserByUserId,
  updateUser
} from '../../src/services/users.service';
import { CreateUserInput, UpdateUserInput } from '../../src/types/users';

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

const createUserInput = (overrides = {}) => {
  const input: CreateUserInput = {
    user_id: 'test',
    name: 'test',
    email: 'test@example.com',
    password: 'testtest',
    user_status: false,
    is_admin: false
  };

  return {
    ...input,
    ...overrides
  };
};

const updateUserInput = (overrides = {}) => {
  const input: UpdateUserInput = {
    name: 'test',
    email: 'test@example.com',
    user_status: false,
    is_admin: false
  };

  return {
    ...input,
    ...overrides
  };
};

describe('getUserByUserId', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('ユーザーの取得ができること、ユーザーが存在しない場合nullを返すこと', async () => {
    const mockUser = createMockUser();

    (Users.findOne as jest.Mock)
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(null);

    const result = await getUserByUserId('test123');
    expect(result).toEqual({
      user_id: 'test123',
      name: 'John Doe',
      id: 1,
      email: 'test@example.com',
      password: 'testtest',
      user_status: false,
      is_admin: false
    });
    const result2 = await getUserByUserId('xxxxx');
    expect(result2).toEqual(null);
  });
});

describe('createUser', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('正常系：ユーザ作成が成功すること', async () => {
    const mockUser = createMockUser({ is_admin: true });

    (Users.findOne as jest.Mock)
      .mockResolvedValueOnce(mockUser) // 認証ユーザに対するユーザ取得
      .mockResolvedValueOnce(null) // 同じメールアドレスが存在しているかどうか
      .mockResolvedValueOnce(null); // 同じユーザ名が存在しているかどうか
    (Users.create as jest.Mock).mockResolvedValueOnce(null);

    const input = createUserInput();

    expect(async () => {
      await createUser(input, 'test2');

      expect(Users.create).toHaveBeenCalledTimes(1);
      expect(Users.findOne).toHaveBeenCalledTimes(3);
    }).not.toThrow();
  });

  it('正常系：管理者の場合管理者ユーザの作成が成功すること', async () => {
    const mockUser = createMockUser({ is_admin: true });

    (Users.findOne as jest.Mock)
      .mockResolvedValueOnce(mockUser) // 認証ユーザに対するユーザ取得
      .mockResolvedValueOnce(null) // 同じメールアドレスが存在しているかどうか
      .mockResolvedValueOnce(null); // 同じユーザ名が存在しているかどうか
    (Users.create as jest.Mock).mockResolvedValueOnce(null);

    console.log(mockUser.get());
    const input = createUserInput({ is_admin: true });
    console.log(input);

    expect(async () => {
      await createUser(input, 'test2');
    }).not.toThrow();
  });

  const testCases = [
    {
      description:
        '異常系：権限がありません（一般ユーザは管理者ユーザの作成はできないこと）',
      mockInput: { is_admin: false },
      inputOverrides: { is_admin: true },
      expectedError: new UnauthorizedError('権限がありません')
    },
    {
      description: '異常系：メールアドレスまたはパスワードを入力してください',
      mockInput: { is_admin: true },
      inputOverrides: { password: '' },
      expectedError: new Error(
        'メールアドレスまたはパスワードを入力してください'
      )
    },
    {
      description: '異常系：名前を入力してください',
      mockInput: { is_admin: true },
      inputOverrides: { name: '' },
      expectedError: new Error('名前を入力してください')
    },
    {
      description: '異常系：ユーザーIDをを指定してください',
      mockInput: { is_admin: true },
      inputOverrides: { user_id: '' },
      expectedError: new Error('ユーザーIDをを指定してください')
    },
    {
      description: '異常系：パスワードは8文字以上入力してください',
      mockInput: { is_admin: true },
      inputOverrides: { password: '1234' },
      expectedError: new Error('パスワードは8文字以上入力してください')
    }
  ];

  testCases.forEach(
    ({ description, mockInput, inputOverrides, expectedError }) => {
      it(description, async () => {
        const mockUser = createMockUser(mockInput);

        (Users.findOne as jest.Mock)
          .mockResolvedValueOnce(mockUser)
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(null);

        (Users.create as jest.Mock).mockResolvedValueOnce(null);

        const input = createUserInput(inputOverrides);

        await expect(createUser(input, 'test123')).rejects.toThrow(
          expectedError
        );
      });
    }
  );

  it('異常系：権限がありません（userが存在しない場合）', async () => {
    (Users.findOne as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    (Users.create as jest.Mock).mockResolvedValueOnce(null);

    const input = createUserInput({
      email: 'testtest@example.com',
      is_admin: true
    });

    await expect(createUser(input, 'test123')).rejects.toThrow(
      new UnauthorizedError('権限がありません')
    );
  });

  it('異常系：入力したメールアドレスはすでに利用されています', async () => {
    const mockUser = createMockUser({
      is_admin: true,
      email: 'testtest@example.com'
    });

    (Users.findOne as jest.Mock)
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(null);

    (Users.create as jest.Mock).mockResolvedValueOnce(null);

    const input = createUserInput({ email: 'testtest@example.com' });

    await expect(createUser(input, 'test123')).rejects.toThrow(
      '入力したメールアドレスはすでに利用されています'
    );
  });

  it('異常系：入力したユーザ名はすでに利用されています', async () => {
    const mockUser = createMockUser({
      is_admin: true,
      name: 'テスト'
    });

    (Users.findOne as jest.Mock)
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(mockUser);

    (Users.create as jest.Mock).mockResolvedValueOnce(null);

    const input = createUserInput({ name: 'テスト' });

    await expect(createUser(input, 'test123')).rejects.toThrow(
      '入力したユーザ名はすでに利用されています'
    );
  });

  const invalidEmails = [
    'xxx.xxx@com',
    'example',
    'example@.com',
    '@example.com',
    'example@example.',
    'example@example.c',
    'example@.c'
  ];

  invalidEmails.forEach(email => {
    it(`異常系：不正なメールアドレスです - ${email}`, async () => {
      const mockUser = createMockUser({ is_admin: true });

      (Users.findOne as jest.Mock)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      (Users.create as jest.Mock).mockResolvedValueOnce(null);

      const input = createUserInput({ email });

      await expect(createUser(input, 'test123')).rejects.toThrow(
        new Error('不正なメールアドレスです')
      );
    });
  });
});

describe('updateUser', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('正常系：ユーザ更新が成功すること', async () => {
    const mockUser = createMockUser();

    // メールアドレスおよびユーザ名の重複はここでテストしないため、正常系としてnullを返す
    (Users.findOne as jest.Mock)
      .mockResolvedValueOnce(mockUser) // 更新対象のユーザを返す
      .mockResolvedValueOnce(mockUser); // 認証されているユーザを返す

    const input = updateUserInput({ is_admin: undefined });

    expect(async () => {
      await updateUser('test2', input, 'test2');
    }).not.toThrow();
  });

  const testCases2 = [
    {
      title: '不正なキー「xxxxx」が指定されました',
      target: {
        xxxxx: '123456'
      },
      expectedError: new Error('不正なキー「xxxxx」が指定されました')
    },
    {
      title: '不正なメールアドレスです',
      target: {
        email: 'xxxxxxxx'
      },
      expectedError: new Error('不正なメールアドレスです')
    },
    {
      title: '名前を入力してください',
      target: {
        name: ''
      },
      expectedError: new Error('名前を入力してください')
    }
  ];
  testCases2.forEach(test => {
    it(`異常系：${test.title}`, async () => {
      const mockUser = createMockUser();

      (Users.findOne as jest.Mock)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockUser);

      const input = updateUserInput(test.target);

      await expect(updateUser('test2', input, 'test2')).rejects.toThrow(
        test.expectedError
      );
    });
  });

  it('異常系：更新するユーザーが見つかりません', async () => {
    const mockUser = createMockUser();

    // メールアドレスおよびユーザ名の重複はここでテストしないため、正常系としてnullを返す
    (Users.findOne as jest.Mock)
      .mockResolvedValueOnce(null) // 更新対象のユーザを返す
      .mockResolvedValueOnce(mockUser); // 認証されているユーザを返す

    const input = updateUserInput({ is_admin: undefined });

    await expect(updateUser('test2', input, 'test2')).rejects.toThrow(
      '更新するユーザが見つかりません'
    );
  });

  it('異常系：ユーザが見つかりません', async () => {
    const mockUser = createMockUser();

    (Users.findOne as jest.Mock)
      .mockResolvedValueOnce(mockUser) // 更新対象のユーザを返す
      .mockResolvedValueOnce(null); // 認証されているユーザを返す

    const input = updateUserInput({ is_admin: undefined });

    await expect(updateUser('test2', input, 'test2')).rejects.toThrow(
      'ユーザが見つかりません'
    );
  });

  it('異常系：権限がありません（管理者以外の認証ユーザが認証ユーザ以外のユーザを更新しようとしたケース）', async () => {
    const mockUser = createMockUser();
    const mockAuthUser2 = createMockUser({ user_id: 'test2', is_admin: false });

    (Users.findOne as jest.Mock)
      .mockResolvedValueOnce(mockUser) // 更新対象のユーザを返す
      .mockResolvedValueOnce(mockAuthUser2); // 認証ユーザは更新対象ユーザとは異なる＆管理者ではない

    const input = updateUserInput();

    await expect(updateUser('test2', input, 'test2')).rejects.toThrowError(
      new UnauthorizedError('権限がありません')
    );
  });

  it('異常系：権限がありません（更新ユーザと認証ユーザが同じだが、管理者フラグを操作するケース）', async () => {
    const mockUser = createMockUser();

    (Users.findOne as jest.Mock)
      .mockResolvedValueOnce(mockUser) // 更新対象のユーザを返す
      .mockResolvedValueOnce(mockUser);

    const input = updateUserInput({ is_admin: true }); // 一般ユーザが管理者になろうとする

    await expect(updateUser('test2', input, 'test2')).rejects.toThrowError(
      new UnauthorizedError('権限がありません')
    );
  });
});

describe('deleteUser', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('正常系：ユーザ削除が成功すること', async () => {
    const mockUser = createMockUser();
    const mockUser2 = createMockUser({ user_id: 'testxxx', is_admin: true });

    (Users.findOne as jest.Mock)
      .mockResolvedValueOnce(mockUser) // 削除対象のユーザを返す
      .mockResolvedValueOnce(mockUser2); // 認証されているユーザを返す

    expect(async () => {
      await deleteUser('testxxx', 'test123');
    }).not.toThrow();
  });

  it('異常系：削除するユーザが見つかりません', async () => {
    const mockUser = createMockUser();

    (Users.findOne as jest.Mock)
      .mockResolvedValueOnce(null) // 削除対象のユーザを返す
      .mockResolvedValueOnce(mockUser); // 認証されているユーザを返す

    await expect(deleteUser('testxxx', 'test123')).rejects.toThrow(
      '削除するユーザが見つかりません'
    );
  });
  it('異常系：ユーザが見つかりません', async () => {
    const mockUser = createMockUser();

    (Users.findOne as jest.Mock)
      .mockResolvedValueOnce(mockUser) // 削除対象のユーザを返す
      .mockResolvedValueOnce(null); // 認証されているユーザを返す

    await expect(deleteUser('testxxx', 'test123')).rejects.toThrow(
      'ユーザが見つかりません'
    );
  });

  it('異常系：権限がありません', async () => {
    const mockUser = createMockUser({ is_admin: false });

    (Users.findOne as jest.Mock)
      .mockResolvedValueOnce(mockUser) // 削除対象のユーザを返す
      .mockResolvedValueOnce(mockUser); // 認証されているユーザを返す

    await expect(deleteUser('testxxx', 'test123')).rejects.toThrow(
      new UnauthorizedError('権限がありません')
    );
  });
});
