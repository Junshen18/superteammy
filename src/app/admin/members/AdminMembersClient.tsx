"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Member } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AdminMembersClientProps {
  initialMembers: Member[];
}

export function AdminMembersClient({ initialMembers }: AdminMembersClientProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    bio: "",
    twitter_url: "",
    skill_tags: "",
    is_featured: false,
    is_core_team: false,
  });

  function openCreate() {
    setEditingMember(null);
    setFormData({
      name: "",
      role: "",
      company: "",
      bio: "",
      twitter_url: "",
      skill_tags: "",
      is_featured: false,
      is_core_team: false,
    });
    setIsModalOpen(true);
  }

  function openEdit(member: Member) {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      company: member.company,
      bio: member.bio,
      twitter_url: member.twitter_url,
      skill_tags: member.skill_tags.join(", "),
      is_featured: member.is_featured,
      is_core_team: member.is_core_team,
    });
    setIsModalOpen(true);
  }

  async function handleSave() {
    const payload = {
      ...formData,
      skill_tags: formData.skill_tags.split(",").map((s) => s.trim()),
    };

    if (editingMember) {
      const { error } = await supabase
        .from("members")
        .update(payload)
        .eq("id", editingMember.id);

      if (!error) {
        setMembers(
          members.map((m) =>
            m.id === editingMember.id ? { ...m, ...payload } : m
          )
        );
      }
    } else {
      const { data, error } = await supabase
        .from("members")
        .insert({
          ...payload,
          photo_url: "/images/members/placeholder.jpg",
          achievements: {},
          display_order: members.length + 1,
        })
        .select()
        .single();

      if (!error && data) {
        setMembers([...members, data as Member]);
      }
    }
    setIsModalOpen(false);
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this member?")) {
      const { error } = await supabase.from("members").delete().eq("id", id);
      if (!error) {
        setMembers(members.filter((m) => m.id !== id));
      }
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage community member profiles</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Add Member</Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-solana-purple to-solana-green p-0.5 flex-shrink-0">
                        <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <span className="text-white font-medium">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted">{member.role}</td>
                  <td className="px-6 py-4 text-muted">{member.company}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {member.skill_tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {member.is_featured && (
                      <span className="px-2 py-0.5 rounded-full bg-solana-green/10 text-solana-green text-xs">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(member)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMember ? "Edit Member" : "Add Member"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Input placeholder="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input placeholder="Company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <textarea placeholder="Bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-2">
              <Label>Twitter/X URL</Label>
              <Input type="url" placeholder="https://twitter.com/..." value={formData.twitter_url} onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Skill tags (comma-separated)</Label>
              <Input placeholder="React, Solana, Design" value={formData.skill_tags} onChange={(e) => setFormData({ ...formData, skill_tags: e.target.value })} />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="rounded border-input" /> Featured
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={formData.is_core_team} onChange={(e) => setFormData({ ...formData, is_core_team: e.target.checked })} className="rounded border-input" /> Core Team
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingMember ? "Save Changes" : "Add Member"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
