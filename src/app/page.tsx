'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight, Wand2, Zap, BarChart3, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function Home() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">SalesAI</span>
        </div>
        <div className="flex items-center gap-4">
          {token ? (
            <Link href="/dashboard" className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-gray-400 hover:text-white font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-500/20">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-12 pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
              <Sparkles className="w-3 h-3" />
              <span>Next-Gen Sales Page Generator</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Generate <span className="gradient-text">High-Converting</span> Sales Pages in Seconds.
            </h1>
            <p className="text-lg text-gray-400 mb-10 max-w-xl">
              Stop spending hours on copywriting and design. Let our AI handle everything from headlines to testimonials, tailored for your specific product.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={token ? "/dashboard" : "/register"} className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/25 group">
                {token ? "Go to Dashboard" : "Start Generating for Free"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all">
                View Templates
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-6 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Powered by Gemini 2.0
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                SEO Optimized
              </div>
            </div>
          </div>

          <div className="relative animate-float pt-10 lg:pt-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-[100px] -z-10" />
            <div className="glass-card p-2 gradient-border overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-700">
              <div className="rounded-xl overflow-hidden aspect-[4/3] relative">
                {/* Mockup image placeholder - I will use the generated image here */}
                <img 
                  src="/hero-mockup.png" 
                  alt="AI Dashboard Mockup" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
                
                {/* Floating UI elements */}
                <div className="absolute bottom-4 left-4 right-4 glass-card p-4 translate-y-2 animate-fade-in-up" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Conversion Rate</div>
                      <div className="text-sm font-bold text-white">+24.5% improvement</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Wand2 className="w-6 h-6 text-indigo-400" />,
              title: "AI Copywriting",
              desc: "Professional sales copy written by advanced language models trained for conversion."
            },
            {
              icon: <Zap className="w-6 h-6 text-purple-400" />,
              title: "Instant Export",
              desc: "Get your sales page as a standalone HTML/CSS file or host it directly with us."
            },
            {
              icon: <Sparkles className="w-6 h-6 text-pink-400" />,
              title: "Custom Templates",
              desc: "Choose from a variety of modern, responsive designs tailored for different industries."
            }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 hover:bg-white/5 transition-colors border-white/5 group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 opacity-50">
          <Sparkles className="w-5 h-5" />
          <span className="font-bold tracking-tight">SalesAI</span>
        </div>
        <p className="text-gray-500 text-sm">
          © 2026 SalesAI. All rights reserved. Built with Gemini 2.0.
        </p>
        <div className="flex gap-6 text-gray-500 text-sm">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
