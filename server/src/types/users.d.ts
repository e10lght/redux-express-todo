export type User = {
  id: number;
  user_id: string;
  name: string;
  email: string;
  password: string;
  user_status: boolean;
  is_admin: boolean;
};

export type CreateUserInput = Omit<User, 'id'>;
export type UpdateUserInput = Partial<
  Omit<User, 'id' | 'user_id' | 'password'>
>;
