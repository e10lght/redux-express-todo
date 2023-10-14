declare namespace Express {
  export interface Request {
    auth?: { id: number; iat: number; exp: number };
  }
}
