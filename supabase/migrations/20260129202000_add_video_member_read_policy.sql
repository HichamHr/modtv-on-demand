create policy "members read videos"
on public.videos
for select
using (is_channel_member(channel_id));
