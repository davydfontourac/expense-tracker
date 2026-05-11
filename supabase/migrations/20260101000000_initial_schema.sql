create table public.profiles (
  id uuid not null,
  full_name text null,
  avatar_url text null,
  updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
  username text null,
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.categories (
  id uuid not null default gen_random_uuid (),
  name character varying(255) not null,
  color character varying(50) null default '#3b82f6'::character varying,
  icon character varying(50) null default 'Tag'::character varying,
  user_id uuid not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  monthly_limit numeric(12, 2) null default 0,
  constraint categories_pkey primary key (id),
  constraint categories_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.transactions (
  id uuid not null default gen_random_uuid (),
  amount numeric(12, 2) not null,
  type character varying(50) not null,
  description text not null,
  date date not null,
  category_id uuid null,
  user_id uuid not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint transactions_pkey primary key (id),
  constraint transactions_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint transactions_category_id_fkey foreign KEY (category_id) references public.categories (id) on delete SET NULL
) TABLESPACE pg_default;
