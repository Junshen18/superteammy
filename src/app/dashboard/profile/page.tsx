"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, Save } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { LookupTag, SubskillTag } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";

export default function ProfileEditPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [toastExiting, setToastExiting] = useState(false);

  const [nickname, setNickname] = useState("");
  const [realName, setRealName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");
  const [achievements, setAchievements] = useState("");
  const [talkToMeAbout, setTalkToMeAbout] = useState("");

  const [allRoles, setAllRoles] = useState<MultiSelectOption[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<MultiSelectOption[]>([]);
  const [allCompanies, setAllCompanies] = useState<MultiSelectOption[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<MultiSelectOption[]>([]);
  const [allSkills, setAllSkills] = useState<MultiSelectOption[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<MultiSelectOption[]>([]);
  const [allSubskills, setAllSubskills] = useState<(MultiSelectOption & { skill_id?: string })[]>([]);
  const [selectedSubskills, setSelectedSubskills] = useState<MultiSelectOption[]>([]);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!toast) return;
    setToastExiting(false);
    toastTimeoutRef.current = setTimeout(() => {
      setToastExiting(true);
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
        setToastExiting(false);
      }, 300);
    }, 4000);
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [toast]);

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/admin"); return; }
    setUserId(user.id);

    const [profileRes, rolesRes, companiesRes, skillsRes, subskillsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("roles").select("id, name").order("name"),
      supabase.from("companies").select("id, name").order("name"),
      supabase.from("skills").select("id, name").order("name"),
      supabase.from("subskills").select("id, name, skill_id").order("name"),
    ]);

    if (rolesRes.data) setAllRoles(rolesRes.data);
    if (companiesRes.data) setAllCompanies(companiesRes.data);
    if (skillsRes.data) setAllSkills(skillsRes.data);
    if (subskillsRes.data) setAllSubskills(subskillsRes.data);

    if (profileRes.data) {
      const p = profileRes.data;
      setNickname(p.nickname || "");
      setRealName(p.real_name || "");
      setAvatarUrl(p.avatar_url || "");
      setBio(p.bio || "");
      setTwitterUrl(p.twitter_url || "");
      setGithubUrl(p.github_url || "");
      setLinkedinUrl(p.linkedin_url || "");
      setWebsiteUrl(p.website_url || "");
      setTelegramUrl(p.telegram_url || "");
      setAchievements(p.achievements || "");
      setTalkToMeAbout(p.talk_to_me_about || "");
    }

    // Load junction data
    const [prRes, pcRes, psRes, pssRes] = await Promise.all([
      supabase.from("profile_roles").select("role_id, roles:role_id(id, name)").eq("profile_id", user.id),
      supabase.from("profile_companies").select("company_id, companies:company_id(id, name)").eq("profile_id", user.id),
      supabase.from("profile_skills").select("skill_id, skills:skill_id(id, name)").eq("profile_id", user.id),
      supabase.from("profile_subskills").select("subskill_id, subskills:subskill_id(id, name)").eq("profile_id", user.id),
    ]);

    if (prRes.data) setSelectedRoles(prRes.data.map((r: Record<string, unknown>) => r.roles as MultiSelectOption).filter(Boolean));
    if (pcRes.data) setSelectedCompanies(pcRes.data.map((r: Record<string, unknown>) => r.companies as MultiSelectOption).filter(Boolean));
    if (psRes.data) setSelectedSkills(psRes.data.map((r: Record<string, unknown>) => r.skills as MultiSelectOption).filter(Boolean));
    if (pssRes.data) setSelectedSubskills(pssRes.data.map((r: Record<string, unknown>) => r.subskills as MultiSelectOption).filter(Boolean));

    setIsLoading(false);
  }

  async function createTag(table: string, name: string): Promise<MultiSelectOption | null> {
    const { data, error } = await supabase.from(table).insert({ name }).select("id, name").single();
    if (error || !data) return null;
    if (table === "roles") setAllRoles((prev) => [...prev, data]);
    else if (table === "companies") setAllCompanies((prev) => [...prev, data]);
    else if (table === "skills") setAllSkills((prev) => [...prev, data]);
    else if (table === "subskills") setAllSubskills((prev) => [...prev, data as SubskillTag]);
    return data;
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/") || !userId) return;
    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(urlData.publicUrl);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave() {
    if (!userId) return;
    setIsSaving(true);

    const { error } = await supabase.from("profiles").update({
      nickname, real_name: realName, avatar_url: avatarUrl, bio,
      twitter_url: twitterUrl, github_url: githubUrl, linkedin_url: linkedinUrl,
      website_url: websiteUrl, telegram_url: telegramUrl,
      achievements, talk_to_me_about: talkToMeAbout,
    }).eq("id", userId);

    if (error) {
      setToast({ message: "Failed to save profile", type: "error" });
      setIsSaving(false);
      return;
    }

    await Promise.all([
      saveJunction("profile_roles", "role_id", selectedRoles),
      saveJunction("profile_companies", "company_id", selectedCompanies),
      saveJunction("profile_skills", "skill_id", selectedSkills),
      saveJunction("profile_subskills", "subskill_id", selectedSubskills),
    ]);

    setToast({ message: "Profile saved!", type: "success" });
    setIsSaving(false);
  }

  async function saveJunction(table: string, foreignKey: string, items: MultiSelectOption[]) {
    if (!userId) return;
    await supabase.from(table).delete().eq("profile_id", userId);
    if (items.length === 0) return;
    const rows = items.map((item) => ({ profile_id: userId, [foreignKey]: item.id }));
    await supabase.from(table).insert(rows);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Update your community profile</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="cursor-pointer">
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="bg-[#080B0E] border-border/50">
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
          <div className="space-y-2">
              <Label>Profile Picture</Label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#171717] overflow-hidden shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Upload className="w-5 h-5" /></div>
                  )}
                </div>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white">
                  {isUploading ? "Uploading..." : "Upload photo"}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <Label>Nickname</Label>
                <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="bg-[#171717] border-border/50 cursor-text" />
              </div>
              <div className="space-y-2">
                <Label>Real Name</Label>
                <Input value={realName} onChange={(e) => setRealName(e.target.value)} className="bg-[#171717] border-border/50 cursor-text" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Bio</Label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="flex min-h-[100px] w-full rounded-md border border-border/50 bg-[#171717] px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-text" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#080B0E] border-border/50">
          <CardHeader><CardTitle>Professional</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Roles</Label>
              <MultiSelect options={allRoles} selected={selectedRoles} onChange={setSelectedRoles} onCreateNew={(name) => createTag("roles", name)} placeholder="Search or create roles..." />
            </div>
            <div className="space-y-2">
              <Label>Companies</Label>
              <MultiSelect options={allCompanies} selected={selectedCompanies} onChange={setSelectedCompanies} onCreateNew={(name) => createTag("companies", name)} placeholder="Search or create companies..." />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#080B0E] border-border/50">
          <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Skills</Label>
              <MultiSelect options={allSkills} selected={selectedSkills} onChange={setSelectedSkills} onCreateNew={(name) => createTag("skills", name)} placeholder="Search or create skills..." />
            </div>
            <div className="space-y-2">
              <Label>Subskills</Label>
              <MultiSelect options={allSubskills} selected={selectedSubskills} onChange={setSelectedSubskills} onCreateNew={(name) => createTag("subskills", name)} placeholder="Search or create subskills..." />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#080B0E] border-border/50">
          <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Twitter / X</Label>
                <Input value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} placeholder="https://x.com/..." className="bg-[#171717] border-border/50 cursor-text" />
              </div>
              <div className="space-y-2">
                <Label>GitHub</Label>
                <Input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." className="bg-[#171717] border-border/50 cursor-text" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." className="bg-[#171717] border-border/50 cursor-text" />
              </div>
              <div className="space-y-2">
                <Label>Personal Website</Label>
                <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..." className="bg-[#171717] border-border/50 cursor-text" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Telegram</Label>
              <Input value={telegramUrl} onChange={(e) => setTelegramUrl(e.target.value)} placeholder="https://t.me/..." className="bg-[#171717] border-border/50 cursor-text" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#080B0E] border-border/50">
          <CardHeader><CardTitle>About You</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Achievements in Web3</Label>
              <textarea value={achievements} onChange={(e) => setAchievements(e.target.value)} rows={4} placeholder="Hackathon wins, grants, notable projects..." className="flex min-h-[100px] w-full rounded-md border border-border/50 bg-[#171717] px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-text" />
            </div>
            <div className="space-y-2">
              <Label>Talk to me about</Label>
              <textarea value={talkToMeAbout} onChange={(e) => setTalkToMeAbout(e.target.value)} rows={3} placeholder="Topics you're excited to discuss..." className="flex min-h-[80px] w-full rounded-md border border-border/50 bg-[#171717] px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-text" />
            </div>
          </CardContent>
        </Card>
      </div>

      {toast && (
        <div className={cn("fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-lg border border-white/10 bg-[#080B0E] px-4 py-3 shadow-lg transition-all duration-300", toastExiting ? "-translate-y-4 opacity-0" : "translate-y-0 opacity-100")}>
          <p className={cn("text-sm font-medium", toast.type === "error" ? "text-destructive" : "text-foreground")}>{toast.message}</p>
        </div>
      )}
    </div>
  );
}
