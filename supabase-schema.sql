-- Profiles (auto-created on first login via trigger)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  tier text not null default 'simple' check (tier in ('simple','cms','custom')),
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Generated sites
create table generated_sites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  prompt text not null,
  html_content text not null,
  subdomain text unique not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
alter table generated_sites enable row level security;
create policy "Users can manage own sites" on generated_sites for all using (auth.uid() = user_id);

-- Orders
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  service_type text not null,
  status text not null default 'pending' check (status in ('pending','in_progress','completed','cancelled')),
  price numeric(10,2),
  notes text,
  created_at timestamptz not null default now()
);
alter table orders enable row level security;
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on orders for insert with check (auth.uid() = user_id);

-- SPA subscriptions
create table spa_subscriptions (
  user_id uuid references profiles(id) on delete cascade primary key,
  plan text not null check (plan in ('basic','pro','enterprise')),
  status text not null default 'active' check (status in ('active','cancelled')),
  plan_price numeric(10,2) not null,
  started_at timestamptz not null default now(),
  renewal_date timestamptz,
  cancelled_at timestamptz
);
alter table spa_subscriptions enable row level security;
create policy "Users can manage own subscription" on spa_subscriptions for all using (auth.uid() = user_id);

-- Blog posts
create table blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  content text not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
alter table blog_posts enable row level security;
create policy "Anyone can view published posts" on blog_posts for select using (published = true);

-- Products
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  price numeric(10,2) not null,
  type text not null check (type in ('digital','physical')),
  stock integer,
  created_at timestamptz not null default now()
);
alter table products enable row level security;
create policy "Anyone can view products" on products for select using (true);

-- Shop orders
create table orders_shop (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete set null,
  items jsonb not null default '[]',
  total numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending','in_progress','completed','cancelled')),
  created_at timestamptz not null default now()
);
alter table orders_shop enable row level security;
create policy "Users can view own shop orders" on orders_shop for select using (auth.uid() = user_id);
create policy "Anyone can insert shop orders" on orders_shop for insert with check (true);

-- Cart items
create table cart_items (
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  quantity integer not null default 1,
  primary key (user_id, product_id)
);
alter table cart_items enable row level security;
create policy "Users can manage own cart" on cart_items for all using (auth.uid() = user_id);

-- Contact submissions
create table contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  service text not null,
  message text not null,
  created_at timestamptz not null default now()
);
alter table contact_submissions enable row level security;
create policy "Anyone can insert contact" on contact_submissions for insert with check (true);
