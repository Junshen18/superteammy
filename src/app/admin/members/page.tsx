import { createServerClient } from "@/lib/supabase/server";
import { getAllProfiles } from "@/lib/supabase/queries";
import { AdminMembersClient } from "./AdminMembersClient";
import type { UserRole } from "@/lib/types";

export default async function AdminMembersPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userRole: UserRole = (user?.app_metadata?.user_role as UserRole) || "member";

  const profiles = await getAllProfiles();
  return <AdminMembersClient initialProfiles={profiles} userRole={userRole} />;
}
