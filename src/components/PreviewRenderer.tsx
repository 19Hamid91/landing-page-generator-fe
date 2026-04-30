import { AiOutput, TemplateName } from '@/types';
import { Check, Zap, Star, Shield, ArrowRight, Play, Award, Rocket } from 'lucide-react';

interface PreviewRendererProps {
   aiOutput: AiOutput;
   template: TemplateName;
   productName: string;
   price?: string | null;
   images?: string[];
   currency?: string;
}

function formatPrice(price: string | number | null | undefined, currency?: string) {
   if (!price) return null;
   const amount = Number(price);
   if (currency === 'IDR') {
      return `Rp ${amount.toLocaleString('id-ID')}`;
   }
   return `$${amount.toLocaleString('en-US')}`;
}

function ImageGallery({ images, title, dark = false }: { images: string[], title: string, dark?: boolean }) {
   if (!images || images.length === 0) return null;
   return (
      <section className={`px-6 py-16 ${dark ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
         <div className="max-w-6xl mx-auto">
            <h2 className={`text-xl font-bold mb-10 ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {images.map((img, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
                     <img src={img} alt={`${title} ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}

/* ─── MODERN TEMPLATE (High-Tech SaaS) ────────────────────────────────── */
function ModernTemplate({ aiOutput, productName, price, images = [], currency }: PreviewRendererProps) {
   const mainImage = images[0];
   const otherImages = images.slice(1);

   return (
      <div className="font-sans bg-gray-950 text-white selection:bg-indigo-500/30 selection:text-indigo-200">
         <section className="relative px-6 py-20 overflow-hidden text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/15 rounded-[100%] blur-[100px] -z-10 opacity-50" />
            <div className="max-w-3xl mx-auto relative z-10 animate-fade-in-up">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold mb-6 tracking-wider uppercase">
                  <Rocket className="w-3 h-3" />
                  <span>{productName}</span>
               </div>
               <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                  {aiOutput.headline}
               </h1>
               <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
                  {aiOutput.sub_headline}
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group text-sm">
                     {aiOutput.cta_text}
                     <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  {price && (
                     <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="text-[10px] text-gray-500 block mb-0.5 uppercase tracking-wider font-bold">Investment</span>
                        <span className="text-xl font-bold text-white">{formatPrice(price, currency)}</span>
                     </div>
                  )}
               </div>
            </div>
         </section>

         <section className="px-6 py-16 bg-white/[0.01]">
            <div className="max-w-6xl mx-auto">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {aiOutput.benefits?.map((b, i) => (
                     <div key={i} className="p-6 rounded-2xl bg-gray-900/40 border border-white/5 hover:border-indigo-500/20 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                           <Check className="w-5 h-5 text-indigo-400" />
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{b}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         <section className="px-6 py-20">
            <div className="max-w-6xl mx-auto">
               <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-6">
                     <h2 className="text-3xl font-bold text-white leading-tight">
                        Designed for the <span className="text-indigo-400">Future</span> of Sales.
                     </h2>
                     <div className="space-y-4">
                        {aiOutput.features_breakdown?.map((f, i) => (
                           <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                                 <Zap className="w-4 h-4 text-indigo-400" />
                              </div>
                              <div>
                                 <h3 className="font-bold text-white text-sm mb-1">{f.feature}</h3>
                                 <p className="text-xs text-gray-400 leading-relaxed">{f.explanation}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="relative">
                     <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center group backdrop-blur-sm">
                        {mainImage ? (
                           <img src={mainImage} alt={productName} className="w-full h-full object-cover" />
                        ) : (
                           <div className="relative text-white flex flex-col items-center text-center p-8">
                              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20">
                                 <Play className="w-6 h-6 fill-current ml-1" />
                              </div>
                              <p className="font-bold">Visual Dashboard</p>
                              <p className="text-white/40 text-xs mt-1">Experience the SalesAI workflow.</p>
                           </div>
                        )}
                     </div>
                     <div className="absolute -bottom-4 -left-4 glass-card p-4 border-indigo-500/20 shadow-2xl scale-90 sm:scale-100">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                              <Star className="w-5 h-5 text-green-400 fill-current" />
                           </div>
                           <div>
                              <p className="font-bold text-white text-sm">4.9/5 Rating</p>
                              <p className="text-[10px] text-gray-500">2,000+ customers</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <ImageGallery images={otherImages} title="Product Showcase" dark />

         <footer className="px-6 py-24 text-center border-t border-white/5">
            <div className="max-w-2xl mx-auto space-y-8">
               <h2 className="text-3xl font-bold text-white">Ready to automate?</h2>
               <button className="px-10 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-indigo-50 transition-all text-sm">
                  {aiOutput.cta_text}
               </button>
            </div>
         </footer>
      </div>
   );
}

/* ─── ELEGANT TEMPLATE (Editorial/Premium) ────────────────────────────── */
function ElegantTemplate({ aiOutput, productName, price, images = [], currency }: PreviewRendererProps) {
   const mainImage = images[0];
   const otherImages = images.slice(1);

   return (
      <div className="font-serif bg-[#fdfcf8] text-[#1a1a1a] min-h-screen selection:bg-amber-100">
         <header className="px-6 py-8 text-center border-b border-gray-100">
            <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-amber-600 mb-2 block">{productName}</span>
         </header>

         <section className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
               <div className="space-y-8">
                  <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900 italic">
                     {aiOutput.headline}
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                     {aiOutput.sub_headline}
                  </p>
                  <div className="flex items-center gap-6">
                     <button className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-all flex items-center gap-2 text-sm">
                        {aiOutput.cta_text}
                        <ArrowRight className="w-4 h-4" />
                     </button>
                     {price && (
                        <div>
                           <span className="text-gray-400 text-[10px] uppercase tracking-widest block font-sans">Investment</span>
                           <span className="text-xl font-bold font-sans">{formatPrice(price, currency)}</span>
                        </div>
                     )}
                  </div>
               </div>
               <div className="relative">
                  <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden relative shadow-xl border border-gray-200">
                     {mainImage ? (
                        <img src={mainImage} alt={productName} className="w-full h-full object-cover" />
                     ) : (
                        <>
                           <div className="absolute inset-0 bg-gradient-to-br from-amber-200/10 to-transparent pointer-events-none" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <Shield className="w-12 h-12 text-gray-200" />
                           </div>
                        </>
                     )}
                  </div>
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold text-[10px] text-center p-4 rotate-12 shadow-lg border-4 border-white font-sans">
                     Premium Quality
                  </div>
               </div>
            </div>
         </section>

         <section className="bg-white py-20 px-6 border-y border-gray-50">
            <div className="max-w-2xl mx-auto text-center space-y-8">
               <div className="w-10 h-0.5 bg-amber-500 mx-auto" />
               <p className="text-xl leading-relaxed text-gray-800 italic">
                  &quot;{aiOutput.description}&quot;
               </p>
               <div className="flex items-center justify-center gap-2 text-amber-600 font-sans">
                  <Award className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Authentic Choice</span>
               </div>
            </div>
         </section>

         <section className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12">
            <div>
               <h2 className="text-[10px] font-sans uppercase tracking-[0.3em] font-bold text-gray-400 mb-8 flex items-center gap-4">
                  The Experience <span className="flex-1 h-px bg-gray-100" />
               </h2>
               <div className="space-y-6">
                  {aiOutput.benefits?.map((b, i) => (
                     <div key={i} className="flex items-start gap-4 group">
                        <span className="text-amber-500 font-bold text-xs pt-1 font-sans">0{i + 1}</span>
                        <p className="text-base text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">{b}</p>
                     </div>
                  ))}
               </div>
            </div>
            <div>
               <h2 className="text-[10px] font-sans uppercase tracking-[0.3em] font-bold text-gray-400 mb-8 flex items-center gap-4">
                  Excellence <span className="flex-1 h-px bg-gray-100" />
               </h2>
               <div className="grid grid-cols-1 gap-4">
                  {aiOutput.features_breakdown?.map((f, i) => (
                     <div key={i} className="p-6 bg-white border border-gray-100 rounded-xl hover:border-amber-100 transition-all shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-1.5 uppercase tracking-wide text-xs font-sans">{f.feature}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed italic">{f.explanation}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         <ImageGallery images={otherImages} title="Visual Details" />

         <footer className="bg-gray-50 py-20 px-6 border-t border-gray-100">
            <div className="max-w-xl mx-auto text-center space-y-8">
               <h2 className="text-3xl font-bold italic">Join the standard.</h2>
               <button className="px-10 py-4 bg-amber-600 text-white rounded-full font-bold text-sm hover:bg-amber-700 transition-all shadow-xl shadow-amber-500/10">
                  {aiOutput.cta_text}
               </button>
            </div>
         </footer>
      </div>
   );
}

/* ─── DARK TEMPLATE (Minimalist Brutalist) ────────────────────────────── */
function DarkTemplate({ aiOutput, productName, price, images = [], currency }: PreviewRendererProps) {
   const mainImage = images[0];
   const otherImages = images.slice(1);

   return (
      <div className="font-sans bg-black text-white min-h-screen selection:bg-white selection:text-black">
         <section className="px-6 pt-24 pb-12 border-b border-white/10">
            <div className="max-w-6xl mx-auto">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                  <div className="max-w-3xl">
                     <span className="text-[10px] font-mono text-gray-600 mb-4 block">// {productName} // V2026</span>
                     <h1 className="text-5xl sm:text-7xl font-black uppercase leading-[0.9] tracking-tighter">
                        {aiOutput.headline}
                     </h1>
                  </div>
                  {price && (
                     <div className="text-right pb-2">
                        <div className="relative z-10">
                           <span className="text-gray-500 text-[10px] font-mono block mb-1">UNIT_COST</span>
                           <span className="text-4xl font-black">{formatPrice(price, currency)}</span>
                        </div>
                     </div>
                  )}
               </div>
               <div className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <p className="text-xl text-gray-400 font-bold leading-tight border-l-4 border-white pl-6">
                        {aiOutput.sub_headline}
                     </p>
                     {mainImage && (
                        <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                           <img src={mainImage} alt={productName} className="w-full h-full object-cover" />
                        </div>
                     )}
                  </div>
                  <div className="space-y-8">
                     <p className="text-gray-500 leading-relaxed text-sm">
                        {aiOutput.description}
                     </p>
                     <button className="px-8 py-4 bg-white text-black font-black uppercase text-sm hover:bg-gray-200 transition-all w-full md:w-auto">
                        {aiOutput.cta_text}
                     </button>
                  </div>
               </div>
            </div>
         </section>

         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-white/10">
            {aiOutput.benefits?.map((b, i) => (
               <div key={i} className="p-8 border-b sm:border-b-0 sm:border-r border-white/10 hover:bg-white hover:text-black transition-all group cursor-default">
                  <span className="text-2xl font-black block mb-6 group-hover:translate-x-1 transition-transform">0{i + 1}</span>
                  <p className="text-sm font-bold uppercase leading-tight">{b}</p>
               </div>
            ))}
         </section>

         <ImageGallery images={otherImages} title="ASSETS // GALLERY" dark />

         <section className="px-6 py-20 bg-zinc-950">
            <div className="max-w-6xl mx-auto">
               <h2 className="text-[10px] font-mono text-gray-600 mb-12 uppercase flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-white" /> SYSTEM_LOG
               </h2>
               <div className="grid lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
                  {aiOutput.features_breakdown?.map((f, i) => (
                     <div key={i} className="bg-black p-8 space-y-4">
                        <h3 className="text-xl font-black uppercase tracking-tight">{f.feature}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">{f.explanation}</p>
                        <div className="pt-4">
                           <div className="h-0.5 w-full bg-white/5 relative">
                              <div className="absolute inset-0 bg-white w-1/4" />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         <footer className="px-6 py-24 text-center">
            <div className="max-w-2xl mx-auto space-y-10">
               <h2 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter italic">Execute.</h2>
               <button className="px-12 py-5 bg-white text-black font-black uppercase text-lg hover:invert transition-all">
                  {aiOutput.cta_text}
               </button>
            </div>
         </footer>
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
