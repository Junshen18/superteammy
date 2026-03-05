"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Partner } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AdminPartnersClientProps {
  initialPartners: Partner[];
}

export function AdminPartnersClient({ initialPartners }: AdminPartnersClientProps) {
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
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

  async function handleSave() {
    if (editingPartner) {
      const { error } = await supabase
        .from("partners")
        .update(formData)
        .eq("id", editingPartner.id);

      if (!error) {
        setPartners(partners.map((p) => (p.id === editingPartner.id ? { ...p, ...formData } : p)));
      }
    } else {
      const { data, error } = await supabase
        .from("partners")
        .insert({
          ...formData,
          logo_url: "/images/partners/placeholder.svg",
          display_order: partners.length + 1,
        })
        .select()
        .single();

      if (!error && data) {
        setPartners([...partners, data as Partner]);
      }
    }
    setIsModalOpen(false);
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this partner?")) {
      const { error } = await supabase.from("partners").delete().eq("id", id);
      if (!error) {
        setPartners(partners.filter((p) => p.id !== id));
      }
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
          <h1 className="text-2xl font-bold">Partners</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage ecosystem partners and sponsors</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Add Partner</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((partner) => (
          <Card key={partner.id} className="p-5 group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-lg font-bold text-muted-foreground">{partner.name.charAt(0)}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(partner)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(partner.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
            <h3 className="text-sm font-semibold mb-1">{partner.name}</h3>
            <span className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">{categoryLabels[partner.category]}</span>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPartner ? "Edit Partner" : "Add Partner"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Partner name</Label>
              <Input placeholder="Partner name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input type="url" placeholder="https://..." value={formData.website_url} onChange={(e) => setFormData({ ...formData, website_url: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as Partner["category"] })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="solana_project">Solana Project</option>
                <option value="malaysian_partner">Malaysian Partner</option>
                <option value="sponsor">Sponsor</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingPartner ? "Save" : "Add Partner"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
