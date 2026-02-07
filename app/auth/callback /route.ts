export const runtime = 'edge';

import { createClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

// Это критически важно для Cloudflare, чтобы роут не пытался собраться как статика
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    // Ждем создания клиента, так как внутри теперь асинхронные cookies()
    const supabase = await createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Если что-то пошло не так, возвращаем пользователя на главную или страницу ошибки
  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}
