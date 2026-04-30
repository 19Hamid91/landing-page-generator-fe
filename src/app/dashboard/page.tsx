'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Trash2, Eye, Wand2, Calendar, Tag, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { SalesPage } from '@/types';

function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-1/2" />
      <div className="flex gap-2 mt-4">
        <div className="skeleton h-8 w-20 rounded-lg" />
        <div className="skeleton h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

const templateColors: Record<string, string> = {
  modern: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  elegant: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  dark: 'bg-gray-500/10 text-gray-300 border-gray-500/20',
};

export default function DashboardPage() {
  const [pages, setPages] = useState<SalesPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const fetchPages = useCallback(async () => {
    try {
      const res = await api.get('/sales-pages');
      setPages(res.data.data);
    } catch {
      // handled by axios interceptor
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this sales page?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/sales-pages/${id}`);
      setPages(prev => prev.filter(p => p.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Welcome back, {user?.name?.split(' ')[0]}!</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Your Workspace</h1>
          <p className="text-gray-400 mt-2">
            Manage your AI-generated sales pages and track their performance.
          </p>
        </div>
        <Link
          href="/generate"
          id="new-page-btn"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Create New Page
        </Link>
      </div>

      {/* Stats row */}
      {!isLoading && pages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in-up delay-100">
          {[
            { label: 'Total Projects', value: pages.length, icon: FileText, color: 'from-indigo-500/10 to-indigo-600/5', border: 'border-indigo-500/20' },
            { label: 'This Month', value: pages.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).length, icon: Calendar, color: 'from-purple-500/10 to-purple-600/5', border: 'border-purple-500/20' },
            { label: 'Design Styles', value: [...new Set(pages.map(p => p.template_name))].length, icon: Tag, color: 'from-pink-500/10 to-pink-600/5', border: 'border-pink-500/20' },
          ].map((stat, i) => (
            <div key={stat.label} className={`glass-card p-6 flex items-center gap-5 border ${stat.border}`}>
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-white/70" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="animate-fade-in-up delay-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Projects</h2>
          {pages.length > 0 && (
            <div className="h-px flex-1 bg-white/5 mx-6" />
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : pages.length === 0 ? (
          <div className="glass-card p-16 flex flex-col items-center justify-center text-center border-dashed border-white/10">
            <div className="w-24 h-24 rounded-3xl bg-indigo-500/10 flex items-center justify-center mb-8 animate-float">
              <Wand2 className="w-12 h-12 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No sales pages yet</h2>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">
              Your generated pages will appear here. Start by creating your first conversion-focused sales page.
            </p>
            <Link href="/generate"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all">
              <Plus className="w-5 h-5" /> Start First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page, i) => (
              <div
                key={page.id}
                className="glass-card p-6 flex flex-col gap-6 hover:translate-y-[-4px] group"
              >
                {/* Title & Template */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <FileText className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${templateColors[page.template_name] ?? templateColors.modern}`}>
                    {page.template_name}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white truncate">{page.product_name}</h3>
                  {page.ai_output?.headline && (
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{page.ai_output.headline}</p>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <button
                    id={`view-page-${page.id}`}
                    onClick={() => router.push(`/preview/${page.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 rounded-xl transition-all"
                  >
                    <Eye className="w-4 h-4" /> Preview
                  </button>
                  <button
                    id={`edit-page-${page.id}`}
                    onClick={() => router.push(`/dashboard/edit/${page.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold text-indigo-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                  >
                    <Wand2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    id={`delete-page-${page.id}`}
                    onClick={() => handleDelete(page.id)}
                    disabled={deletingId === page.id}
                    className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-50"
                  >
                    {deletingId === page.id
                      ? <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
