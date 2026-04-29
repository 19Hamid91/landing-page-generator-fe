import { AiOutput, TemplateName } from '@/types';
import { Check, Zap } from 'lucide-react';

interface PreviewRendererProps {
  aiOutput: AiOutput;
  template: TemplateName;
  productName: string;
  price?: string | null;
}

/* ─── MODERN TEMPLATE ─────────────────────────────────────────────────── */
function ModernTemplate({ aiOutput, productName, price }: PreviewRendererProps) {
  return (
    <div className="font-sans bg-gradient-to-br from-indigo-950 via-gray-900 to-violet-950 min-h-screen text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.15)_0%,_transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-4 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            {productName}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-indigo-100 to-violet-300 bg-clip-text text-transparent">
            {aiOutput.headline}
          </h1>
          <p className="text-lg text-indigo-200/80 mb-8">{aiOutput.sub_headline}</p>
          <p className="text-base text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">{aiOutput.description}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 rounded-xl font-bold text-white shadow-xl shadow-indigo-500/30 transition-all">
              {aiOutput.cta_text}
            </button>
            {price && <span className="text-2xl font-bold text-indigo-300">${Number(price).toLocaleString()}</span>}
          </div>
        </div>
      </section>

      {/* Benefits */}
      {aiOutput.benefits?.length > 0 && (
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 text-white">Why choose us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {aiOutput.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="text-gray-200 text-sm">{b}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features Breakdown */}
      {aiOutput.features_breakdown?.length > 0 && (
        <section className="px-6 py-16 bg-indigo-950/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10 text-white">Powerful Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {aiOutput.features_breakdown.map((f, i) => (
                <div key={i} className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-violet-900/30 border border-indigo-700/30">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-3">
                    <Zap className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-1.5">{f.feature}</h3>
                  <p className="text-sm text-gray-400">{f.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-8">Join thousands who already transformed their business.</p>
          <button className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl font-bold text-white shadow-xl shadow-indigo-500/30 hover:scale-105 transition-transform">
            {aiOutput.cta_text}
          </button>
        </div>
      </section>
    </div>
  );
}

/* ─── ELEGANT TEMPLATE ────────────────────────────────────────────────── */
function ElegantTemplate({ aiOutput, productName, price }: PreviewRendererProps) {
  return (
    <div className="font-sans bg-amber-50 text-gray-800 min-h-screen">
      <section className="px-6 py-24 text-center bg-gradient-to-b from-amber-100 to-amber-50">
        <p className="text-xs tracking-[0.3em] uppercase text-amber-600 font-semibold mb-6">{productName}</p>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-6 max-w-3xl mx-auto leading-tight">
          {aiOutput.headline}
        </h1>
        <p className="text-xl text-amber-700 font-medium mb-8 max-w-2xl mx-auto">{aiOutput.sub_headline}</p>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">{aiOutput.description}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-amber-500/30">
            {aiOutput.cta_text}
          </button>
          {price && <span className="text-xl font-bold text-amber-700">${Number(price).toLocaleString()}</span>}
        </div>
      </section>

      {aiOutput.benefits?.length > 0 && (
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {aiOutput.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-5 rounded-xl border border-amber-200 bg-white shadow-sm">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="text-gray-700 text-sm">{b}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {aiOutput.features_breakdown?.length > 0 && (
        <section className="px-6 py-16 bg-amber-100/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-center mb-10 text-gray-900">What&apos;s Inside</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {aiOutput.features_breakdown.map((f, i) => (
                <div key={i} className="p-5 rounded-xl bg-white border border-amber-200 shadow-sm">
                  <h3 className="font-bold text-amber-800 mb-2">{f.feature}</h3>
                  <p className="text-sm text-gray-600">{f.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-20 text-center bg-amber-600">
        <h2 className="text-3xl font-serif font-bold text-white mb-4">Start Today</h2>
        <p className="text-amber-100 mb-8">Experience the difference quality makes.</p>
        <button className="px-10 py-4 bg-white text-amber-700 font-bold rounded-lg hover:bg-amber-50 transition-colors shadow-lg">
          {aiOutput.cta_text}
        </button>
      </section>
    </div>
  );
}

/* ─── DARK TEMPLATE ───────────────────────────────────────────────────── */
function DarkTemplate({ aiOutput, productName, price }: PreviewRendererProps) {
  return (
    <div className="font-sans bg-gray-950 text-gray-100 min-h-screen">
      <section className="px-6 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(51,65,85,0.4)_0%,_transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block text-xs tracking-widest uppercase text-slate-400 mb-6 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700">
            {productName}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 text-white">
            {aiOutput.headline}
          </h1>
          <p className="text-lg text-slate-400 mb-8">{aiOutput.sub_headline}</p>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">{aiOutput.description}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-bold transition-colors shadow-xl">
              {aiOutput.cta_text}
            </button>
            {price && <span className="text-2xl font-bold text-slate-300">${Number(price).toLocaleString()}</span>}
          </div>
        </div>
      </section>

      {aiOutput.benefits?.length > 0 && (
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {aiOutput.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-slate-300" />
                </div>
                <p className="text-slate-300 text-sm">{b}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {aiOutput.features_breakdown?.length > 0 && (
        <section className="px-6 py-16 bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10 text-white">Core Capabilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {aiOutput.features_breakdown.map((f, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mb-3">
                    <Zap className="w-4 h-4 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-1.5">{f.feature}</h3>
                  <p className="text-sm text-slate-500">{f.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-20 text-center border-t border-slate-800">
        <h2 className="text-3xl font-extrabold mb-4 text-white">Take the leap.</h2>
        <p className="text-slate-500 mb-8">No fluff. Just results.</p>
        <button className="px-10 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-xl">
          {aiOutput.cta_text}
        </button>
      </section>
    </div>
  );
}

/* ─── Main Renderer ───────────────────────────────────────────────────── */
export default function PreviewRenderer(props: PreviewRendererProps) {
  const { template } = props;
  if (template === 'elegant') return <ElegantTemplate {...props} />;
  if (template === 'dark') return <DarkTemplate {...props} />;
  return <ModernTemplate {...props} />;
}
