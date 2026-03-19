import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function SubdomainPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const supabase = await createClient()
  const { subdomain } = await params
  const { data: site } = await supabase
    .from('generated_sites')
    .select('html_content, name')
    .eq('subdomain', subdomain)
    .eq('published', true)
    .single()

  if (!site) notFound()

  return (
    <html>
      <head><title>{site.name}</title></head>
      <body dangerouslySetInnerHTML={{ __html: site.html_content }} />
    </html>
  )
}
