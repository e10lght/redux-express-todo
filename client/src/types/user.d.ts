export type User = {
  id: number;
  user_id: string;
  email: string;
  password: string;
  name: string;
  user_status: boolean;
  is_admin: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserState = {
  data: User[];
  loading: boolean;
  error: null | string;
};
