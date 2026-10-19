-- Execute este arquivo no SQL Editor do Supabase uma única vez.

create table if not exists public.shared_proposals (
  share_id text primary key,
  proposal_name text not null default 'Proposta',
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.shared_proposals enable row level security;

-- A tabela não fica acessível diretamente pela chave anon.
revoke all on public.shared_proposals from anon, authenticated;

drop function if exists public.publish_shared_proposal(text, text, jsonb);
create function public.publish_shared_proposal(
  p_share_id text,
  p_name text,
  p_payload jsonb
)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_share_id is null or length(p_share_id) < 20 then
    raise exception 'Identificador de compartilhamento inválido';
  end if;

  insert into public.shared_proposals (share_id, proposal_name, payload, updated_at)
  values (p_share_id, coalesce(nullif(trim(p_name), ''), 'Proposta'), p_payload, now())
  on conflict (share_id) do update
    set proposal_name = excluded.proposal_name,
        payload = excluded.payload,
        updated_at = now();

  return p_share_id;
end;
$$;

drop function if exists public.get_shared_proposal(text);
create function public.get_shared_proposal(p_share_id text)
returns table (
  proposal_name text,
  payload jsonb,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select p.proposal_name, p.payload, p.updated_at
  from public.shared_proposals p
  where p.share_id = p_share_id
  limit 1;
$$;

revoke all on function public.publish_shared_proposal(text, text, jsonb) from public;
revoke all on function public.get_shared_proposal(text) from public;
grant execute on function public.publish_shared_proposal(text, text, jsonb) to anon, authenticated;
grant execute on function public.get_shared_proposal(text) to anon, authenticated;

-- Bucket público para vídeos e imagens usados nas propostas.
insert into storage.buckets (id, name, public, file_size_limit)
values ('portfolio-media', 'portfolio-media', true, 209715200)
on conflict (id) do update
set public = true,
    file_size_limit = 209715200;

-- Permite upload pelo editor. Como este projeto ainda não possui login de administrador,
-- a publicação usa a chave anon do frontend. Para um projeto comercial maior, adicione autenticação.
drop policy if exists "portfolio media public upload" on storage.objects;
create policy "portfolio media public upload"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'portfolio-media');

-- Permite leitura pública dos arquivos do portfólio.
drop policy if exists "portfolio media public read" on storage.objects;
create policy "portfolio media public read"
on storage.objects
for select
to public
using (bucket_id = 'portfolio-media');
