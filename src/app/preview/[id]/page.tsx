'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Palette, Sparkles, Eye } from 'lucide-react';
import api from '@/lib/axios';
import { SalesPage, TemplateName } from '@/types';
import PreviewRenderer from '@/components/PreviewRenderer';
import { useAuth } from '@/context/AuthContext';

const templates: { id: TemplateName; label: string; emoji: string }[] = [
  { id: 'modern', label: 'Modern', emoji: '🟣' },
  { id: 'elegant', label: 'Elegant', emoji: '🟡' },
  { id: 'dark', label: 'Dark', emoji: '⚫' },
];

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const [page, setPage] = useState<SalesPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState<TemplateName>('modern');
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !token) { router.replace('/login'); return; }
    if (!authLoading && token) {
      api.get(`/sales-pages/${params.id}`)
        .then(res => {
          const data: SalesPage = res.data.data;
          setPage(data);
          setActiveTemplate((data.template_name as TemplateName) || 'modern');
        })
        .catch(() => router.replace('/dashboard'))
        .finally(() => setIsLoading(false));
    }
  }, [params.id, token, authLoading, router]);

  const handleExport = () => {
    if (!previewRef.current || !page) return;
    setIsExporting(true);
    try {
      const content = previewRef.current.innerHTML;
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${page.product_name} - Sales Page</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body>${content}</body>
</html>`;
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${page.product_name.replace(/\s+/g, '-').toLowerCase()}-sales-page.html`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading preview…</p>
        </div>
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Toolbar */}
      <div className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50">
        <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
          {/* Back */}
          <button id="back-to-dashboard-btn" onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mr-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          {/* Title */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-white text-sm truncate">{page.product_name}</span>
          </div>

          {/* Template Selector */}
          <div className="flex items-center gap-1.5 bg-gray-800/60 rounded-xl p-1">
            <Palette className="w-3.5 h-3.5 text-gray-500 ml-2" />
            {templates.map(t => (
              <button key={t.id} id={`template-${t.id}-btn`} onClick={() => setActiveTemplate(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  activeTemplate === t.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                }`}>
                <span>{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Preview badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5">
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </div>

          {/* Export */}
          <button id="export-html-btn" onClick={handleExport} disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:opacity-50">
            {isExporting
              ? <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
              : <Download className="w-3.5 h-3.5" />}
            Export HTML
          </button>
        </div>
      </div>

      {/* Preview iframe-like container */}
      <div className="flex-1 overflow-auto">
        <div ref={previewRef} className="min-h-full">
          <PreviewRenderer
            aiOutput={page.ai_output}
            template={activeTemplate}
            productName={page.product_name}
            price={page.price}
            images={page.images}
            currency={page.currency}
          />
        </div>
      </div>
    </div>
  );
}
