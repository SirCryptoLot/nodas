'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  published: boolean
  created_at: string
}

type FormData = { title: string; slug: string; content: string; published: boolean }

async function getToken() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? ''
}

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const EMPTY: FormData = { title: '', slug: '', content: '', published: false }

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; post?: BlogPost } | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    const res = await fetch('/api/admin/blog')
    const data = await res.json()
    setPosts(data.posts ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  function openCreate() {
    setForm(EMPTY)
    setModal({ mode: 'create' })
  }

  function openEdit(post: BlogPost) {
    setForm({ title: post.title, slug: post.slug, content: post.content, published: post.published })
    setModal({ mode: 'edit', post })
  }

  async function savePost() {
    if (!form.title || !form.slug) return
    setSaving(true)
    const token = await getToken()
    if (modal?.mode === 'create') {
      await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
    } else if (modal?.post) {
      await fetch('/api/admin/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: modal.post.id, ...form }),
      })
    }
    await fetchPosts()
    setSaving(false)
    setModal(null)
  }

  async function deletePost(id: string) {
    if (!confirm('Ištrinti šį įrašą?')) return
    setDeleting(id)
    const token = await getToken()
    await fetch('/api/admin/blog', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    })
    setPosts(p => p.filter(x => x.id !== id))
    setDeleting(null)
  }

  async function togglePublish(post: BlogPost) {
    const token = await getToken()
    await fetch('/api/admin/blog', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: post.id, published: !post.published }),
    })
    setPosts(ps => ps.map(p => p.id === post.id ? { ...p, published: !p.published } : p))
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0 }}>📝 Blog</h1>
        <button onClick={openCreate} style={{ padding: '9px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          + Naujas įrašas
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Kraunama...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {posts.map(post => (
            <div key={post.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{post.title}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>/blog/{post.slug} · {new Date(post.created_at).toLocaleDateString('lt-LT')}</div>
                {post.content && (
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 500 }}>
                    {post.content.slice(0, 120)}...
                  </div>
                )}
              </div>
              <button onClick={() => togglePublish(post)}
                style={{ padding: '5px 12px', borderRadius: 7, border: 'none', background: post.published ? '#dcfce7' : '#f1f5f9', color: post.published ? '#166534' : '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {post.published ? '✅ Publikuota' : '⬜ Juodraštis'}
              </button>
              <button onClick={() => openEdit(post)}
                style={{ padding: '5px 12px', background: '#eff6ff', color: '#1e40af', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                ✏️ Redaguoti
              </button>
              <button onClick={() => deletePost(post.id)} disabled={deleting === post.id}
                style={{ padding: '5px 12px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 7, fontSize: 12, cursor: 'pointer' }}>
                🗑
              </button>
            </div>
          ))}
          {posts.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📝</div>
              Dar nėra įrašų. Sukurkite pirmą!
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                {modal.mode === 'create' ? '+ Naujas įrašas' : '✏️ Redaguoti'}
              </div>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>Antraštė *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: modal.mode === 'create' ? toSlug(e.target.value) : f.slug }))}
                placeholder="Įrašo pavadinimas"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>URL slug *</label>
              <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: toSlug(e.target.value) }))}
                placeholder="url-slug"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: 'monospace' }} />
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>nodas.lt/blog/{form.slug}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>Turinys (HTML)</label>
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="<p>Įrašo turinys...</p>"
                rows={14}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'monospace' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <input type="checkbox" id="published" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} style={{ width: 16, height: 16, cursor: 'pointer' }} />
              <label htmlFor="published" style={{ fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Publikuoti iš karto</label>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(null)} style={{ padding: '9px 18px', background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Atšaukti</button>
              <button onClick={savePost} disabled={saving || !form.title || !form.slug}
                style={{ padding: '9px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saugoma...' : modal.mode === 'create' ? 'Sukurti' : 'Išsaugoti'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
