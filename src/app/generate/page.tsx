'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Sparkles, ChevronRight, Wand2, Zap, Globe } from 'lucide-react';
import api from '@/lib/axios';
import Toast from '@/components/Toast';

function GeneratingOverlay() {
  return (
    <div className="fixed inset-0 bg-gray-950/90 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="text-center space-y-6 animate-scale-in">
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
        images: images.filter(Boolean),
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

  const inputClass = "w-full px-4 py-3.5 bg-gray-900/50 border border-gray-800 rounded-2xl text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200 text-sm hover:border-gray-700";
  const labelClass = "block text-sm font-semibold text-gray-400 mb-2.5 ml-1";

  return (
    <>
      {isGenerating && <GeneratingOverlay />}

      <div className="max-w-4xl mx-auto pb-20">
        {/* Header */}
        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Create New Sales Page</h1>
          </div>
          <p className="text-gray-400 max-w-lg leading-relaxed">
            Provide details about your product, and our AI will engineer a high-converting sales experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Basic Info */}
          <section className="glass-card p-8 space-y-8 animate-fade-in-up delay-100">
            <div className="flex items-center gap-3 pb-6 border-b border-white/5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white">Project Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <label htmlFor="product-name" className={labelClass}>Product Name</label>
                <input id="product-name" type="text" value={form.product_name} onChange={set('product_name')} required
                  placeholder="e.g. SalesFlow AI" className={inputClass} />
              </div>
              <div>
                <label htmlFor="language" className={labelClass}>Language</label>
                <select id="language" value={form.language} onChange={set('language')} className={inputClass}>
                  <option value="en">English (EN)</option>
                  <option value="id">Indonesian (ID)</option>
                </select>
              </div>
              <div>
                <label htmlFor="currency" className={labelClass}>Currency</label>
                <select id="currency" value={form.currency} onChange={set('currency')} className={inputClass}>
                  <option value="USD">USD ($)</option>
                  <option value="IDR">IDR (Rp)</option>
                </select>
              </div>
              <div>
                <label htmlFor="price" className={labelClass}>Price Point</label>
                <div className="relative">
                  <input id="price" type="number" value={form.price} onChange={set('price')}
                    placeholder="99" min="0" step="0.01" className={inputClass} />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="product-description" className={labelClass}>Value Proposition</label>
              <textarea id="product-description" value={form.product_description} onChange={set('product_description')} required rows={4}
                placeholder="What makes your product special? What problem does it solve for your users?"
                className={inputClass + " resize-none leading-relaxed"} />
            </div>

            <div>
              <label htmlFor="target-audience" className={labelClass}>Ideal Customer</label>
              <input id="target-audience" type="text" value={form.target_audience} onChange={set('target_audience')} required
                placeholder="e.g. Solopreneurs, Digital Marketers, Remote Teams" className={inputClass} />
            </div>
          </section>

          {/* Features & USP in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up delay-200">
            {/* Features */}
            <section className="glass-card p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  Key Features
                </h3>
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-gray-500 font-bold uppercase tracking-wider">Functional</span>
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
                <Plus className="w-4 h-4" /> Add Another Feature
              </button>
            </section>

            {/* USP */}
            <section className="glass-card p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  Unique Selling Points
                </h3>
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-gray-500 font-bold uppercase tracking-wider">Competitive</span>
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
                <Plus className="w-4 h-4" /> Add Another USP
              </button>
            </section>
          </div>

          {/* Product Visuals */}
          <section className="glass-card p-8 space-y-6 animate-fade-in-up delay-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                Product Visuals
              </h3>
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-gray-500 font-bold uppercase tracking-wider">Multimedia</span>
            </div>
            <div className="space-y-4">
              {images.map((img, i) => (
                <div key={i} className="group relative">
                  <input value={img} onChange={e => updateList(images, setImages, i, e.target.value)}
                    placeholder={i === 0 ? "Main Image URL (Hero)" : `Additional Image URL ${i + 1}`} 
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
              <Plus className="w-4 h-4" /> Add Another Image
            </button>
          </section>

          {/* Template Selection */}
          <section className="glass-card p-8 space-y-8 animate-fade-in-up delay-300">
            <div className="flex items-center gap-3 pb-6 border-b border-white/5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Globe className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white">Visual Style</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { id: 'modern', label: 'Tech Modern', desc: 'Vibrant indigo & violet gradients', bg: 'from-indigo-600 to-violet-600' },
                { id: 'elegant', label: 'Premium Gold', desc: 'Warm amber & deep orange tones', bg: 'from-amber-500 to-orange-600' },
                { id: 'dark', label: 'Midnight Pro', desc: 'Sleek slate & monochromatic cool', bg: 'from-slate-700 to-gray-900' },
              ].map(t => (
                <label key={t.id} htmlFor={`template-${t.id}`}
                  className={`relative cursor-pointer group rounded-2xl p-6 border-2 transition-all duration-300 ${form.template_name === t.id ? 'border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/10' : 'border-white/5 hover:border-white/10 hover:bg-white/5'}`}>
                  <input id={`template-${t.id}`} type="radio" name="template" value={t.id}
                    checked={form.template_name === t.id} onChange={set('template_name')} className="sr-only" />

                  <div className={`h-24 rounded-xl bg-gradient-to-br ${t.bg} mb-6 shadow-lg group-hover:scale-105 transition-transform duration-500`} />
                  <p className="font-bold text-white mb-1">{t.label}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.desc}</p>

                  {form.template_name === t.id && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="pt-6 animate-fade-in-up delay-300">
            <button type="submit" id="generate-submit-btn" disabled={isGenerating}
              className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center justify-center gap-3 group">
              <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
              <span className="text-lg">Generate Sales Page with AI</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-gray-500 text-xs mt-6 flex items-center justify-center gap-2">
              <Zap className="w-3 h-3" />
              Powered by Gemini 2.0 Flash • High-fidelity output guaranteed
            </p>
          </div>
        </form>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
    </>
  );
}
