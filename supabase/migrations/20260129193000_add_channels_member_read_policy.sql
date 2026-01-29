create policy "members read channels"
on public.channels
for select
using (is_channel_member(id));
