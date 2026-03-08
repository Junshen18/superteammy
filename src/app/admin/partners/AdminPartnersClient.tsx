"use client";

import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    website_url: "",
    logo_url: "",
  });

  function openCreate() {
    setEditingPartner(null);
    setFormData({ name: "", website_url: "", logo_url: "" });
    setIsModalOpen(true);
  }

  function openEdit(partner: Partner) {
    setEditingPartner(partner);
    setFormData({ name: partner.name, website_url: partner.website_url, logo_url: partner.logo_url || "" });
    setIsModalOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const { error } = await supabase.storage.from("partner-logos").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("partner-logos").getPublicUrl(path);
      setFormData((prev) => ({ ...prev, logo_url: urlData.publicUrl }));
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave() {
    const payload = { name: formData.name, website_url: formData.website_url, logo_url: formData.logo_url || "/images/partners/placeholder.svg" };
    if (editingPartner) {
      const { error } = await supabase
        .from("partners")
        .update(payload)
        .eq("id", editingPartner.id);

      if (!error) {
        setPartners(partners.map((p) => (p.id === editingPartner.id ? { ...p, ...payload } : p)));
      }
    } else {
      const { data, error } = await supabase
        .from("partners")
        .insert({
          ...payload,
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
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                {partner.logo_url ? (
                  <img src={partner.logo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-muted-foreground">{partner.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(partner)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(partner.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
            <h3 className="text-sm font-semibold">{partner.name}</h3>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#080B0E] border-border/50 text-foreground [&_input]:bg-[#171717] [&_input]:border-border/50 [&_textarea]:bg-[#171717] [&_textarea]:border-border/50 [&_button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>{editingPartner ? "Edit Partner" : "Add Partner"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Logo</Label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-lg bg-[#171717] overflow-hidden shrink-0">
                  {formData.logo_url ? (
                    <img src={formData.logo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-muted-foreground" /></div>
                  )}
                </div>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white">
                  {isUploading ? "Uploading…" : "Upload image"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Partner name</Label>
              <Input placeholder="Partner name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="cursor-text" />
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input type="url" placeholder="https://..." value={formData.website_url} onChange={(e) => setFormData({ ...formData, website_url: e.target.value })} className="cursor-text" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white">Cancel</Button>
            <Button onClick={handleSave} className="cursor-pointer">{editingPartner ? "Save" : "Add Partner"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
