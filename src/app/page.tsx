"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Отправляем Magic Link (ссылку для входа) на почту
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Куда перекинуть пользователя после клика в письме
        emailRedirectTo: window.location.origin, 
      }
    });

    if (error) {
      alert("Ошибка: " + error.message);
    } else {
      alert("Проверь почту! 📧 Мы отправили тебе ссылку для входа.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 max-w-sm w-full border border-white">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-blue-50 rounded-3xl mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">INV.MANAGER</h1>
          <p className="text-slate-400 text-sm mt-2">Введи почту, чтобы войти в систему</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="name@company.com" 
              required
              className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-900" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'ОТПРАВЛЯЕМ...' : 'ПОЛУЧИТЬ ССЫЛКУ'}
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-300 mt-8 uppercase tracking-widest font-bold">
          Protected by Supabase Auth
        </p>
      </div>
    </div>
  );
}
