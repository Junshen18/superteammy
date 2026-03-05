import { getPartners } from "@/lib/supabase/queries";
import { AdminPartnersClient } from "./AdminPartnersClient";

export default async function AdminPartnersPage() {
  const partners = await getPartners();
  return <AdminPartnersClient initialPartners={partners} />;
}
