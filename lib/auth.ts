import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const parsedCredentials = loginSchema.safeParse(credentials);

          if (!parsedCredentials.success) {
            console.error("[Auth] Invalid credentials format:", parsedCredentials.error.flatten());
            return null;
          }

          const { email, password } = parsedCredentials.data;

          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
          });

          if (!user) {
            console.error("[Auth] No user found with email:", email);
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            console.error("[Auth] Password mismatch for user:", email);
            return null;
          }

          console.log("[Auth] Login successful for:", email, "role:", user.role);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error: any) {
          console.error("[Auth] CRITICAL Error during authorization:");
          console.error(error);
          
          // Throw a specific error so it's not confused with invalid credentials
          if (error.message && error.message.includes("Can't reach database server")) {
            throw new Error("DATABASE_CONNECTION_ERROR");
          }
          
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  }
});
