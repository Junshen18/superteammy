"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { sampleMembers } from "@/lib/data";
import type { Member } from "@/lib/types";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>(sampleMembers);
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

  function handleSave() {
    if (editingMember) {
      setMembers(
        members.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                ...formData,
                skill_tags: formData.skill_tags.split(",").map((s) => s.trim()),
              }
            : m
        )
      );
    } else {
      const newMember: Member = {
        id: String(Date.now()),
        ...formData,
        skill_tags: formData.skill_tags.split(",").map((s) => s.trim()),
        photo_url: "/images/members/placeholder.jpg",
        achievements: {},
        display_order: members.length + 1,
        created_at: new Date().toISOString(),
      };
      setMembers([...members, newMember]);
    }
    setIsModalOpen(false);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this member?")) {
      setMembers(members.filter((m) => m.id !== id));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-orbitron)] text-2xl font-bold text-white">
            Members
          </h1>
          <p className="text-sm text-muted mt-1">
            Manage community member profiles
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-solana-purple to-solana-green hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Members Table */}
      <div className="rounded-xl bg-surface/50 border border-white/5 overflow-hidden">
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
                      <button
                        onClick={() => openEdit(member)}
                        className="p-2 rounded-lg hover:bg-white/5 text-muted hover:text-white transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-surface border border-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                {editingMember ? "Edit Member" : "Add Member"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5 text-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-solana-purple/30"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-solana-purple/30"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-solana-purple/30"
                />
              </div>
              <textarea
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-solana-purple/30 resize-none"
              />
              <input
                type="url"
                placeholder="Twitter/X URL"
                value={formData.twitter_url}
                onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-solana-purple/30"
              />
              <input
                type="text"
                placeholder="Skill tags (comma-separated)"
                value={formData.skill_tags}
                onChange={(e) => setFormData({ ...formData, skill_tags: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-solana-purple/30"
              />
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-white/20 bg-background accent-solana-purple"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_core_team}
                    onChange={(e) => setFormData({ ...formData, is_core_team: e.target.checked })}
                    className="rounded border-white/20 bg-background accent-solana-purple"
                  />
                  Core Team
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg text-sm text-muted hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-solana-purple to-solana-green hover:opacity-90 transition-opacity"
                >
                  {editingMember ? "Save Changes" : "Add Member"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
