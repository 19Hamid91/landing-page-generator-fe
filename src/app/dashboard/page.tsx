'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Trash2, Eye, Wand2, Calendar, Tag } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Saved Sales Pages</h1>
          <p className="text-gray-400 text-sm mt-1">
            {pages.length} page{pages.length !== 1 ? 's' : ''} generated
          </p>
        </div>
        <Link
          href="/generate"
          id="new-page-btn"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
        >
          <Plus className="w-4 h-4" />
          Generate New Page
        </Link>
      </div>

      {/* Stats row */}
      {!isLoading && pages.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Pages', value: pages.length, color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20' },
            { label: 'This Month', value: pages.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).length, color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20' },
            { label: 'Templates Used', value: [...new Set(pages.map(p => p.template_name))].length, color: 'from-pink-500/20 to-pink-600/10 border-pink-500/20' },
          ].map(stat => (
            <div key={stat.label} className={`rounded-xl bg-gradient-to-br ${stat.color} border p-4`}>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gray-800/60 flex items-center justify-center mb-6 animate-float">
            <Wand2 className="w-9 h-9 text-indigo-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-200 mb-2">No pages yet</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-xs">
            Create your first AI-powered sales page and watch it convert.
          </p>
          <Link href="/generate"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all duration-200">
            <Plus className="w-4 h-4" /> Generate First Page
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pages.map((page, i) => (
            <div
              key={page.id}
              className="glass-card gradient-border p-6 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Title */}
              <div className="flex items-start justify-between gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-indigo-400" />
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${templateColors[page.template_name] ?? templateColors.modern}`}>
                  {page.template_name}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-100 truncate">{page.product_name}</h3>
                {page.ai_output?.headline && (
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{page.ai_output.headline}</p>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(page.created_at).toLocaleDateString()}
                </span>
                {page.price && (
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    ${Number(page.price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-800/50">
                <button
                  id={`view-page-${page.id}`}
                  onClick={() => router.push(`/preview/${page.id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-all duration-200"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button
                  id={`delete-page-${page.id}`}
                  onClick={() => handleDelete(page.id)}
                  disabled={deletingId === page.id}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  {deletingId === page.id
                    ? <div className="w-3.5 h-3.5 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                    : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
