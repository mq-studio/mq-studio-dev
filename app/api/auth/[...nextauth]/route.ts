import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/config';

const handler = NextAuth(authConfig);

// Force dynamic rendering for authentication (session-specific, requires runtime evaluation)
export const dynamic = 'force-dynamic';

export { handler as GET, handler as POST };