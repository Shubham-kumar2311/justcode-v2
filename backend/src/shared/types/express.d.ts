export interface JwtUserPayload {
  _id: string;
  email: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload | null;
    }
  }
}

export {};
