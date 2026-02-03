'use client';
import React, { useState } from 'react';
import { QrCode, LayoutDashboard, Package, LogOut, Search, AlertCircle, Clock } from 'lucide-react';

export default function InventorySystem() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isLogged, setIsLogged] = useState(false);

  // Demo Data
  const inventory = [
    { sku: 'MB-14-001', name: 'MacBook Pro 14"', cat: 'Laptops', qty: 12, status: 'In Stock' },
    { sku: 'LOGI-MX-2', name: 'Logitech MX 3S', cat: 'Peripherals', qty: 2, status: 'Low Stock' },
    { sku: 'DELL-27-05', name: 'Dell 27" Monitor', cat: 'Monitors', qty: 0, status: 'Out of Stock' },
  ];

  if (!isLogged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans">
        <div className="bg-white p-10 rounded-lg shadow-sm border border-slate-200 w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-800">Inventory Login</h1>
            <p className="text-slate-500 text-sm">Enter credentials to access stock</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase">Email Address</label>
              <input type="email" defaultValue="admin@system.com" className="w-full border border-slate-300 p-3 rounded outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase">Password</label>
              <input type="password" defaultValue="••••••••" className="w-full border border-slate-300 p-3 rounded outline-none focus:border-blue-500" />
            </div>
            <button onClick={() => setIsLogged(true)} className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition">Sign In</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Sidebar / Nav */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-8">
          <span className="font-bold text-lg tracking-tight border-r pr-8 border-slate-200">INV_SYSTEM</span>
          <div className="flex gap-6">
            <button onClick={() => setCurrentTab('dashboard')} className={`text-sm font-medium ${currentTab === 'dashboard' ? 'text-blue-600' : 'text-slate-500'}`}>Dashboard</button>
            <button onClick={() => setCurrentTab('inventory')} className={`text-sm font-medium ${currentTab === 'inventory' ? 'text-blue-600' : 'text-slate-500'}`}>Stock List</button>
          </div>
        </div>
        <button onClick={() => setIsLogged(false)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600">
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <main className="p-8 max-w-6xl mx-auto w-full">
        {currentTab === 'dashboard' ? (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase">Total Items</p>
                <p className="text-3xl font-bold">1,240</p>
              </div>
              <div className="bg-white p-6 rounded border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase">Low Stock</p>
                <p className="text-3xl font-bold text-orange-500">12</p>
              </div>
              <div className="bg-white p-6 rounded border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase">Out of Stock</p>
                <p className="text-3xl font-bold text-red-500">3</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-center">
              <button className="bg-blue-600 text-white px-12 py-6 rounded-xl shadow-lg hover:bg-blue-700 transition flex flex-col items-center gap-2">
                <QrCode size={48} />
                <span className="font-bold text-lg">SCAN ASSET QR</span>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded border border-slate-200 shadow-sm">
              <div className="p-4 border-b border-slate-100 flex items-center gap-2 font-bold text-slate-700">
                <Clock size={18} /> Recent Activity
              </div>
              <div className="p-4 space-y-4 text-sm">
                <div className="flex justify-between items-center border-b pb-2">
                  <span>John Doe checked out **MacBook 14"**</span>
                  <span className="text-slate-400">10m ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>New stock added to **Logitech MX Mouse**</span>
                  <span className="text-slate-400">1h ago</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between">
                <div className="relative w-72">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input type="text" placeholder="Search SKU or Name..." className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded text-sm" />
                </div>
             </div>
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map(item => (
                    <tr key={item.sku} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-slate-500">{item.sku}</td>
                      <td className="px-6 py-4 font-bold">{item.name}</td>
                      <td className="px-6 py-4">{item.qty}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'In Stock' ? 'bg-green-100 text-green-700' : 
                          item.status === 'Low Stock' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                        }`}>{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        )}
      </main>
    </div>
  );
}
