'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Plus, X, Sparkles, ChevronRight, Wand2, Zap, Globe,
  ArrowLeft, Save, CheckCircle2, AlertCircle, Copy, Check
} from 'lucide-react';
import api from '@/lib/axios';
import { SalesPage, AiOutput } from '@/types';
import PreviewRenderer from '@/components/PreviewRenderer';
import Toast from '@/components/Toast';

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-gray-400 animate-pulse font-medium">Retrieving your project data...</p>
    </div>
  );
}

function GeneratingOverlay({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 bg-gray-950/90 backdrop-blur-md z-[100] flex items-center justify-center animate-fade-in">
      <div className="text-center space-y-8 max-w-md px-6 animate-scale-in">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-purple-500/40 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white tracking-tight">{message}</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Our AI is analyzing your updates to engineer a higher-converting sales copy.
          </p>
        </div>
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EditSalesPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data states
  const [originalPage, setOriginalPage] = useState<SalesPage | null>(null);
  const [features, setFeatures] = useState<string[]>(['']);
  const [usp, setUsp] = useState<string[]>(['']);
  const [images, setImages] = useState<string[]>(['']);
  const [form, setForm] = useState({
    product_name: '',
    product_description: '',
    target_audience: '',
    price: '',
    language: 'en',
    currency: 'USD',
    template_name: 'modern',
  });

  // AI Preview states
  const [newAiOutput, setNewAiOutput] = useState<AiOutput | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [activePreview, setActivePreview] = useState<'old' | 'new'>('new');

  useEffect(() => {
    const fetchPage = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/sales-pages/${id}`);
        const page: SalesPage = res.data.data;
        setOriginalPage(page);
        setForm({
          product_name: page.product_name,
          product_description: page.product_description,
          target_audience: page.target_audience,
          price: page.price?.toString() || '',
          language: page.language,
          currency: page.currency,
          template_name: page.template_name,
        });
        setFeatures(page.features?.length > 0 ? page.features : ['']);
        setUsp(page.usp?.length > 0 ? page.usp : ['']);
        setImages(page.images?.length > 0 ? page.images : ['']);
      } catch (err: any) {
        console.error('Error loading sales page:', err);
        setError(err.response?.data?.message || 'Failed to load project data. Please ensure the project exists.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPage();
  }, [id]);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const updateList = (list: string[], setList: (v: string[]) => void, idx: number, val: string) => {
    const updated = [...list];
    updated[idx] = val;
    setList(updated);
  };

  const addItem = (list: string[], setList: (v: string[]) => void) => setList([...list, '']);
  const removeItem = (list: string[], setList: (v: string[]) => void, idx: number) =>
    setList(list.filter((_, i) => i !== idx));

  const handleRegenerate = async () => {
    setError('');
    setIsGenerating(true);
    try {
      const payload = {
        ...form,
        price: form.price ? Number(form.price) : undefined,
        features: features.filter(Boolean),
        usp: usp.filter(Boolean),
        images: images.filter(Boolean),
      };
      const res = await api.post(`/sales-pages/${id}/generate`, payload);
      setNewAiOutput(res.data.data);
      setShowComparison(true);
      setActivePreview('new');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate preview.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (confirmedAiOutput?: AiOutput) => {
    setError('');
    setSuccess('');
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        price: form.price ? Number(form.price) : undefined,
        features: features.filter(Boolean),
        usp: usp.filter(Boolean),
        images: images.filter(Boolean),
        ai_output: confirmedAiOutput || originalPage?.ai_output,
      };
      const res = await api.put(`/sales-pages/${id}`, payload);
      setOriginalPage(res.data.data);
      setShowComparison(false);
      setSuccess('Project updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 bg-gray-900/50 border border-gray-800 rounded-2xl text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200 text-sm hover:border-gray-700";
  const labelClass = "block text-sm font-semibold text-gray-400 mb-2.5 ml-1";

  if (isLoading) return <LoadingState />;

  return (
    <>
      {isGenerating && <GeneratingOverlay message="Regenerating Sales Copy..." />}
      {isSaving && <GeneratingOverlay message="Saving Your Changes..." />}

      {/* Comparison Modal */}
      {showComparison && newAiOutput && originalPage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
          <div className="absolute inset-0 bg-gray-950/95 backdrop-blur-xl" />

          <div className="relative w-full max-w-7xl h-full flex flex-col bg-gray-900/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gray-900/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Compare AI Generations</h3>
                  <p className="text-xs text-gray-400">Choose the version that converts best for your product.</p>
                </div>
              </div>
              <button
                onClick={() => setShowComparison(false)}
                className="p-2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Version Switcher */}
            <div className="flex p-2 bg-black/20 m-6 rounded-2xl self-center border border-white/5">
              <button
                onClick={() => setActivePreview('old')}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activePreview === 'old' ? 'bg-white/10 text-white shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <AlertCircle className="w-4 h-4" /> Original Version
              </button>
              <button
                onClick={() => setActivePreview('new')}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activePreview === 'new' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <Sparkles className="w-4 h-4" /> New AI Generation
              </button>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-y-auto bg-gray-950 p-4 mx-6 mb-6 rounded-2xl border border-white/5 custom-scrollbar">
              <PreviewRenderer
                aiOutput={activePreview === 'new' ? (newAiOutput as AiOutput) : (originalPage.ai_output as AiOutput)}
                template={form.template_name as any}
                productName={form.product_name}
                price={form.price}
                images={images.filter(Boolean)}
                currency={form.currency}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/5 bg-gray-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500 italic">
                * Choosing "Apply New Version" will overwrite your previous AI content.
              </p>
              <div className="flex gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setShowComparison(false)}
                  className="flex-1 sm:flex-none px-6 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave(activePreview === 'new' ? newAiOutput : originalPage.ai_output)}
                  className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {activePreview === 'new' ? 'Apply New Version' : 'Keep Original & Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto pb-20">
        {/* Breadcrumbs & Navigation */}
        <div className="mb-10 flex items-center justify-between animate-fade-in-up">
          <button
            onClick={() => router.push('/dashboard')}
            className="group flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Editing Mode</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-12 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Edit Project</h1>
                <p className="text-gray-400 text-sm">Refine details and optimize conversions for <span className="text-indigo-400 font-semibold">{originalPage?.product_name}</span></p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRegenerate}
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all flex items-center gap-2 text-sm group"
              >
                <Sparkles className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                Regenerate AI Copy
              </button>
              <button
                onClick={() => handleSave()}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 text-sm"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Basic Info */}
          <section className="glass-card p-8 space-y-8 animate-fade-in-up delay-100">
            <div className="flex items-center gap-3 pb-6 border-b border-white/5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Globe className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white">Project Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <label className={labelClass}>Product Name</label>
                <input type="text" value={form.product_name} onChange={set('product_name')} required
                  placeholder="e.g. SalesFlow AI" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Language</label>
                <select value={form.language} onChange={set('language')} className={inputClass}>
                  <option value="en">English (EN)</option>
                  <option value="id">Indonesian (ID)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Currency</label>
                <select value={form.currency} onChange={set('currency')} className={inputClass}>
                  <option value="USD">USD ($)</option>
                  <option value="IDR">IDR (Rp)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Price Point</label>
                <input type="number" value={form.price} onChange={set('price')}
                  placeholder="99" min="0" step="0.01" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Value Proposition</label>
              <textarea value={form.product_description} onChange={set('product_description')} required rows={4}
                placeholder="What makes your product special?"
                className={inputClass + " resize-none leading-relaxed"} />
            </div>

            <div>
              <label className={labelClass}>Ideal Customer</label>
              <input type="text" value={form.target_audience} onChange={set('target_audience')} required
                placeholder="e.g. Solopreneurs" className={inputClass} />
            </div>
          </section>

          {/* Features & USP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up delay-200">
            <section className="glass-card p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  Key Features
                </h3>
              </div>
              <div className="space-y-4">
                {features.map((feat, i) => (
                  <div key={i} className="group relative">
                    <input value={feat} onChange={e => updateList(features, setFeatures, i, e.target.value)}
                      placeholder={`Feature ${i + 1}`} className={inputClass} />
                    {features.length > 1 && (
                      <button type="button" onClick={() => removeItem(features, setFeatures, i)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addItem(features, setFeatures)}
                className="w-full py-3 border-2 border-dashed border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 rounded-2xl text-xs font-bold text-gray-500 hover:text-indigo-400 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Feature
              </button>
            </section>

            <section className="glass-card p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  Unique Selling Points
                </h3>
              </div>
              <div className="space-y-4">
                {usp.map((item, i) => (
                  <div key={i} className="group relative">
                    <input value={item} onChange={e => updateList(usp, setUsp, i, e.target.value)}
                      placeholder={`USP ${i + 1}`} className={inputClass} />
                    {usp.length > 1 && (
                      <button type="button" onClick={() => removeItem(usp, setUsp, i)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addItem(usp, setUsp)}
                className="w-full py-3 border-2 border-dashed border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 rounded-2xl text-xs font-bold text-gray-500 hover:text-indigo-400 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add USP
              </button>
            </section>
          </div>

          {/* Product Visuals */}
          <section className="glass-card p-8 space-y-6 animate-fade-in-up delay-200">
            <h3 className="font-bold text-white flex items-center gap-2 pb-4 border-b border-white/5">
              <Globe className="w-4 h-4 text-blue-400" />
              Product Visuals
            </h3>
            <div className="space-y-4">
              {images.map((img, i) => (
                <div key={i} className="group relative">
                  <input value={img} onChange={e => updateList(images, setImages, i, e.target.value)}
                    placeholder={i === 0 ? "Main Image URL" : `Additional Image URL ${i + 1}`}
                    className={inputClass} />
                  {images.length > 1 && (
                    <button type="button" onClick={() => removeItem(images, setImages, i)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => addItem(images, setImages)}
              className="w-full py-3 border-2 border-dashed border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 rounded-2xl text-xs font-bold text-gray-500 hover:text-blue-400 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Image
            </button>
          </section>

          {/* Visual Style */}
          <section className="glass-card p-8 space-y-8 animate-fade-in-up delay-300">
            <h2 className="text-xl font-bold text-white pb-6 border-b border-white/5 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Visual Style
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { id: 'modern', label: 'Tech Modern', bg: 'from-indigo-600 to-violet-600' },
                { id: 'elegant', label: 'Premium Gold', bg: 'from-amber-500 to-orange-600' },
                { id: 'dark', label: 'Midnight Pro', bg: 'from-slate-700 to-gray-900' },
              ].map(t => (
                <label key={t.id}
                  className={`relative cursor-pointer group rounded-2xl p-6 border-2 transition-all duration-300 ${form.template_name === t.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/5 hover:border-white/10'}`}>
                  <input type="radio" name="template" value={t.id}
                    checked={form.template_name === t.id} onChange={set('template_name')} className="sr-only" />
                  <div className={`h-20 rounded-xl bg-gradient-to-br ${t.bg} mb-4`} />
                  <p className="font-bold text-white text-sm">{t.label}</p>
                </label>
              ))}
            </div>
          </section>

          {/* Bottom Actions */}
          <div className="pt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
            <button
              onClick={handleRegenerate}
              className="flex-1 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 group"
            >
              <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
              Regenerate AI Content
            </button>
            <button
              onClick={() => handleSave()}
              className="flex-1 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3"
            >
              <Save className="w-5 h-5" />
              Save All Changes
            </button>
          </div>
        </div>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess('')} />}
    </>
  );
}
