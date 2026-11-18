create table if not exists public.game_saves (
 user_id uuid primary key references auth.users(id) on delete cascade,
 revision integer not null default 1 check (revision > 0),
 payload jsonb not null,
 updated_at timestamptz not null default now()
);
alter table public.game_saves enable row level security;
revoke all on public.game_saves from anon, authenticated;
grant select on public.game_saves to authenticated;
create policy "own_game_save_read" on public.game_saves for select to authenticated using ((select auth.uid())=user_id);

create or replace function public.save_game(expected_revision integer,new_payload jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); current_revision integer; stamp timestamptz:=now(); affected integer;
begin
 if uid is null then raise exception '로그인이 필요합니다.' using errcode='42501'; end if;
 if expected_revision is null or expected_revision<0 or new_payload is null then raise exception '저장 상태를 확인해 주세요.'; end if;
 if pg_column_size(new_payload)>140000 or (new_payload->>'version') is distinct from '2' or coalesce(new_payload->>'phase','') not in ('ready','aim') or jsonb_typeof(new_payload->'units') is distinct from 'array' or jsonb_array_length(new_payload->'units')<>6 then raise exception '저장 상태를 확인해 주세요.'; end if;
 if expected_revision=0 then
  insert into public.game_saves(user_id,revision,payload,updated_at) values(uid,1,new_payload,stamp) on conflict(user_id) do nothing;
  get diagnostics affected=row_count;
  if affected=0 then raise exception '다른 기기의 저장이 있습니다. 먼저 불러와 주세요.' using errcode='40001'; end if;
  current_revision:=1;
 else
  update public.game_saves set revision=revision+1,payload=new_payload,updated_at=stamp where user_id=uid and revision=expected_revision returning revision into current_revision;
  if current_revision is null then raise exception '다른 기기에서 저장이 바뀌었습니다. 먼저 불러와 주세요.' using errcode='40001'; end if;
 end if;
 return jsonb_build_object('revision',current_revision,'updatedAt',stamp);
end;
$$;
revoke all on function public.save_game(integer,jsonb) from public,anon;
grant execute on function public.save_game(integer,jsonb) to authenticated;

