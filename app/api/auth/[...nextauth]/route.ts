import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    id: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Check against our API users
          const apiUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
          
          // First, try to get users from our API
          const usersResponse = await fetch(`${apiUrl}/api/register`);
          
          if (usersResponse.ok) {
            const data = await usersResponse.json();
            const user = data.users.find((u: any) => 
              u.email === credentials.email && u.password === credentials.password
            );
            
            if (user) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
              };
            }
          }

          // Fallback: Check demo users directly
          const demoUsers = [
            {
              id: "1",
              name: "Admin User",
              email: "admin@example.com",
              password: "123456",
              image: null,
            },
          ];

          const demoUser = demoUsers.find(
            u => u.email === credentials.email && u.password === credentials.password
          );

          if (demoUser) {
            return {
              id: demoUser.id,
              name: demoUser.name,
              email: demoUser.email,
              image: demoUser.image,
            };
          }

        } catch (error) {
          console.error('Error during authentication:', error);
          
          // Fallback to demo user if API fails
          if (credentials.email === "admin@example.com" && credentials.password === "123456") {
            return {
              id: "1",
              name: "Admin User",
              email: "admin@example.com",
              image: null,
            };
          }
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };