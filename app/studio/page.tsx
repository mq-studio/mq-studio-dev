import { redirect } from 'next/navigation';

export default function StudioPage() {
  // For now, always redirect to login
  // In production, this would check session first
  redirect('/studio/login');
}