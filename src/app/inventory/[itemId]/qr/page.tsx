export const runtime = 'edge';
'use client'
import { QRCodeSVG } from 'qrcode.react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function QRPreviewPage() {
  const { itemId } = useParams()
  const publicUrl = `${window.location.origin}/qr/${itemId}`

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-sm w-full">
        <Link href="/inventory" className="flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-blue-600">
          <ArrowLeft size={18} /> BACK
        </Link>
        <div className="bg-slate-50 p-8 rounded-[2rem] inline-block mb-6">
          <QRCodeSVG value={publicUrl} size={200} />
        </div>
        <h2 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">QR Asset Label</h2>
        <p className="text-slate-400 text-sm font-medium mb-6 break-all">{publicUrl}</p>
        <button 
          onClick={() => window.print()}
          className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg"
        >
          PRINT LABEL
        </button>
      </div>
    </div>
  )
}
