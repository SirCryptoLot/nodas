import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nodas.lt'

  const { data: posts } = await supabase.from('blog_posts').select('slug, created_at').eq('published', true)
  const { data: products } = await supabase.from('products').select('slug, created_at')

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/parduotuve`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  const blogPages: MetadataRoute.Sitemap = (posts ?? []).map(p => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const productPages: MetadataRoute.Sitemap = (products ?? []).map(p => ({
    url: `${baseUrl}/parduotuve/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...blogPages, ...productPages]
}
