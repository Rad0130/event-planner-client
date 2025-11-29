// types/auth.ts
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string | null;
  createdAt: string;
}

// NextAuth type extensions
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}