import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { BlogPost } from '@/lib/types'

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>
      <h1 style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Blog</h1>
      <p style={{ color: '#64748b', marginBottom: 40 }}>IT patarimai, naujienos ir atvejai</p>
      {(!posts || posts.length === 0) ? (
        <p style={{ color: '#94a3b8' }}>Kol kas įrašų nėra.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {posts.map((post: BlogPost) => (
            <Link key={post.id} href={`/blog/${post.slug}`} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px 28px', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{post.title}</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>{new Date(post.created_at).toLocaleDateString('lt-LT')}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
