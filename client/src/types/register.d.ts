export type Register = {
  name: string;
  email: string;
  password: string;
};

export type RegisterState = {
  message: string;
  status: number;
  loading: boolean;
  error: null;
};
