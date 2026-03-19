import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()
  if (!prompt) return NextResponse.json({ error: 'Prompt privalomas' }, { status: 400 })

  if (process.env.MOCK_AI === 'true') {
    return NextResponse.json({
      html: `<!DOCTYPE html><html><body><h1>Mock: ${prompt}</h1></body></html>`,
      name: 'Mock svetainė',
    })
  }

  const [htmlMsg, nameMsg] = await Promise.all([
    anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: `Sukurk profesionalią vieno puslapio svetainę HTML/CSS/JS. Verslo aprašymas: ${prompt}. Grąžink tik HTML kodą, be komentarų.`,
      }],
    }),
    anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 30,
      messages: [{
        role: 'user',
        content: `Iš šio aprašymo ištrauk trumpą verslo pavadinimą (1-3 žodžiai, lotyniški rašmenys): ${prompt}. Grąžink tik pavadinimą.`,
      }],
    }),
  ])

  const html = htmlMsg.content[0].type === 'text' ? htmlMsg.content[0].text : ''
  const name = nameMsg.content[0].type === 'text' ? nameMsg.content[0].text.trim() : 'Mano svetainė'

  return NextResponse.json({ html, name })
}

export async function PUT(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { html, name, prompt } = await req.json()

  const { data: profile } = await supabase.from('profiles').select('tier').eq('id', user.id).single()
  if (profile?.tier === 'simple') {
    const { count } = await supabase.from('generated_sites').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
    if ((count ?? 0) >= 1) {
      return NextResponse.json({ error: 'Simple plane leidžiama tik 1 svetainė' }, { status: 403 })
    }
  }

  const subdomain = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30)

  const { data, error: insertError } = await supabase.from('generated_sites').insert({
    user_id: user.id, name, prompt, html_content: html, subdomain, published: true,
  }).select().single()

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  return NextResponse.json({ site: data })
}
