import { getProfiles, getLookupTags } from "@/lib/supabase/queries";
import { MembersPageClient } from "./MembersPageClient";

export default async function MembersPage() {
  const [profiles, skills] = await Promise.all([
    getProfiles(),
    getLookupTags("skills"),
  ]);
  return <MembersPageClient profiles={profiles} availableSkills={skills} />;
}
