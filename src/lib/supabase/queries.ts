import { createServerClient } from "./server";
import type { Member, Event, Partner, Stat, Testimonial, FAQ, Profile, Invite, LookupTag, SubskillTag, Project, Perk } from "../types";

export async function getMembers(): Promise<Member[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch members:", error.message);
    return [];
  }
  return data as Member[];
}

export async function getFeaturedMembers(): Promise<Member[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("is_featured", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch featured members:", error.message);
    return [];
  }
  return data as Member[];
}

export async function getEvents(opts?: { includeArchived?: boolean }): Promise<Event[]> {
  const supabase = await createServerClient();
  let q = supabase.from("events").select("*").order("date", { ascending: false });
  if (!opts?.includeArchived) {
    q = q.or("is_archived.is.null,is_archived.eq.false");
  }
  const { data, error } = await q;

  if (error) {
    console.error("Failed to fetch events:", error.message);
    return [];
  }
  return data as Event[];
}

export async function getPartners(): Promise<Partner[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch partners:", error.message);
    return [];
  }
  return data as Partner[];
}

export async function getStats(): Promise<Stat[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("stats")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch stats:", error.message);
    return [];
  }
  return data as Stat[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("is_featured", { ascending: false });

  if (error) {
    console.error("Failed to fetch testimonials:", error.message);
    return [];
  }
  return data as Testimonial[];
}

export async function getFAQs(): Promise<FAQ[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch FAQs:", error.message);
    return [];
  }
  return data as FAQ[];
}

export async function getProfiles(): Promise<Profile[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("onboarding_completed", true)
    .or("is_active.is.null,is_active.eq.true")
    .order("member_number", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("Failed to fetch profiles:", error.message);
    return [];
  }

  const profiles = data as Profile[];
  return attachProfileRelations(supabase, profiles);
}

export async function getAllProfiles(): Promise<Profile[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch all profiles:", error.message);
    return [];
  }

  const profiles = data as Profile[];
  return attachProfileRelations(supabase, profiles);
}

export async function getFeaturedProfiles(): Promise<Profile[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_featured", true)
    .eq("onboarding_completed", true)
    .or("is_active.is.null,is_active.eq.true")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch featured profiles:", error.message);
    return [];
  }

  const profiles = data as Profile[];
  return attachProfileRelations(supabase, profiles);
}

async function attachProfileRelations(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  profiles: Profile[]
): Promise<Profile[]> {
  if (profiles.length === 0) return profiles;

  const ids = profiles.map((p) => p.id);

  const [rolesRes, companiesRes, skillsRes, subskillsRes] = await Promise.all([
    supabase
      .from("profile_roles")
      .select("profile_id, roles:role_id(id, name)")
      .in("profile_id", ids),
    supabase
      .from("profile_companies")
      .select("profile_id, companies:company_id(id, name)")
      .in("profile_id", ids),
    supabase
      .from("profile_skills")
      .select("profile_id, skills:skill_id(id, name)")
      .in("profile_id", ids),
    supabase
      .from("profile_subskills")
      .select("profile_id, subskills:subskill_id(id, name, skill_id)")
      .in("profile_id", ids),
  ]);

  const rolesMap = groupByProfile<LookupTag>(rolesRes.data, "roles");
  const companiesMap = groupByProfile<LookupTag>(companiesRes.data, "companies");
  const skillsMap = groupByProfile<LookupTag>(skillsRes.data, "skills");
  const subskillsMap = groupByProfile<SubskillTag>(subskillsRes.data, "subskills");

  return profiles.map((p) => ({
    ...p,
    roles: rolesMap[p.id] ?? [],
    companies: companiesMap[p.id] ?? [],
    skills: skillsMap[p.id] ?? [],
    subskills: subskillsMap[p.id] ?? [],
  }));
}

function groupByProfile<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[] | null,
  key: string
): Record<string, T[]> {
  const map: Record<string, T[]> = {};
  if (!rows) return map;
  for (const row of rows) {
    const pid = row.profile_id as string;
    const val = row[key] as T;
    if (!val) continue;
    if (!map[pid]) map[pid] = [];
    map[pid].push(val);
  }
  return map;
}

export async function getInvites(): Promise<Invite[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("invites")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch invites:", error.message);
    return [];
  }
  return data as Invite[];
}

export async function getLookupTags(table: "roles" | "companies" | "skills" | "subskills"): Promise<LookupTag[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from(table).select("id, name").order("name");
  if (error) {
    console.error(`Failed to fetch ${table}:`, error.message);
    return [];
  }
  return data as LookupTag[];
}

export async function getSubskills(): Promise<SubskillTag[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("subskills").select("id, name, skill_id").order("name");
  if (error) {
    console.error("Failed to fetch subskills:", error.message);
    return [];
  }
  return data as SubskillTag[];
}

export async function getPerks(): Promise<Perk[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("perks")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch perks:", error.message);
    return [];
  }
  return data as Perk[];
}

export async function getProfileProjects(profileId: string): Promise<Project[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch projects:", error.message);
    return [];
  }
  return data as Project[];
}
