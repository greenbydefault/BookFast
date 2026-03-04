-- Restrict booking_staff visibility to the owner's workspaces.
drop policy if exists "Public read access" on booking_staff;

create policy "Users can view booking_staff in their workspaces"
on booking_staff
for select
to public
using (
    booking_id in (
        select b.id
        from bookings b
        where b.workspace_id in (
            select w.id
            from workspaces w
            where w.owner_id = auth.uid()
        )
    )
);
