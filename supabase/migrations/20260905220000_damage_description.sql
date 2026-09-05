-- The customer's account of what happened, collected in step two of the upload.
--
-- It lives on the order rather than as a file in the bucket: it is a form field,
-- not a document, the expert reads it in the notification mail instead of
-- downloading a .txt, and only here can it be queried later.
--
-- The cleanup job clears order rows past the same 24 months it applies to the
-- stored files, so this column falls under the retention period too.

alter table public.orders
  add column if not exists damage_description text;
