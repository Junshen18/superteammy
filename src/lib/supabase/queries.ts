import { createServerClient } from "./server";
import type { Member, Event, Partner, Stat, Testimonial, FAQ } from "../types";

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
