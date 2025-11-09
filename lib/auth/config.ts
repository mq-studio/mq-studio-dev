/**
 * NextAuth Configuration
 * Handles authentication for CMS access with secure password hashing
 */

import type { NextAuthOptions, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { comparePassword } from '@/lib/utils/password';
import { validateEmail } from '@/lib/utils/validation';
import type { User } from '@/lib/types/cms';

// Validate that NEXTAUTH_SECRET is set
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
if (!NEXTAUTH_SECRET) {
  throw new Error(
    'NEXTAUTH_SECRET environment variable is required. Please set it in your .env.local file.'
  );
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// Validate required environment variables
if (!ADMIN_EMAIL) {
  throw new Error('ADMIN_EMAIL environment variable is required');
}

if (!ADMIN_PASSWORD_HASH) {
  throw new Error('ADMIN_PASSWORD_HASH environment variable is required. Hash your password using bcrypt.');
}

if (!validateEmail(ADMIN_EMAIL)) {
  throw new Error('ADMIN_EMAIL is not a valid email address');
}

// Type definitions for callbacks
interface AuthorizeCredentials {
  email?: string;
  password?: string;
}

// Extend NextAuth Session types with CMS User
declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'editor' | 'viewer';
    createdAt: Date;
    updatedAt: Date;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'editor' | 'viewer';
    createdAt: Date;
    updatedAt: Date;
  }
}

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: AuthorizeCredentials | undefined) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Validate email format
        if (!validateEmail(credentials.email)) {
          return null;
        }

        // Check credentials against admin account
        if (credentials.email === ADMIN_EMAIL) {
          try {
            const passwordMatch = await comparePassword(
              credentials.password,
              ADMIN_PASSWORD_HASH
            );

            if (passwordMatch) {
              const now = new Date();
              return {
                id: '1',
                email: credentials.email,
                name: 'Admin',
                role: 'admin',
                createdAt: now,
                updatedAt: now,
              };
            }
          } catch (error) {
            console.error('Password comparison failed:', error);
            return null;
          }
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/studio/login',
    error: '/studio/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role || 'editor';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as any;
        sessionUser.id = token.id;
        sessionUser.email = token.email;
        sessionUser.name = token.name;
        sessionUser.role = token.role || 'editor';
        sessionUser.createdAt = token.createdAt;
        sessionUser.updatedAt = token.updatedAt;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: NEXTAUTH_SECRET,
};
