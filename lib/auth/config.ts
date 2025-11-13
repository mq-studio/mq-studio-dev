import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

// Extend the built-in session types
declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    }
  }
}

// Simple auth config for development
export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Development-only simple auth
        // In production, use database
        const validEmail = process.env.ADMIN_EMAIL || 'admin@mq-studio.com';
        const validPasswordHash = process.env.ADMIN_PASSWORD_HASH ||
          '$2b$12$2s0jjB7BtEMqxbEIHTaWEeRAop6YJLR0JyTIVgyf2LXh/bZcw6qfK'; // "changeme"

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (credentials.email === validEmail) {
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            validPasswordHash
          );

          if (passwordMatch) {
            return {
              id: '1',
              email: credentials.email,
              name: 'Admin User',
            };
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/studio/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-change-in-production',
};