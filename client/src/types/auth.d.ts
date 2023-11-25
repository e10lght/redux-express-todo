export type AuthState = {
  auth: AuthUser;
  loading: boolean;
  error: string | null;
};

export type AuthUser = {
  message: string;
  status: number;
  user: {
    id: string;
    name: string;
    email: string;
    token: string;
  };
};
