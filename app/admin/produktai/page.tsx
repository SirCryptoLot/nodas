'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type Product = {
  id: string
  name: string
  slug: string
  price: number
  type: string
  stock: number | null
  description: string | null
  created_at: string
}

type FormData = { name: string; slug: string; price: string; type: string; stock: string; description: string }

async function getToken() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? ''
}

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const EMPTY: FormData = { name: '', slug: '', price: '', type: 'digital', stock: '', description: '' }

export default function AdminProductaiPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; product?: Product } | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [saving, setSaving] = useState(false)

  const fetchProducts = useCallback(async () => {
    const res = await fetch('/api/admin/products')
    const data = await res.json()
    setProducts(data.products ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  function openCreate() {
    setForm(EMPTY)
    setModal({ mode: 'create' })
  }

  function openEdit(p: Product) {
    setForm({ name: p.name, slug: p.slug, price: String(p.price), type: p.type, stock: p.stock != null ? String(p.stock) : '', description: p.description ?? '' })
    setModal({ mode: 'edit', product: p })
  }

  async function saveProduct() {
    if (!form.name || !form.price) return
    setSaving(true)
    const token = await getToken()
    const payload = {
      name: form.name,
      slug: form.slug || toSlug(form.name),
      price: Number(form.price),
      type: form.type,
      stock: form.stock ? Number(form.stock) : null,
      description: form.description || null,
    }
    if (modal?.mode === 'create') {
      await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
    } else if (modal?.product) {
      await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: modal.product.id, ...payload }),
      })
    }
    await fetchProducts()
    setSaving(false)
    setModal(null)
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0 }}>🛒 Produktai</h1>
        <button onClick={openCreate} style={{ padding: '9px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          + Naujas produktas
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Kraunama...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Produktas', 'Kaina', 'Tipas', 'Likutis', 'Data', 'Veiksmai'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>/{p.slug}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 15, fontWeight: 800, color: '#059669' }}>€{p.price}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: p.type === 'digital' ? '#eff6ff' : '#f0fdf4', color: p.type === 'digital' ? '#1e40af' : '#166534' }}>
                      {p.type === 'digital' ? '💻 Skaitmeninis' : '📦 Fizinis'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: p.stock != null && p.stock < 5 ? '#dc2626' : '#64748b', fontWeight: p.stock != null && p.stock < 5 ? 700 : 400 }}>
                    {p.stock != null ? p.stock : '∞'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8' }}>{new Date(p.created_at).toLocaleDateString('lt-LT')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => openEdit(p)}
                      style={{ padding: '5px 12px', background: '#eff6ff', color: '#1e40af', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      ✏️ Redaguoti
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Produktų nerasta</div>
          )}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                {modal.mode === 'create' ? '+ Naujas produktas' : '✏️ Redaguoti produktą'}
              </div>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Pavadinimas *', key: 'name', placeholder: 'Produkto pavadinimas', full: true },
                { label: 'URL slug', key: 'slug', placeholder: 'produkto-slug', full: true },
                { label: 'Kaina (€) *', key: 'price', placeholder: '29.99' },
                { label: 'Likutis', key: 'stock', placeholder: 'Palikti tuščią = ∞' },
              ].map(({ label, key, placeholder, full }) => (
                <div key={key} style={{ gridColumn: full ? '1 / -1' : undefined }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>{label}</label>
                  <input
                    value={form[key as keyof FormData]}
                    onChange={e => {
                      const val = e.target.value
                      setForm(f => ({
                        ...f,
                        [key]: val,
                        ...(key === 'name' && modal.mode === 'create' ? { slug: toSlug(val) } : {}),
                      }))
                    }}
                    placeholder={placeholder}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
              ))}

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>Tipas</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, background: '#fff' }}>
                  <option value="digital">💻 Skaitmeninis</option>
                  <option value="physical">📦 Fizinis</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 5 }}>Aprašymas</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Produkto aprašymas..." rows={3}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setModal(null)} style={{ padding: '9px 18px', background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Atšaukti</button>
              <button onClick={saveProduct} disabled={saving || !form.name || !form.price}
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
