"use client";

import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, ImageIcon, Gift } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Perk } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AdminPerksClientProps {
  initialPerks: Perk[];
}

export function AdminPerksClient({ initialPerks }: AdminPerksClientProps) {
  const [perks, setPerks] = useState<Perk[]>(initialPerks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerk, setEditingPerk] = useState<Perk | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    value_badge: "",
    icon_url: "",
    redeem_url: "",
    redeem_label: "Redeem",
    is_limited: false,
  });

  function openCreate() {
    setEditingPerk(null);
    setFormData({
      title: "",
      description: "",
      value_badge: "",
      icon_url: "",
      redeem_url: "",
      redeem_label: "Redeem",
      is_limited: false,
    });
    setIsModalOpen(true);
  }

  function openEdit(perk: Perk) {
    setEditingPerk(perk);
    setFormData({
      title: perk.title,
      description: perk.description || "",
      value_badge: perk.value_badge || "",
      icon_url: perk.icon_url || "",
      redeem_url: perk.redeem_url || "",
      redeem_label: perk.redeem_label || "Redeem",
      is_limited: perk.is_limited || false,
    });
    setIsModalOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const { error } = await supabase.storage.from("perk-icons").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("perk-icons").getPublicUrl(path);
      setFormData((prev) => ({ ...prev, icon_url: urlData.publicUrl }));
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave() {
    const payload = {
      title: formData.title,
      description: formData.description,
      value_badge: formData.value_badge,
      icon_url: formData.icon_url || null,
      redeem_url: formData.redeem_url || null,
      redeem_label: formData.redeem_label || "Redeem",
      is_limited: formData.is_limited,
    };

    if (editingPerk) {
      const { error } = await supabase
        .from("perks")
        .update(payload)
        .eq("id", editingPerk.id);

      if (!error) {
        setPerks(perks.map((p) => (p.id === editingPerk.id ? { ...p, ...payload } : p)));
      }
    } else {
      const { data, error } = await supabase
        .from("perks")
        .insert({
          ...payload,
          display_order: perks.length + 1,
        })
        .select()
        .single();

      if (!error && data) {
        setPerks([...perks, data as Perk]);
      }
    }
    setIsModalOpen(false);
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this perk?")) {
      const { error } = await supabase.from("perks").delete().eq("id", id);
      if (!error) {
        setPerks(perks.filter((p) => p.id !== id));
      }
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Perks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage perks for Superteam Malaysia members
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Perk
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {perks.map((perk) => (
          <Card key={perk.id} className="p-5 group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                {perk.icon_url ? (
                  <img src={perk.icon_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Gift className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEdit(perk)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(perk.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <h3 className="text-sm font-semibold">{perk.title}</h3>
            {perk.value_badge && (
              <span className="text-xs text-muted-foreground mt-1 block">{perk.value_badge}</span>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#080B0E] border-border/50 text-foreground [&_input]:bg-[#171717] [&_input]:border-border/50 [&_textarea]:bg-[#171717] [&_textarea]:border-border/50 [&_button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>{editingPerk ? "Edit Perk" : "Add Perk"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-lg bg-[#171717] overflow-hidden shrink-0">
                  {formData.icon_url ? (
                    <img src={formData.icon_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white"
                >
                  {isUploading ? "Uploading…" : "Upload icon"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="e.g. Devconnect Discounted Ticket"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="cursor-text"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                placeholder="Describe the perk..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-input bg-[#171717] px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-text"
              />
            </div>
            <div className="space-y-2">
              <Label>Value badge (e.g. 50% off, $69 Discount)</Label>
              <Input
                placeholder="50% off"
                value={formData.value_badge}
                onChange={(e) => setFormData({ ...formData, value_badge: e.target.value })}
                className="cursor-text"
              />
            </div>
            <div className="space-y-2">
              <Label>Redeem URL (optional)</Label>
              <Input
                type="url"
                placeholder="https://..."
                value={formData.redeem_url}
                onChange={(e) => setFormData({ ...formData, redeem_url: e.target.value })}
                className="cursor-text"
              />
            </div>
            <div className="space-y-2">
              <Label>Redeem button label</Label>
              <Input
                placeholder="Redeem"
                value={formData.redeem_label}
                onChange={(e) => setFormData({ ...formData, redeem_label: e.target.value })}
                className="cursor-text"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_limited"
                checked={formData.is_limited}
                onChange={(e) => setFormData({ ...formData, is_limited: e.target.checked })}
                className="rounded border-input"
              />
              <Label htmlFor="is_limited" className="cursor-pointer">
                Limited (first come first serve)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="cursor-pointer bg-[#080B0E] border-border/50 hover:bg-[#171717] hover:text-white"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="cursor-pointer">
              {editingPerk ? "Save" : "Add Perk"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
