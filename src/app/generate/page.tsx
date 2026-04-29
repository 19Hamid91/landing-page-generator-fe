'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Sparkles, ChevronRight, Wand2 } from 'lucide-react';
import api from '@/lib/axios';

function GeneratingOverlay() {
  return (
    <div className="fixed inset-0 bg-gray-950/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-purple-500/40 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">AI is writing your copy…</h2>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            Gemini is crafting a high-converting sales page tailored to your product.
          </p>
        </div>
        {/* Shimmer steps */}
        <div className="space-y-2 text-left max-w-xs mx-auto">
          {['Analyzing product details', 'Crafting headline & copy', 'Building feature breakdowns', 'Finalizing benefits & CTA'].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
              <div className="skeleton h-4 flex-1 rounded" style={{ animationDelay: `${i * 0.2}s` }}>
                <span className="sr-only">{step}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [usp, setUsp] = useState<string[]>(['']);
  const [form, setForm] = useState({
    product_name: '',
    product_description: '',
    target_audience: '',
    price: '',
    template_name: 'modern',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsGenerating(true);
    try {
      const payload = {
        ...form,
        price: form.price ? Number(form.price) : undefined,
        features: features.filter(Boolean),
        usp: usp.filter(Boolean),
      };
      const res = await api.post('/sales-pages', payload);
      router.push(`/preview/${res.data.data.id}`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const errors = axiosErr?.response?.data?.errors;
      const msg = errors ? Object.values(errors).flat()[0] : axiosErr?.response?.data?.message || 'Generation failed.';
      setError(msg);
      setIsGenerating(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm";
  const labelClass = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <>
      {isGenerating && <GeneratingOverlay />}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Generate Sales Page</h1>
          </div>
          <p className="text-gray-400 text-sm ml-13">
            Fill in your product details and let Gemini AI write compelling copy.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="glass-card gradient-border p-6 space-y-5">
            <h2 className="font-semibold text-gray-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold">1</span>
              Product Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="product-name" className={labelClass}>Product Name *</label>
                <input id="product-name" type="text" value={form.product_name} onChange={set('product_name')} required
                  placeholder="e.g. ProBoost CRM" className={inputClass} />
              </div>
              <div>
                <label htmlFor="price" className={labelClass}>Price (optional)</label>
                <input id="price" type="number" value={form.price} onChange={set('price')}
                  placeholder="e.g. 97" min="0" step="0.01" className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="product-description" className={labelClass}>Product Description *</label>
              <textarea id="product-description" value={form.product_description} onChange={set('product_description')} required rows={3}
                placeholder="Describe what your product does and the problem it solves..."
                className={inputClass + " resize-none"} />
            </div>

            <div>
              <label htmlFor="target-audience" className={labelClass}>Target Audience *</label>
              <input id="target-audience" type="text" value={form.target_audience} onChange={set('target_audience')} required
                placeholder="e.g. Freelancers, SaaS founders, E-commerce owners" className={inputClass} />
            </div>
          </div>

          {/* Features */}
          <div className="glass-card gradient-border p-6 space-y-4">
            <h2 className="font-semibold text-gray-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-bold">2</span>
              Key Features
            </h2>
            {features.map((feat, i) => (
              <div key={i} className="flex gap-2">
                <input value={feat} onChange={e => updateList(features, setFeatures, i, e.target.value)}
                  placeholder={`Feature ${i + 1}`} className={inputClass + " flex-1"} />
                {features.length > 1 && (
                  <button type="button" onClick={() => removeItem(features, setFeatures, i)}
                    className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addItem(features, setFeatures)}
              className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              <Plus className="w-4 h-4" /> Add Feature
            </button>
          </div>

          {/* USP */}
          <div className="glass-card gradient-border p-6 space-y-4">
            <h2 className="font-semibold text-gray-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 text-xs flex items-center justify-center font-bold">3</span>
              Unique Selling Points (USP)
            </h2>
            {usp.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input value={item} onChange={e => updateList(usp, setUsp, i, e.target.value)}
                  placeholder={`USP ${i + 1}`} className={inputClass + " flex-1"} />
                {usp.length > 1 && (
                  <button type="button" onClick={() => removeItem(usp, setUsp, i)}
                    className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addItem(usp, setUsp)}
              className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              <Plus className="w-4 h-4" /> Add USP
            </button>
          </div>

          {/* Template */}
          <div className="glass-card gradient-border p-6 space-y-4">
            <h2 className="font-semibold text-gray-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">4</span>
              Template Style
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'modern', label: 'Modern', desc: 'Indigo & violet', bg: 'from-indigo-600 to-violet-600' },
                { id: 'elegant', label: 'Elegant', desc: 'Amber & warm', bg: 'from-amber-500 to-orange-600' },
                { id: 'dark', label: 'Dark', desc: 'Slate & cool', bg: 'from-slate-600 to-gray-700' },
              ].map(t => (
                <label key={t.id} htmlFor={`template-${t.id}`}
                  className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 ${form.template_name === t.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
                  <input id={`template-${t.id}`} type="radio" name="template" value={t.id}
                    checked={form.template_name === t.id} onChange={set('template_name')} className="sr-only" />
                  <div className={`h-8 rounded-lg bg-gradient-to-r ${t.bg} mb-3`} />
                  <p className="text-sm font-medium text-gray-200">{t.label}</p>
                  <p className="text-xs text-gray-500">{t.desc}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" id="generate-submit-btn" disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center justify-center gap-2 text-sm">
            <Sparkles className="w-4 h-4" />
            Generate with AI
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
}
