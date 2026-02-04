import { createClient } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'

export default async function PublicQRPage({ params }: { params: { itemId: string } }) {
  const supabase = createClient()
  
  const { data: item } = await supabase
    .from('inventory_items')
    .select('*, profiles:user_id(email)') // Предполагается наличие таблицы profiles
    .eq('id', params.itemId)
    .single()

  if (!item) notFound()

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-blue-50 font-black text-6xl opacity-10 italic">
          ASSET
        </div>
        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">
          Official Record
        </span>
        <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">
          {item.name}
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">
          Category: {item.category}
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-6 rounded-[2rem]">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
            <p className="font-bold text-slate-900 uppercase">{item.status}</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-[2rem]">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Quantity</p>
            <p className="font-bold text-slate-900 uppercase">{item.quantity}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
