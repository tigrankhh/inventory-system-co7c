"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Plus, 
  Search, 
  Package, 
  ChevronRight, 
  Camera, 
  QrCode, 
  Settings,
  Bell,
  LogOut,
  RefreshCcw,
  LayoutDashboard
} from 'lucide-react';

// Инициализация Supabase напрямую из переменных окружения Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function InventorySystem() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching items:', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans antialiased">
      {/* --- NAVIGATION --- */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Inventory</h1>
              <p className="text-xs text-blue-400 font-medium uppercase tracking-wider">System Pro</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-900"></span>
            </button>
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full border-2 border-gray-800"></div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* --- DASHBOARD STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl backdrop-blur-sm">
            <p className="text-gray-400 text-sm font-medium mb-1">Total Assets</p>
            <h3 className="text-3xl font-bold">{items.length}</h3>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl backdrop-blur-sm">
            <p className="text-gray-400 text-sm font-medium mb-1">System Status</p>
            <h3 className="text-3xl font-bold text-green-400 font-mono">ONLINE</h3>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl backdrop-blur-sm">
            <p className="text-gray-400 text-sm font-medium mb-1">Last Update</p>
            <h3 className="text-xl font-bold text-blue-400">Just Now</h3>
          </div>
        </div>

        {/* --- SEARCH & QUICK ACTIONS --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search assets by name or serial..."
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-900/20">
              <Plus className="w-5 h-5" />
              Add Item
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl border border-gray-700 transition-all">
              <QrCode className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* --- ASSETS LIST --- */}
        <div className="bg-gray-800/30 border border-gray-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
          {loading ? (
            <div className="p-20 text-center">
              <div className="inline-block animate-spin mb-4 text-blue-500">
                <RefreshCcw className="w-10 h-10" />
              </div>
              <p className="text-gray-400 font-medium">Connecting to Supabase...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
                <Package className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Inventory is Empty</h3>
              <p className="text-gray-500 max-w-xs mx-auto">Start by adding your first asset to the database.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {items
                .filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item) => (
                <div key={item.id} className="p-5 hover:bg-gray-700/40 transition-all group cursor-pointer border-l-4 border-transparent hover:border-blue-500">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700 group-hover:bg-gray-900 transition-colors">
                      <Package className="w-7 h-7 text-gray-400 group-hover:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-100 group-hover:text-white">{item.name}</h4>
                        <span className="text-[10px] bg-gray-700 text-gray-400 px-2 py-0.5 rounded uppercase font-mono tracking-tighter">
                          {item.id?.slice(0, 8)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{item.category || 'General'}</p>
                    </div>
                    <div className="hidden sm:block text-right mr-6">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p>
                      <span className="inline-block px-3 py-1 bg-green-900/20 text-green-400 text-[10px] font-black rounded-full border border-green-800/30 uppercase tracking-widest">
                        Available
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* --- MOBILE NAV BAR --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md md:hidden z-[100]">
        <div className="bg-gray-800/90 backdrop-blur-2xl border border-gray-700/50 rounded-2xl p-2 flex justify-around items-center shadow-2xl shadow-black">
          <button className="p-3 text-blue-500"><LayoutDashboard className="w-6 h-6" /></button>
          <button className="p-3 text-gray-500"><Search className="w-6 h-6" /></button>
          <div className="relative -translate-y-6">
            <button className="p-5 bg-blue-600 rounded-2xl shadow-xl shadow-blue-900/40 active:scale-90 transition-transform text-white border-4 border-gray-900">
              <Plus className="w-8 h-8" />
            </button>
          </div>
          <button className="p-3 text-gray-500"><Camera className="w-6 h-6" /></button>
          <button className="p-3 text-gray-500"><Settings className="w-6 h-6" /></button>
        </div>
      </div>
    </div>
  );
}
