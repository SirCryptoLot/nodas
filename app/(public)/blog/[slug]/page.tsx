import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px' }}>
      <Link href="/blog" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>← Visi įrašai</Link>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>{post.title}</h1>
      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 32 }}>{new Date(post.created_at).toLocaleDateString('lt-LT')}</div>
      <div style={{ fontSize: 16, lineHeight: 1.7, color: '#334155', whiteSpace: 'pre-wrap' }}>{post.content}</div>
    </div>
  )
}
