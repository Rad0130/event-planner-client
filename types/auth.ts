export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string | null;
  createdAt: string;
}

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}