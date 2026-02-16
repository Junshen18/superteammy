"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { samplePartners } from "@/lib/data";
import type { Partner } from "@/lib/types";

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(samplePartners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    website_url: "",
    category: "solana_project" as Partner["category"],
  });

  function openCreate() {
    setEditingPartner(null);
    setFormData({ name: "", website_url: "", category: "solana_project" });
    setIsModalOpen(true);
  }

  function openEdit(partner: Partner) {
    setEditingPartner(partner);
    setFormData({ name: partner.name, website_url: partner.website_url, category: partner.category });
    setIsModalOpen(true);
  }

  function handleSave() {
    if (editingPartner) {
      setPartners(partners.map((p) => (p.id === editingPartner.id ? { ...p, ...formData } : p)));
    } else {
      const newPartner: Partner = {
        id: String(Date.now()),
        ...formData,
        logo_url: "/images/partners/placeholder.svg",
        display_order: partners.length + 1,
      };
      setPartners([...partners, newPartner]);
    }
    setIsModalOpen(false);
  }

  function handleDelete(id: string) {
    if (confirm("Delete this partner?")) {
      setPartners(partners.filter((p) => p.id !== id));
    }
  }

  const categoryLabels: Record<Partner["category"], string> = {
    solana_project: "Solana Project",
    malaysian_partner: "Malaysian Partner",
    sponsor: "Sponsor",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-white">Partners</h1>
          <p className="text-sm text-muted mt-1">Manage ecosystem partners and sponsors</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-solana-purple to-solana-green hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((partner) => (
          <div key={partner.id} className="p-5 rounded-xl bg-surface/50 border border-white/5 group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <span className="text-lg font-bold text-muted">{partner.name.charAt(0)}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(partner)} className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(partner.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">{partner.name}</h3>
            <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-muted-dark">{categoryLabels[partner.category]}</span>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface border border-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">{editingPartner ? "Edit Partner" : "Add Partner"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-white/5 text-muted"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Partner name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-solana-purple/30" />
              <input type="url" placeholder="Website URL" value={formData.website_url} onChange={(e) => setFormData({ ...formData, website_url: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-solana-purple/30" />
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as Partner["category"] })} className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-white text-sm focus:outline-none focus:border-solana-purple/30">
                <option value="solana_project">Solana Project</option>
                <option value="malaysian_partner">Malaysian Partner</option>
                <option value="sponsor">Sponsor</option>
              </select>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm text-muted hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-solana-purple to-solana-green hover:opacity-90 transition-opacity">{editingPartner ? "Save" : "Add Partner"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
