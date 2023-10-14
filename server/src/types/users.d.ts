export type User = {
  id: number;
  user_id: string;
  name: string;
  email: string;
  user_status: boolean;
  is_admin: boolean;
};

interface IUserRepository {
  findById(id: number): Promise<User | null>;
  create(user: User): Promise<User>;
  // 他の必要なメソッドを追加
}
