export type UserTier = 'simple' | 'cms' | 'custom'
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type SpaPlan = 'basic' | 'pro' | 'enterprise'
export type ProductType = 'digital' | 'physical'

export interface Profile {
  id: string
  full_name: string | null
  tier: UserTier
  phone: string | null
  is_admin: boolean
  created_at: string
}

export interface GeneratedSite {
  id: string
  user_id: string
  name: string
  prompt: string
  html_content: string
  subdomain: string
  published: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  service_type: string
  status: OrderStatus
  price: number | null
  notes: string | null
  created_at: string
}

export interface SpaSubscription {
  user_id: string
  plan: SpaPlan
  status: 'active' | 'cancelled'
  plan_price: number
  started_at: string
  renewal_date: string | null
  cancelled_at: string | null
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  published: boolean
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  type: ProductType
  stock: number | null
  created_at: string
}

export interface ShopOrder {
  id: string
  user_id: string
  items: Array<{ product_id: string; quantity: number; price: number }>
  total: number
  status: OrderStatus
  created_at: string
}

export interface CartItem {
  user_id: string
  product_id: string
  quantity: number
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  service: string
  message: string
  created_at: string
}
