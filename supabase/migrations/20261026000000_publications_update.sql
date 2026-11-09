-- Allow admins to edit publications (title and file paths only).
grant update (title, image_path, pdf_path) on public.publications to authenticated;

create policy "Admins can update publications"
  on public.publications for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
