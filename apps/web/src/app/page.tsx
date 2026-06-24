import { redirect } from 'next/navigation';

// Root page: redirect to dashboard (middleware will bounce unauthenticated users to /login)
export default function RootPage() {
  redirect('/dashboard');
}
