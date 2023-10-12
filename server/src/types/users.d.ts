// interfaces/IUserRepository.ts

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

interface IUserRepository {
  findById(id: number): Promise<User | null>;
  create(user: User): Promise<User>;
  // 他の必要なメソッドを追加
}
