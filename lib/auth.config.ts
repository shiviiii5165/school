import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // Let the middleware handle authorization logic
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  providers: [],
} satisfies NextAuthConfig;

