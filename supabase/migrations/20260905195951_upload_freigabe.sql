-- Grants the file upload after a paid order.
--
-- The browser uploads straight into the bucket, because files of this size do
-- not fit through a serverless function. Access is granted by a row rather than
-- a token: the storage policy only admits writes into a folder whose name is
-- listed here. Rows are written server-side with the service role, and only
-- once Stripe has confirmed the payment.
--
-- Bezeichner in der Datenbank sind englisch, die Anwendung selbst ist deutsch.

create schema if not exists internal;

create table if not exists public.orders (
  session_id text primary key,
  created_at timestamptz not null default now()
);

-- RLS on and deliberately without policies: that leaves the service_role as the
-- only way in, which means our server and nothing else.
alter table public.orders enable row level security;
revoke all on table public.orders from anon, authenticated;

-- Answers yes or no about an id the caller already holds. SECURITY DEFINER
-- because anon must not read the table — enumerating orders stays impossible.
create or replace function internal.order_exists(order_id text)
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select exists (select 1 from public.orders where session_id = order_id);
$$;

revoke all on function internal.order_exists(text) from public;
grant usage on schema internal to anon;
grant execute on function internal.order_exists(text) to anon;

-- INSERT only. A SELECT policy existed in between and it leaked: with the
-- publishable key, which ships in every browser, the bucket root could be
-- listed, a valid session id read off it and another customer's documents
-- downloaded in full. Reads happen server-side through signed links, and
-- resumable uploads turn out not to need the grant.
drop policy if exists "upload into paid order" on storage.objects;

create policy "upload into paid order"
  on storage.objects for insert to anon
  with check (
    bucket_id = 'documents'
    and internal.order_exists((storage.foldername(name))[1])
  );
