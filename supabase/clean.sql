-- Clean up.
drop policy if exists user_apartment_images_policy on storage.objects;
drop table users, apartments;
delete from storage.buckets where name = 'apartments_images';
drop type acc_type;
