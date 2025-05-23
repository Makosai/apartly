-- Supabase extensions.
create schema if not exists "gis";
create extension if not exists postgis with schema "gis";
set search_path to public, gis;

grant usage on schema "gis" to anon;
grant usage on schema "gis" to authenticated;

-- Create the enum type for account types.
create type acc_type as enum('none', 'realtor', 'user');

insert into storage.buckets
  (id, name, public, allowed_mime_types, file_size_limit)
values
  (
    'apartments_images',
    'apartments_images',
    true,
    array['image/jpeg', 'image/png', 'image/avif', 'image/webp'],
    5242880
  );

create policy "user_apartment_images_policy_select"
on storage.objects for select
to authenticated
using (bucket_id = 'apartments_images'::text);

create policy "user_apartment_images_policy_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'apartments_images'::text
  and (
    (select (auth.uid())::text as uid) = (storage.foldername(name))[1]
  )
);

create policy "user_apartment_images_policy_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'apartments_images'::text
  and (
    (select (auth.uid())::text as uid) = (storage.foldername(name))[1]
  )
)
with check (
  bucket_id = 'apartments_images'::text
  and (
    (select (auth.uid())::text as uid) = (storage.foldername(name))[1]
  )
);

---
--- USERS
---
-- Create the users table.
create table
  users (
    id uuid references auth.users on delete cascade primary key,
    account_type acc_type default 'none' not null,
    first_name text not null,
    last_name text not null
  );

-- Enable RLS for users.
alter table users enable row level security;

-- Create a user as long as they're authenticated.
-- DROP POLICY IF EXISTS user_create_policy ON public.users;
create policy "user_create_policy"
on users for insert
to authenticated
with check ((select auth.uid()) = id);

-- Account Type function & trigger
create or replace
function check_account_type_change ()
returns trigger set search_path = '' as $$
begin
    -- Allow changing from 'none' to any other account type.
    if old.account_type = 'none'::public.acc_type then
        return new;
    end if;

    -- Deny changing to any other account type if current_type is not 'none'.
    if old.account_type <> 'none'::public.acc_type and new.account_type <> old.account_type then
        raise exception 'Cannot change account_type once it is set to a value other than none.';
    end if;

    -- Allow changing to the same account type.
    return new;
end;
$$ LANGUAGE plpgsql;

create trigger account_type_change_trigger
before update on users for each row
execute function check_account_type_change ();

-- Allow everyone to read users.
-- DROP POLICY IF EXISTS user_read_policy ON public.users;
create policy "user_read_policy"
on users for select
using (true);

-- Allow users to change their first and last name.
-- Also allow them to change from acc_type.none to any
-- other role but never again.
-- DROP POLICY IF EXISTS user_update_policy ON public.users;
create policy "user_update_policy"
on users for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Deletion happens only when their auth account is deleted.
create policy "user_delete_policy"
on users for delete
to authenticated
using (false); -- users are cascaded with `auth.users`.

---
--- APARTMENTS
---
-- Create the apartments table.
create table
  apartments (
    id bigint generated always as identity primary key,
    owner_id uuid references public.users (id) on delete cascade not null,
    title text not null,
    description text not null,
    sq_footage int not null,
    rooms smallint not null,
    monthly_price numeric not null,
    location gis.geography (point) not null
  );

create index apartments_geo_index
on public.apartments
using GIST (location);

-- Distance sorting function used with .rpc() on client.
-- drop function nearby_apartments(double precision, double precision);

create or replace
function nearby_apartments(lat float, long float)
returns table (
  id public.apartments.id%TYPE,
  owner_id public.apartments.owner_id%TYPE,
  first_name public.users.first_name%TYPE,
  last_name public.users.last_name%TYPE,
  title public.apartments.title%TYPE,
  description public.apartments.description%TYPE,
  sq_footage public.apartments.sq_footage%TYPE,
  rooms public.apartments.rooms%TYPE,
  monthly_price public.apartments.monthly_price%TYPE,
  lat float, long float, dist_meters float,
  location_label public.apartments.location_label%TYPE
  )
language sql set search_path to public, gis
as $$
  select
    a.id,
    a.owner_id,
    u.first_name,
    u.last_name,
    a.title,
    a.description,
    a.sq_footage,
    a.rooms,
    a.monthly_price,
    st_y(a.location::geometry) as lat,
    st_x(a.location::geometry) as long,
    st_distance(a.location, st_point(long, lat)::geography) as dist_meters,
    a.location_label
  from public.apartments a
  inner join public.users u
    on u.id = a.owner_id
  order by a.location <-> st_point(long, lat)::geography;
$$;

create or replace function apartments_in_view(min_lat float, min_long float, max_lat float, max_long float)
returns table (id public.apartments.id%TYPE, title public.apartments.title%TYPE, lat float, long float)
language sql set search_path to public, gis as $$
	select id, title, st_y(location::geometry) as lat, st_x(location::geometry) as long
	from public.apartments
	where location && ST_SetSRID(ST_MakeBox2D(ST_Point(min_long, min_lat), ST_Point(max_long, max_lat)), 4326)
$$;


-- Enable RLS for apartments.
alter table apartments enable row level security;

-- Create an apartment listing where you're the owner if you're a realtor.
-- needs a function that checks for the owner's ID and also verifies their account_type is acc_type.realtor.
create policy "apartment_create_policy"
on apartments for insert
to authenticated
with check ((select auth.uid()) = owner_id);

-- Everyone can read the apartments list.
create policy "apartment_read_policy"
on apartments for select
to anon, authenticated
using (true);

-- Update the apartment listing if you're the owner.
-- Prevent updating it to someone else's owner ID with a function.
create policy "apartment_update_policy"
on apartments for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

-- Delete the apartment of you own the listing.
create policy "apartment_delete_policy"
on apartments for delete
to authenticated
using ((select auth.uid()) = owner_id);














-- Create a function to insert a new user into the users table using metadata
create or replace function
insert_new_user ()
returns trigger security definer
set search_path = '' as $$
declare
    user_metadata jsonb;
begin
    user_metadata := new.raw_user_meta_data;

    insert into public.users (id, account_type, first_name, last_name)
    values (
        new.id,
        (user_metadata->>'account_type')::public.acc_type,
        user_metadata->>'first_name',
        user_metadata->>'last_name'
    );

    return new;
end;
$$ language plpgsql;

-- Create a trigger that calls the function after a new user is created in the auth.users table
create or replace trigger after_user_signup
after insert on auth.users for each row
execute function insert_new_user ();
