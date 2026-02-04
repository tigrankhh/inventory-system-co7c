export const runtime = 'edge';

import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function QRPage({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params
  const supabase = await createClient()
  const { data: item } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('id', itemId)
    .single()

  if (!item) redirect('/')

  const qrValue = `https://inventory-app.pages.dev/qr/${itemId}`

  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <Link href="/" className="flex items-center gap-2 text-slate-500 mb-8 hover:text-blue-600">
        <ArrowLeft size={20} /> Back to inventory
      </Link>
      <div className="bg-white border-4 border-black p-8 rounded-[3rem] shadow-[10px_10px_0px_0px_rgba(37,99,235,1)]">
        <h2 className="text-2xl font-black uppercase mb-4">{item.name}</h2>
        <div className="aspect-square bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          {/* Здесь будет QR код на фронтенде */}
          <p className="text-xs text-slate-400 font-mono break-all p-4">{qrValue}</p>
        </div>
        <p className="font-bold text-blue-600">SCAN TO VIEW ITEM</p>
      </div>
    </div>
  )
}
