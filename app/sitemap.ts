import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const BASE = 'https://nodas.lt'
const now = new Date()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: posts }, { data: products }] = await Promise.all([
    supabase.from('blog_posts').select('slug, updated_at, created_at').eq('published', true),
    supabase.from('products').select('slug, updated_at, created_at'),
  ])

  const static_: MetadataRoute.Sitemap = [
    // Core pages — highest priority
    { url: BASE,                    lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/#paslaugos`,    lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/#planai`,       lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/#duk`,          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/#kontaktai`,    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // Blog & shop
    { url: `${BASE}/blog`,          lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE}/parduotuve`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    // Auth
    { url: `${BASE}/auth/login`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]

  const blogPages: MetadataRoute.Sitemap = (posts ?? []).map(p => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at ?? p.created_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const productPages: MetadataRoute.Sitemap = (products ?? []).map(p => ({
    url: `${BASE}/parduotuve/${p.slug}`,
    lastModified: new Date(p.updated_at ?? p.created_at),
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  return [...static_, ...blogPages, ...productPages]
}
