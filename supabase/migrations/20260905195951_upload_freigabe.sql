-- Freigabe für den Datei-Upload nach bezahlter Bestellung.
--
-- Der Browser lädt direkt in den Bucket, weil Uploads dieser Größe nicht durch
-- eine Serverless-Funktion passen. Erlaubt wird das nicht über einen Token,
-- sondern über diese Tabelle: Die Storage-Regel lässt Schreibzugriffe nur in
-- Ordner zu, deren Name hier steht. Eingetragen wird erst nach bestätigter
-- Zahlung, serverseitig mit dem Service-Role-Schlüssel.

create schema if not exists intern;

create table if not exists public.vorgaenge (
  session_id text primary key,
  angelegt_am timestamptz not null default now()
);

-- RLS aktiv und bewusst ohne Regeln: Damit kommt ausschließlich die Rolle
-- service_role heran, also nur unser Server.
alter table public.vorgaenge enable row level security;
revoke all on table public.vorgaenge from anon, authenticated;

-- Beantwortet nur ja/nein zu einer bereits bekannten Kennung. SECURITY DEFINER,
-- weil anon die Tabelle nicht lesen darf — ein Auflisten von Vorgängen ist
-- dadurch ausgeschlossen.
create or replace function intern.vorgang_existiert(kennung text)
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select exists (select 1 from public.vorgaenge where session_id = kennung);
$$;

revoke all on function intern.vorgang_existiert(text) from public;
grant usage on schema intern to anon;
grant execute on function intern.vorgang_existiert(text) to anon;

-- Nur INSERT. Eine SELECT-Regel gab es zwischenzeitlich und sie war ein Leck:
-- Mit dem öffentlichen Schlüssel ließen sich Ordner auflisten und fremde
-- Gutachten herunterladen. Gelesen wird ausschließlich serverseitig über
-- signierte Links; der resumable Upload braucht die Leserechte nicht.
drop policy if exists "lesen im eigenen vorgang" on storage.objects;
drop policy if exists "fortsetzen im eigenen vorgang" on storage.objects;
drop policy if exists "upload in bezahlten vorgang" on storage.objects;

create policy "upload in bezahlten vorgang"
  on storage.objects for insert to anon
  with check (
    bucket_id = 'gutachten'
    and intern.vorgang_existiert((storage.foldername(name))[1])
  );
