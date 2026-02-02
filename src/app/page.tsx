"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Package, LogIn, Mail, Lock, RefreshCcw, LayoutDashboard, Search, Plus, QrCode, Bell, ChevronRight, Settings, Camera } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function InventorySystem() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Проверяем сессию при загрузке
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchItems();
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchItems();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchItems() {
    const { data } = await supabase.from('items').select('*').order('created_at', { ascending: false });
    setItems(data || []);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <RefreshCcw className="animate-spin text-blue-500 w-10 h-10" />
    </div>
  );

  // --- ЭКРАН ВХОДА (GMAIL) ---
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-2xl">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-8 text-white">Sign in to Inventory</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
              <input 
                type="email" placeholder="Your Gmail" 
                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 text-white"
                value={email} onChange={(e) => setEmail(e.target.value)} required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
              <input 
                type="password" placeholder="Password" 
                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 text-white"
                value={password} onChange={(e) => setPassword(e.target.value)} required
              />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/40">
              Access System
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- ЭКРАН ИНВЕНТАРЯ (После входа) ---
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans antialiased">
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight hidden sm:block">Inventory Pro</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Logged in as</p>
              <p className="text-sm text-blue-400 font-medium">{user.email}</p>
            </div>
            <button onClick={() => supabase.auth.signOut()} className="p-2 text-gray-400 hover:text-red-400">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Твой основной интерфейс с поиском и товарами */}
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-2xl font-bold">Dashboard</h2>
             <button className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2"><Plus className="w-4 h-4"/> Add Item</button>
          </div>

          <div className="grid gap-4">
            {items.map(item => (
              <div key={item.id} className="p-4 bg-gray-800 rounded-xl border border-gray-700 flex justify-between">
                <span>{item.name}</span>
                <span className="text-gray-500 font-mono text-xs">{item.id.slice(0,8)}</span>
              </div>
            ))}
          </div>
      </main>
    </div>
  );
}
