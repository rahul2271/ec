import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

let authConfig: NextAuthConfig;

try {
  // Try to use PrismaAdapter if Prisma is available
  const { PrismaAdapter } = require("@auth/prisma-adapter");
  const { prisma } = require("./db");

  authConfig = {
    adapter: PrismaAdapter(prisma),
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
    providers: [
      Credentials({
        async authorize(credentials) {
          const validatedCredentials = credentialsSchema.safeParse(credentials);

          if (!validatedCredentials.success) {
            return null;
          }

          const { email, password } = validatedCredentials.data;

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.passwordHash);

          if (!passwordMatch) {
            return null;
          }

          if (!user.isActive) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.role = (user as any).role;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string;
          (session.user as any).role = token.role;
        }
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
  };
} catch (error) {
  console.warn(
    "[Auth] Prisma not available - using fallback auth config. Run 'npx prisma generate' to enable full auth."
  );

  // Fallback configuration without PrismaAdapter
  authConfig = {
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
    providers: [
      Credentials({
        async authorize(credentials) {
          console.warn(
            "[Auth] Credentials provider not available without database setup"
          );
          return null;
        },
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret",
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60,
    },
  };
}

export { authConfig };
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
