/**
 * Settings Page
 * Manage CMS settings and configuration
 */

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import Settings from '@/components/cms/layout/Settings';

export const metadata = {
  title: 'Settings - MQ Studio CMS',
  description: 'Manage CMS settings and configuration',
};

export default async function SettingsPage() {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    redirect('/studio/login');
  }

  // Cast to full User type (with id, role, createdAt, updatedAt added by session callback)
  const user = session.user as any;
  return <Settings user={user} />;
}
