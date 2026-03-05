import { getEvents } from "@/lib/supabase/queries";
import { AdminEventsClient } from "./AdminEventsClient";

export default async function AdminEventsPage() {
  const events = await getEvents({ includeArchived: true });
  return <AdminEventsClient initialEvents={events} />;
}
