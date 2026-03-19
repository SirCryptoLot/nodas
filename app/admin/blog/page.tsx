import { createClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/lib/types'

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 24 }}>📝 Blog įrašai</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {posts?.map((p: BlogPost) => (
          <div key={p.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.title}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>/blog/{p.slug}</div>
            </div>
            <span style={{ background: p.published ? '#dcfce7' : '#f1f5f9', color: p.published ? '#166534' : '#64748b', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
              {p.published ? 'Publikuota' : 'Juodraštis'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
