'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/libsupabase';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function AssetOSPro() {
  const [assets, setAssets] = useState([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const rates = { USD: 1, EUR: 0.92, RUB: 91.5 };

  useEffect(() => {
    fetchAssets();
  }, []);

  async function fetchAssets() {
    const { data } = await supabase.from('assets').select('*').order('created_at', { ascending: false });
    if (data) setAssets(data);
  }

  // Функция загрузки фото
  async function uploadImage(e, assetId) {
    const file = e.target.files[0];
    const filePath = `assets/${assetId}-${Date.now()}`;
    
    const { error: uploadError } = await supabase.storage.from('assets').upload(filePath, file);
    if (!uploadError) {
      const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
      await supabase.from('assets').update({ image_url: data.publicUrl }).eq('id', assetId);
      fetchAssets();
    }
  }

  // Логика QR-сканера
  useEffect(() => {
    if (isScannerOpen) {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
      scanner.render((decodedText) => {
        alert(`Found Asset: ${decodedText}`); // Здесь можно сделать фильтрацию списка
        scanner.clear();
        setIsScannerOpen(false);
      }, (error) => { console.warn(error); });
      return () => scanner.clear();
    }
  }, [isScannerOpen]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 transition-all">
      {/* Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tighter">ZEN.ASSET<span className="text-blue-500">OS</span></h1>
          <div className="flex gap-4 items-center">
            <select 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-zinc-100 dark:bg-zinc-900 border-none rounded-lg px-3 py-1 text-sm focus:ring-2 ring-blue-500"
            >
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
              <option value="RUB">RUB ₽</option>
            </select>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {/* QR Scanner Section */}
        {isScannerOpen && (
          <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center p-4">
            <div id="reader" className="w-full max-w-md overflow-hidden rounded-3xl"></div>
            <button onClick={() => setIsScannerOpen(false)} className="mt-8 px-8 py-3 bg-white text-black rounded-full font-bold">Close Scanner</button>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Total Assets</p>
            <p className="text-2xl font-bold">{assets.length}</p>
          </div>
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Total Value</p>
            <p className="text-2xl font-bold">
              {(assets.reduce((acc, curr) => acc + curr.price, 0) * rates[currency]).toLocaleString()} {currency}
            </p>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <div key={asset.id} className="group relative bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] p-4 border border-zinc-100 dark:border-zinc-800 hover:border-blue-500 transition-all duration-300">
              <div className="aspect-square mb-4 overflow-hidden rounded-[2rem] bg-zinc-200 dark:bg-zinc-800 relative">
                {asset.image_url ? (
                  <img src={asset.image_url} alt={asset.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
                    <span className="text-3xl mb-2">📸</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest">Add Photo</span>
                    <input type="file" className="hidden" onChange={(e) => uploadImage(e, asset.id)} />
                  </label>
                )}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full uppercase font-black">
                  {asset.category}
                </div>
              </div>
              
              <div className="px-2">
                <h3 className="text-lg font-bold leading-tight mb-1 truncate">{asset.name}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-black text-blue-500">
                    {(asset.price * rates[currency]).toLocaleString()} <span className="text-sm font-medium">{currency}</span>
                  </p>
                  <div className="w-8 h-8 bg-white dark:bg-black rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    📦
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Action Button (QR) */}
      <button 
        onClick={() => setIsScannerOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-[0_20px_50px_rgba(37,99,235,0.4)] flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all z-40"
      >
        📱
      </button>
    </div>
  );
}
