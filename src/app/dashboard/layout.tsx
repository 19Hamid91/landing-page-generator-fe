'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/login');
    }
  }, [token, isLoading, router]);

  if (isLoading || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950 selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="mesh-bg" />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-4 border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-20">
          <button
            id="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">SalesAI</span>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
