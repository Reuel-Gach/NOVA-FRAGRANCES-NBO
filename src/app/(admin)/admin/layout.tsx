import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We must AWAIT the auth() function in Next.js 16
  const { userId } = await auth();

  // If no user is found, redirect to sign-in
  if (!userId) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}