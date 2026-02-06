'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [supabase.auth]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      {/* Background Glow - Global Network Vibe */}
      <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[100px]" />

      <nav className="flex items-center justify-between px-8 py-6 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]" />
          <span className="text-xl font-bold tracking-tight">INV<span className="text-blue-500">SYS</span></span>
        </div>
        <div className="text-sm text-gray-400 font-medium tracking-widest uppercase">
          Globaaal Network Brrrooo
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center px-4 pt-32 text-center">
        <div className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium text-blue-400 backdrop-blur-xl mb-6">
          v3.0.9 Premium Release
        </div>
        
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-8 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          Manage your assets with <br /> 
          <span className="text-blue-500">global precision.</span>
        </h1>

        <p className="max-w-2xl text-lg text-gray-400 mb-10 leading-relaxed">
          The ultimate inventory system for the modern age. Fast, secure, and globally connected. 
          Everything you need to scale your operations in one dashboard.
        </p>

        {loading ? (
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        ) : user ? (
          <div className="space-y-4">
            <div className="text-gray-300">Logged in as <span className="text-white font-semibold">{user.email}</span></div>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:bg-gray-200 hover:scale-105 active:scale-95"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-500 hover:-translate-y-1 active:scale-95"
            >
              Get Started
            </Link>
            <button className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/10">
              Live Demo
            </button>
          </div>
        )}

        {/* Feature Grid Mockup */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-4 text-left pb-20">
          {[
            { title: 'Global Sync', desc: 'Real-time updates across the globaaal network.' },
            { title: 'Smart Analytics', desc: 'Deep insights into your inventory trends.' },
            { title: 'Secure Auth', desc: 'Protected by Supabase enterprise-grade security.' }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-2 text-blue-400">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
