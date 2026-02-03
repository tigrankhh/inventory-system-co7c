'use client';

import { useState } from 'react';
import { supabase } from './libsupabase';

export default function AssetOS() {
  const [logs, setLogs] = useState<any[]>([]);
  const [currency, setCurrency] = useState({ code: 'USD', symbol: '$', rate: 1 });
  const [person, setPerson] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase.from('assets').select('*').order('created_at', { ascending: false });
      setLogs(data || []);
    };
    fetchLogs();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!person) return;
    const sku = `AZ-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const meta = `${person}|Device|${price || '0'}|Excellent|0`;
    const { error } = await supabase.from('assets').insert([{ name: meta, sku }]);
    if (!error) {
      setPerson('');
      setPrice('');
      const { data } = await supabase.from('assets').select('*').order('created_at', { ascending: false });
      setLogs(data || []);
    }
  };

  const totals = useMemo(() => {
    return logs.reduce((sum, l) => {
      const parts = (l.name || '0|0|0').split('|');
      return sum + (parseFloat(parts[2]) || 0);
    }, 0);
  }, [logs]);

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-20">
          <h1 className="text-2xl font-black italic">AssetOS.</h1>
          <div className="text-xs font-bold bg-gray-100 px-4 py-2 rounded-full">
            TOTAL: {currency.symbol}{(totals * currency.rate).toLocaleString()}
          </div>
        </header>

        <form onSubmit={handleAdd} className="mb-20 flex gap-4">
          <input 
            value={person} 
            onChange={(e) => setPerson(e.target.value)} 
            placeholder="Owner Name" 
            className="flex-1 border-b-2 border-gray-100 p-4 outline-none focus:border-black transition-all"
          />
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            placeholder="Price" 
            className="w-32 border-b-2 border-gray-100 p-4 outline-none focus:border-black transition-all"
          />
          <button type="submit" className="bg-black text-white px-8 rounded-xl font-bold">Add</button>
        </form>

        <div className="space-y-6">
          {logs.map((log) => {
            const parts = (log.name || 'Unknown|Item|0').split('|');
            return (
              <div key={log.id} className="flex items-center justify-between border-b border-gray-50 pb-6">
                <div className="flex items-center gap-6">
                  <QRCodeSVG value={log.sku} size={40} />
                  <div>
                    <div className="font-bold">{parts[1]}</div>
                    <div className="text-sm text-gray-400">{parts[0]} • {currency.symbol}{parts[2]}</div>
                  </div>
                </div>
                <div className="font-mono text-[10px] text-gray-300">{log.sku}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
