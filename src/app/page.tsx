'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      router.replace(token ? '/dashboard' : '/login');
    }
  }, [token, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
