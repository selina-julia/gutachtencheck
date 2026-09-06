-- Customer address and amount for the admin list.
--
-- Both live in Stripe, but a list view would need one API call per row. They
-- are written once, when the payment is confirmed.

alter table public.orders
  add column if not exists customer_email text,
  add column if not exists amount_total integer,
  add column if not exists documents_submitted_at timestamptz;
