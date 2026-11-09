-- Local only: admin user for /admin (admin@johnaxe.local / johnaxe123).
with new_user as (
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  )
  values (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated',
    'authenticated', 'admin@johnaxe.local', extensions.crypt('johnaxe123', extensions.gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  )
  returning id, email
),
new_identity as (
  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  select gen_random_uuid(), id, id::text, jsonb_build_object('sub', id::text, 'email', email), 'email', now(), now(), now()
  from new_user
)
insert into public.admins (user_id)
select id from new_user;
